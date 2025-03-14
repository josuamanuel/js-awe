"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plan = void 0;
const fluture_1 = require("fluture");
const ramdaExt_js_1 = require("./ramdaExt.js");
const just_compare_1 = __importDefault(require("just-compare"));
const jsUtils_js_1 = require("./jsUtils.js");
const convertPathToStackPath = path => path.map((el, index) => {
    if (index === 0)
        return 0;
    return parseInt(el, 10);
});
function generateStack(plan) {
    let stack = [];
    const reviver = (nodeRef, currentPath, parent) => {
        if (typeof nodeRef === 'function' && isNaN(parseInt(currentPath.at(-1), 10)) === false)
            stack.push({ value: nodeRef, path: convertPathToStackPath(currentPath) });
        return undefined;
    };
    (0, jsUtils_js_1.traverse)(plan, reviver);
    stack.push({ value: ramdaExt_js_1.R.identity, path: [1] });
    return stack;
}
const isAncestorOf = son => parent => (son === null || son === void 0 ? void 0 : son.length) > (parent === null || parent === void 0 ? void 0 : parent.length) && (0, just_compare_1.default)(parent, son.slice(0, parent.length));
const isSiblingOf = sibling1 => sibling2 => (0, just_compare_1.default)(sibling1 === null || sibling1 === void 0 ? void 0 : sibling1.slice(0, -1), sibling2 === null || sibling2 === void 0 ? void 0 : sibling2.slice(0, -1));
function hasAnyDescendant(stack) {
    return path => stack.some(el => path.length < el.path.length &&
        (0, just_compare_1.default)(el.path.slice(0, path.length), path));
}
function getDescendants(stack) {
    return path => stack.filter(el => path.length < el.path.length &&
        (0, just_compare_1.default)(el.path.slice(0, path.length), path));
}
function areRelativeFrom(ancestorInCommon) {
    if (ancestorInCommon === undefined || ancestorInCommon.length === 0)
        return false;
    return familyMember1 => familyMember2 => (0, just_compare_1.default)(ancestorInCommon, familyMember1 === null || familyMember1 === void 0 ? void 0 : familyMember1.slice(0, ancestorInCommon.length)) &&
        (0, just_compare_1.default)(ancestorInCommon, familyMember2 === null || familyMember2 === void 0 ? void 0 : familyMember2.slice(0, ancestorInCommon.length));
}
// areRelativeFrom([0,0])([0,0,0,0])([0,0]) //?
const stackSiblingsReducer = (acum, el, index) => {
    var _a;
    if (isSiblingOf((_a = ramdaExt_js_1.R.last(acum)) === null || _a === void 0 ? void 0 : _a.path)(el.path)) {
        acum[acum.length - 1].value = (0, ramdaExt_js_1.pipe)(ramdaExt_js_1.R.last(acum).value, el.value);
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
        var _a, _b;
        const elParent = el.path.slice(0, -1);
        const elGrandparent = elParent === null || elParent === void 0 ? void 0 : elParent.slice(0, -1);
        const nextToEl = (_a = stack[index + 1]) === null || _a === void 0 ? void 0 : _a.path;
        const nextToElParent = nextToEl === null || nextToEl === void 0 ? void 0 : nextToEl.slice(0, -1);
        const nextToElGrandparent = nextToElParent === null || nextToElParent === void 0 ? void 0 : nextToElParent.slice(0, -1);
        const previousToEl = (_b = stack[index - 1]) === null || _b === void 0 ? void 0 : _b.path;
        const previousToElGrandparent = previousToEl === null || previousToEl === void 0 ? void 0 : previousToEl.slice(0, -2);
        let isElToAccrue = el.path.length >= 3 &&
            (0, just_compare_1.default)(elGrandparent, nextToElGrandparent) &&
            // el is the only child of parent
            (0, just_compare_1.default)(getDescendants(stack)(elParent), [el]) &&
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
            if ((nextToEl === null || nextToEl === void 0 ? void 0 : nextToEl.length) > el.path.length && isAncestorOf(nextToEl)(elGrandparent)) {
                acum.push(...stackItemsToParallelize);
                acum.push(el);
                accruingParallel = false;
                stackItemsToParallelize = [];
                return acum;
            }
            // Rest of cases we need to follow with parallelization including current element.
            stackItemsToParallelize.push(el);
            acum.push({
                value: (0, ramdaExt_js_1.runFunctionsSyncOrParallel)(numberOfThreads)(ramdaExt_js_1.R.pluck('value', stackItemsToParallelize)),
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
    (0, jsUtils_js_1.repeat)(stack.length).times(index => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (((_b = (_a = stack[index]) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.length) > ((_d = (_c = stack[index + 1]) === null || _c === void 0 ? void 0 : _c.path) === null || _d === void 0 ? void 0 : _d.length)) {
            if (biggerLengthValue < ((_f = (_e = stack[index]) === null || _e === void 0 ? void 0 : _e.path) === null || _f === void 0 ? void 0 : _f.length)) {
                biggerLengthValue = (_h = (_g = stack[index]) === null || _g === void 0 ? void 0 : _g.path) === null || _h === void 0 ? void 0 : _h.length;
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
const extractFinalValue = x => { var _a, _b; return (_b = (_a = x[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : x === null || x === void 0 ? void 0 : x.value; };
const lengthStackPrevLessThanCurr = function () {
    let prevStack;
    return [
        function funCond(stack) {
            const result = ((stack === null || stack === void 0 ? void 0 : stack.length) < (prevStack === null || prevStack === void 0 ? void 0 : prevStack.length)) || prevStack === undefined;
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
            if ((mockupsObj === null || mockupsObj === void 0 ? void 0 : mockupsObj[value.name]) !== undefined) {
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
        const toExec = (0, ramdaExt_js_1.pipe)(generateStack, changeFunWithMockupsObj(mockupsObj), (0, ramdaExt_js_1.pipeWhile)(stack => stack.length > 1)((0, ramdaExt_js_1.pipeWhile)(...lengthStackPrevLessThanCurr())(acumSiblings, acumParallel(numberOfThreads)), reduceNesting), extractFinalValue)(planDef);
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
                return (0, ramdaExt_js_1.runFunctionsSyncOrParallel)(mapThreads)(data.map(param => fun.bind(fun, param)))();
            return [fun(data)];
        };
    }
    function identity(...args) {
        if (args.length > 1)
            throw new Error('identity function only accepts one argument');
        return args[0];
    }
    return { build, map, identity };
}
exports.plan = plan;
