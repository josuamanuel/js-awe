import { resolve } from 'fluture';
import { R, pipe, pipeWhile, runFunctionsSyncOrParallel } from './ramdaExt.js';
import compare from 'just-compare';
import { repeat, traverse } from './jsUtils.js';
const convertPathToStackPath = path => path.map((el, index) => {
    if (index === 0)
        return 0;
    return parseInt(el, 10);
});
function generateStack(plan) {
    let stack = [];
    const reviver = (nodeRef, currentPath, parent) => {
        if (typeof nodeRef === 'function')
            stack.push({ value: nodeRef, path: convertPathToStackPath(currentPath) });
        return undefined;
    };
    traverse(plan, reviver);
    stack.push({ value: R.identity, path: [1] });
    return stack;
}
const isAncestorOf = son => parent => son?.length > parent?.length && compare(parent, son.slice(0, parent.length));
const isSiblingOf = sibling1 => sibling2 => compare(sibling1?.slice(0, -1), sibling2?.slice(0, -1));
function hasAnyDescendant(stack) {
    return path => stack.some(el => path.length < el.path.length &&
        compare(el.path.slice(0, path.length), path));
}
function getDescendants(stack) {
    return path => stack.filter(el => path.length < el.path.length &&
        compare(el.path.slice(0, path.length), path));
}
function areRelativeFrom(ancestorInCommon) {
    if (ancestorInCommon === undefined || ancestorInCommon.length === 0)
        return false;
    return familyMember1 => familyMember2 => compare(ancestorInCommon, familyMember1?.slice(0, ancestorInCommon.length)) &&
        compare(ancestorInCommon, familyMember2?.slice(0, ancestorInCommon.length));
}
areRelativeFrom([0, 0])([0, 0, 0, 0])([0, 0]); //?
const stackSiblingsReducer = (acum, el, index) => {
    if (isSiblingOf(R.last(acum)?.path)(el.path)) {
        acum[acum.length - 1].value = pipe(R.last(acum).value, el.value);
    }
    else {
        acum.push(el);
    }
    return acum;
};
function acumSiblings(stack) {
    return stack.reduce(stackSiblingsReducer, []);
}
const stackParallelReducer = function (numberOfThreads) {
    let accruingParallel = false;
    let stackItemsToParallelize = [];
    return (acum, el, index, stack) => {
        const elParent = el.path.slice(0, -1);
        const elGrandparent = elParent?.slice(0, -1);
        const nextToEl = stack[index + 1]?.path;
        const nextToElParent = nextToEl?.slice(0, -1);
        const nextToElGrandparent = nextToElParent?.slice(0, -1);
        const previousToEl = stack[index - 1]?.path;
        const previousToElGrandparent = previousToEl?.slice(0, -2);
        let isElToAccrue = el.path.length >= 3 &&
            compare(elGrandparent, nextToElGrandparent) &&
            // el is the only child of parent
            compare(getDescendants(stack)(elParent), [el]) &&
            // If previous was not accrued we dont want this to be desdendent of the current grandParent unless previous
            // is a brother of the parent (function header of subsequent parellel functions).
            (accruingParallel ||
                isAncestorOf(previousToEl)(elGrandparent) === false ||
                (isAncestorOf(previousToEl)(elGrandparent) === true && previousToEl.length < el.path.length));
        if (isElToAccrue === true) {
            accruingParallel = true;
            stackItemsToParallelize.push(el);
        }
        if (isElToAccrue === false && accruingParallel === true) {
            // In cases we stopped because next element is more nested than our current parallelization
            // even though it has the grandParent as ancestor, then we need to cancel accruing and 
            // restore all elements to acum.
            if (nextToEl?.length > el.path.length && isAncestorOf(nextToEl)(elGrandparent)) {
                acum.push(...stackItemsToParallelize);
                acum.push(el);
                accruingParallel = false;
                stackItemsToParallelize = [];
                return acum;
            }
            // Rest of cases we need to follow with parallelization including current element.
            stackItemsToParallelize.push(el);
            acum.push({
                value: runFunctionsSyncOrParallel(numberOfThreads)(R.pluck('value', stackItemsToParallelize)),
                path: el.path.slice(0, -1)
            });
        }
        if (isElToAccrue === false && accruingParallel === false) {
            acum.push(el);
        }
        if (isElToAccrue === false) {
            accruingParallel = false;
            stackItemsToParallelize = [];
        }
        return acum;
    };
};
const acumParallel = numberOfThreads => stack => {
    return stack.reduce(stackParallelReducer(numberOfThreads), []);
};
const reduceNesting = (stack) => {
    let biggerLengthIndex;
    let biggerLengthValue = -1;
    repeat(stack.length).times(index => {
        if (stack[index]?.path?.length > stack[index + 1]?.path?.length) {
            if (biggerLengthValue < stack[index]?.path?.length) {
                biggerLengthValue = stack[index]?.path?.length;
                biggerLengthIndex = index;
            }
        }
    });
    let newStack = stack;
    if (biggerLengthIndex !== undefined) {
        newStack = [...stack];
        newStack[biggerLengthIndex] =
            {
                value: newStack[biggerLengthIndex].value,
                path: newStack[biggerLengthIndex].path.slice(0, -1)
            };
    }
    return newStack;
};
const extractFinalValue = x => x[0]?.value ?? x?.value;
const lengthStackPrevLessThanCurr = function () {
    let prevStack;
    return [
        function funCond(stack) {
            const result = (stack?.length < prevStack?.length) || prevStack === undefined;
            prevStack = stack;
            return result;
        },
        function ini() {
            prevStack = undefined;
        }
    ];
};
function changeFunWithMockupsObj(mockupsObj) {
    return stack => {
        if (!mockupsObj)
            return stack;
        return stack.map(({ path, value }) => {
            if (mockupsObj?.[value.name] !== undefined) {
                if (typeof mockupsObj[value.name] === 'function') {
                    return {
                        value: mockupsObj[value.name],
                        path
                    };
                }
                return {
                    value: () => mockupsObj[value.name],
                    path
                };
            }
            return { value: value, path };
        });
    };
}
function plan({ numberOfThreads = Infinity, mockupsObj = {} } = { numberOfThreads: Infinity, mockupsObj: {} }) {
    function build(planDef) {
        const toExec = pipe(generateStack, changeFunWithMockupsObj(mockupsObj), pipeWhile(stack => stack.length > 1)(pipeWhile(...lengthStackPrevLessThanCurr())(acumSiblings, acumParallel(numberOfThreads)), reduceNesting), extractFinalValue)(planDef);
        toExec.rebuild = (options) => {
            setOptions(options);
            return build(planDef);
        };
        return toExec;
    }
    function setOptions(options) {
        ({ numberOfThreads, mockupsObj } = options);
    }
    function map(fun, mapThreads = numberOfThreads) {
        return (data) => {
            if (Array.isArray(data))
                return runFunctionsSyncOrParallel(mapThreads)(data.map(param => fun.bind(fun, param)))();
            return [fun(data)];
        };
    }
    return { build, map };
}
export { plan };
