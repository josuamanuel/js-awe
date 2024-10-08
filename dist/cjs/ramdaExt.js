"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialAtPos = exports.uncurry = exports.mergeArrayOfObjectsRenamingProps = exports.pickPaths = exports.something = exports.findSolution = exports.RLog = exports.runFunctionsSyncOrParallel = exports.runFutureFunctionsInParallel = exports.parallel = exports.pipeWhile = exports.pipe = exports.pipeWithChain = exports.exclude = exports.mapWithPrevious = exports.mapWithNext = exports.filterMap = exports.splitCond = exports.matchByPropId = exports.between = exports.updateWithHashKeys = exports.unionWithHashKeys = exports.innerRightJoinWith = exports.groupByWithCalc = exports.RE = exports.R = void 0;
// ts-check
const R = __importStar(require("ramda"));
exports.R = R;
const jsUtils_js_1 = require("./jsUtils.js");
const fluture_1 = require("fluture");
const just_clone_1 = __importDefault(require("just-clone"));
// //Only needed for testing
// import {  after, both, chain, map, fork } from 'fluture';
// import { repeat } from './jsUtils.js' 
const RE = {};
exports.RE = RE;
const groupByWithCalcUnc = (cond, keyOp) => data => {
    const opsToApply = Object.entries(keyOp);
    const groupObj = data.reduce((acum, current, index) => {
        const indexRow = cond(current);
        opsToApply.forEach(([key, opFunc]) => {
            var _a, _b;
            acum[indexRow] = (_a = acum[indexRow]) !== null && _a !== void 0 ? _a : {};
            acum[indexRow][key] = opFunc((_b = acum[indexRow]) === null || _b === void 0 ? void 0 : _b[key], current === null || current === void 0 ? void 0 : current[key], acum[indexRow], current);
        });
        acum[indexRow] = Object.assign(Object.assign({}, current), acum[indexRow]);
        return acum;
    }, {});
    return Object.values(groupObj);
};
const groupByWithCalc = R.curryN(2, groupByWithCalcUnc);
exports.groupByWithCalc = groupByWithCalc;
RE.groupByWithCalc = groupByWithCalc;
// RE.groupByWithCalc(
//   (row) => row.date,
//   {
//     total:(acum,current) => (acum??0) + current,
//     count:(acum,current) => (acum??0) + 1,
//     line:(acum,current) => acum??current,
//     listOfLines:(acum,current, acumRow, currentRow) =>{(acum=acum??[]).push(currentRow.line); return acum},
//     rowCalc:(acum,_,acumRow, currentRow) => (acum??0) + currentRow.line + currentRow.total
//   },
// )(
//   [
//     {date:'2020-01-02', line:1, total:6}, 
//     {date:'2020-01-03', line:2, total:5}, 
//     {date:'2020-01-02', line:3, total:11}, 
//     {date:'2020-01-03', line:4, total:6}, 
//     {date:'2020-01-02', line:5, total:-5}
//   ]
// )//?
const innerRightJoinWithUnc = (joinCond, transform = (k, l, r) => r, left, right) => {
    const joinCondCurry = R.uncurryN(2, joinCond);
    return R.chain(rightRow => {
        const mergeRecords = R.pipe(R.filter(joinCondCurry(R.__, rightRow)), R.map(R.mergeWithKey(transform, R.__, rightRow)))(left);
        if (mergeRecords.length === 0)
            return rightRow;
        return mergeRecords;
    })(right);
};
const innerRightJoinWith = R.curryN(4, innerRightJoinWithUnc);
exports.innerRightJoinWith = innerRightJoinWith;
RE.innerRightJoinWith = innerRightJoinWith;
// RE.innerRightJoinWith(
//   (l,r) => l.date === r.date,
//   (k, l, r) => k==='total' 
//     ? l + r
//     : r,
//   [{date:'2020-01-02', total:6},  {date:'2020-01-08', total:8}, {date:'2020-01-03', total:5}]
// )
// (
//   [{date:'2020-01-02', total:11},  {date:'2020-01-09', total:9}, {date:'2020-01-03', total:6}]
// )//?
function unionWithHashKeysUnc(isAsc, hashAddNoDups, addNoDupsToTheEnd, hashMaster, master) {
    const union = new Map();
    for (let elem of master) {
        union.set(hashMaster(elem), elem);
    }
    for (let elem of addNoDupsToTheEnd) {
        if (union.get(hashAddNoDups(elem)) === undefined)
            union.set(hashAddNoDups(elem), elem);
    }
    if (isAsc === true || isAsc === false) {
        return Array.from(union.entries()).sort((0, jsUtils_js_1.sorterByPaths)('0', isAsc)).map(elem => elem[1]);
    }
    return Array.from(union.values());
}
const unionWithHashKeys = R.curryN(5, unionWithHashKeysUnc);
exports.unionWithHashKeys = unionWithHashKeys;
RE.unionWithHashKeys = unionWithHashKeys;
// RE.unionWithHashKeys(undefined,
//   elem=>elem.date,
//   [{date:'2020-01-02', a:4},{date:'2020-01-03'}],
//   elem=>elem.date
// )(
//   [{date:'2020-01-01'},{date:'2020-01-02',a:1}]
// )//?
function isOldLessThanNew(hashOldRecords, hashNewRecords) {
    if (hashOldRecords === hashNewRecords)
        return false;
    if (hashNewRecords === undefined)
        return true;
    if (hashOldRecords < hashNewRecords)
        return true;
    return false;
}
function isOldGreatThanNew(hashOldRecords, hashNewRecords) {
    if (hashOldRecords === hashNewRecords)
        return false;
    if (hashOldRecords === undefined)
        return true;
    if (hashOldRecords > hashNewRecords)
        return true;
    return false;
}
function callFuncOrUndefinedIfError(value, func) {
    try {
        return func(value);
    }
    catch (err) {
        return undefined;
    }
}
function updateWithHashKeysUnc(isAsc, getHashNewRecords, newRecords, getHashOldRecords, oldRecords) {
    const union = new Map();
    let hashNewRecords = callFuncOrUndefinedIfError(newRecords[0], getHashNewRecords);
    let hashOldRecords = callFuncOrUndefinedIfError(oldRecords[0], getHashOldRecords);
    for (let i = 0, j = 0; i < newRecords.length || j < oldRecords.length;) {
        if (isOldLessThanNew(hashOldRecords, hashNewRecords)) {
            if (union.get(hashOldRecords) === undefined)
                union.set(hashOldRecords, oldRecords[j]);
            j++;
            hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords);
        }
        else {
            if (isOldGreatThanNew(hashOldRecords, hashNewRecords)) {
                union.set(hashNewRecords, newRecords[i]);
                i++;
                hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords);
            }
            else {
                union.set(hashNewRecords, newRecords[i]);
                i++;
                j++;
                hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords);
                hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords);
            }
        }
    }
    if (isAsc === true || isAsc === false) {
        return Array.from(union.entries()).sort((0, jsUtils_js_1.sorterByPaths)('0', isAsc)).map(elem => elem[1]);
    }
    return Array.from(union.values());
}
const updateWithHashKeys = R.curryN(5, updateWithHashKeysUnc);
exports.updateWithHashKeys = updateWithHashKeys;
RE.updateWithHashKeys = updateWithHashKeys;
// RE.updateWithHashKeys(
//   true,
//   elem=>elem.date,
//    [{date:'2020-01-08'},{date:'2020-01-03'},{date:'2020-01-02',a:2},{date:'2020-01-05',a:1}],
//    elem=>elem.date
// )(
//   [{date:'2020-01-08',a:4},{date:'2020-01-01',a:1},{date:'2020-01-05',a:5}]
// )//?
// RE.updateWithHashKeys(
//   undefined,
//   elem=>elem.date,
//    [{date:'2020-01-01'},{date:'2020-01-03'},{date:'2020-01-05',a:2},{date:'2020-01-08',a:1}],
//    elem=>elem.date
// )(
//   [{date:'2020-01-02',a:4},{date:'2020-01-03',a:1},{date:'2020-01-08',a:5}]
// )//?
const between = R.curry((l, r) => (R.both(R.gte(R.__, l), R.lt(R.__, r))));
exports.between = between;
RE.between = between;
const matchById = (l, r) => R.isNil(l) === false
    && R.isNil(r) === false
    && ((l.id || l.Id || l.ID) === (r.id || r.Id || r.ID))
    && ((l.id || l.Id || l.ID) !== undefined);
const matchByPropId = R.curryN(2, matchById);
exports.matchByPropId = matchByPropId;
RE.matchByPropId = matchByPropId;
// Returns matching in 1st index and filtered out in 0 index... followin success goes to the end rule.
function splitCondUnc(condFun, array) {
    return R.reduce((acu, cur) => {
        if (condFun(cur))
            return R.update(1, R.append(cur, acu[1]), acu);
        else
            return R.update(0, R.append(cur, acu[0]), acu);
    }, [[], []]);
}
const splitCond = R.curryN(2, splitCondUnc);
exports.splitCond = splitCond;
RE.splitCond = splitCond;
const filterMap = R.curry((filter, map, data) => data.reduce((acum, current, index, data) => {
    if (filter(current, index, data)) {
        acum.push(map(current, index, data));
    }
    return acum;
}, []));
exports.filterMap = filterMap;
RE.filterMap = filterMap;
const mapWithNext = R.curry((mapper, endValue, array) => array.map((elem, index) => {
    let nextValue;
    if (index === array.length - 1)
        nextValue = endValue;
    else
        nextValue = array[index + 1];
    return mapper(elem, nextValue);
}));
exports.mapWithNext = mapWithNext;
RE.mapWithNext = mapWithNext;
const mapWithPrevious = R.curry((mapper, iniValue, array) => array.map((elem, index) => {
    let previousValue;
    if (index === 0)
        previousValue = iniValue;
    else
        previousValue = array[index - 1];
    return mapper(previousValue, elem);
}));
exports.mapWithPrevious = mapWithPrevious;
RE.mapWithPrevious = mapWithPrevious;
const exclude = R.curry((fieldToRemove, valuesToRemove, fieldSubject, subjectArray) => subjectArray.filter((subjectEl) => {
    let finalSubjectEl = subjectEl;
    if (fieldSubject !== undefined && fieldSubject !== null && typeof fieldSubject !== 'function')
        finalSubjectEl = subjectEl[fieldSubject];
    if (fieldSubject !== undefined && fieldSubject !== null && typeof fieldSubject === 'function')
        finalSubjectEl = fieldSubject(subjectEl);
    return !valuesToRemove.find((valToRemove) => {
        let finalValToRemove = valToRemove;
        if (fieldToRemove !== undefined && fieldToRemove !== null && typeof fieldToRemove !== 'function')
            finalValToRemove = valToRemove[fieldToRemove];
        if (fieldToRemove !== undefined && fieldToRemove !== null && typeof fieldToRemove === 'function')
            finalValToRemove = fieldToRemove(valToRemove);
        return finalSubjectEl === finalValToRemove;
    });
}));
exports.exclude = exclude;
RE.exclude = exclude;
// exclude('id',[{id:2},{id:6}], undefined, [1,2,3,4,5,6,7,8]) //?
// exclude('id',[{id:2},{id:6}], 'key', [{key:1, age:1},{key:2, age:2},{key:4, age:4},{key:5, age:5}]) //?
// exclude(
//   (el=>el.date.toISOString()),
//   [{date:new Date('2023-01-01')},{date:new Date('2023-03-03')}],
//   (el=>el.myDate.toISOString()),
//   [{myDate:new Date('2023-01-12'),a:2}, {myDate:new Date('2023-01-01')},{myDate:new Date('2023-01-12'),a:8},{myDate:new Date('2023-01-04')},{myDate:new Date('2023-03-03')}, {myDate:new Date('2023-03-01')}],
// )//?
const n0IsNotUnfold = R.pipe(R.propEq('0', 'unfold'), R.not);
const n1IsFunction = R.pipe(R.prop('1'), R.type, R.equals('Function'));
function something(lib) {
    return (...args) => R.pipe(
    // Convert to an array of for each function with array of 2 elements: 0 (key) name of function, 1 (value) function
    Object.entries, RE.filterMap(R.both(n0IsNotUnfold, n1IsFunction), R.chain(
    // add a 3rd value. Now we will have 0: name function, 1: function, 2 result
    R.append, R.pipe(
    //R.tap(R.pipe(R.prop('0'),console.log)),
    R.prop('1'), R.tryCatch(R.pipe(
    //R.uncurryN(args.length),
    fun => {
        const funU = uncurry(true)(fun);
        const firstResult = funU(...R.clone(args));
        if (typeof firstResult[0] === 'function' && args.length > 1) {
            return funU(R.clone(...R.init(args)))(R.clone(R.last(args)));
        }
        return firstResult;
    }), (exc, fun) => {
        try {
            return [
                fun(R.clone(...R.init(args)))(R.clone(R.last(args))),
                '(all,arguments,but)(last)'
            ];
        }
        catch (e) {
            return ['error'];
        }
    })))))(lib);
}
exports.something = something;
/* Returns:
[ { fun: 'applySpec', sign: '(object)(object)' },
  { fun: 'juxt', sign: '(object)(object)' } ]
*/
//findSolution([{a:2},{a:2,b:2}, 7], something(R)([obj=>obj,obj=>({...obj, b:2}), obj=>obj.a+5], {a:2})) //?
/*
  findSolution(solution, something(R)(param1, param2, param3))

  Find the function in the library (this case R) that calling using the params gives the input solution.

  for example below:
    We need to find a function in R that given the parameters 4,3 the result is 7. Of course it is R.add
*/
//const Rsomething = something(R)
//findSolution(7, Rsomething(4, 3)) //?
//
// findSolution(
//   [[true,false],[1,{a:2},3]], 
//   something(R)(
//     (elem)=> typeof elem === 'boolean'?0:1,
//     [true, 1, {a:2},false,3]
//   )
// ) //? [ { fun: 'collectBy', sign: '(function,object)' } ]
function findSolution(solutionToFind, solutions) {
    return R.tryCatch(R.pipe(R.filter((solution) => R.equals(solution[2][0], solutionToFind)), R.map(R.applySpec({ fun: R.prop('0'), sign: R.path(['2', '1']) }))), () => [])(solutions);
}
exports.findSolution = findSolution;
function partialAtPos(fun, pos) {
    return (...paramValues) => {
        let funAcum = fun;
        let count = 0;
        if (pos === 0)
            return funAcum(...paramValues);
        const iteFun = (...params) => {
            if (count >= pos)
                return funAcum(...paramValues)(...params);
            funAcum = funAcum(...params);
            count = count + params.length;
            if (count >= pos)
                return funAcum(...paramValues);
            return iteFun;
        };
        return iteFun;
    };
}
exports.partialAtPos = partialAtPos;
RE.partialAtPos = partialAtPos;
// const nestedFun = (a,b) => c => (d,e) => f => console.log(a,b,c,d,e,f)
// partialAtPos(nestedFun, 3)('jose','Luchi')('a','b')('c')('d')
// partialAtPos(nestedFun, 5)('jose')('a','b')('c')('d','e')
function uncurry(withLog = false) {
    return function uncurryWithOrWithoutLog(funcParam) {
        let prevConsumedUpTo = 0;
        let func = funcParam;
        let howWasCalled = '';
        return uncurryFunc;
        function uncurryFunc(...args) {
            let end, listOfArgs;
            while (prevConsumedUpTo < args.length && typeof func === 'function') {
                if (func.length === 0)
                    end = args.length;
                else
                    end = prevConsumedUpTo + func.length;
                listOfArgs = args.slice(prevConsumedUpTo, end);
                prevConsumedUpTo = end;
                if (typeof func === 'function') {
                    howWasCalled = `${howWasCalled}(${listOfArgs.map((elem) => typeof elem).join(',')})`;
                    func = func(...listOfArgs);
                }
            }
            if (typeof func === 'function')
                return withLog ? [uncurryWithOrWithoutLog(func), howWasCalled] : uncurryWithOrWithoutLog(func);
            return withLog ? [func, howWasCalled] : func;
        }
    };
}
exports.uncurry = uncurry;
function createReject(baseObject, elem) {
    return baseObject.constructor((rej, res) => {
        rej(elem);
        return (() => { });
    });
}
function isAcumAFutureAndElemAnError(acum, elem) {
    var _a;
    return elem instanceof Error && ((_a = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Future';
}
function isAcumAPromiseAndElemAnError(acum, elem) {
    return elem instanceof Error && (0, jsUtils_js_1.isPromise)(acum);
}
const pipeWithChain = function (...func) {
    return function (...params) {
        return func.reduce(
        // iterate over functions to call in a specific way with the acum value. 
        (acum, currentPipeFunc, index) => {
            var _a, _b;
            let chainFun;
            let pipeFunc = currentPipeFunc;
            // First function accepts multiVariant function... but there must meet certain condition.
            if (index === 0 && acum.length > 1) {
                const numberOfFutures = acum.filter(param => { var _a; return ((_a = param === null || param === void 0 ? void 0 : param.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Future'; }).length;
                if (numberOfFutures > 1)
                    acum[acum.length - 1] = (0, fluture_1.reject)(new Error('Only one Future allowed...'));
                else if (numberOfFutures === 1 && ((_b = (_a = R.last(acum)) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== 'Future')
                    acum[acum.length - 1] = (0, fluture_1.reject)(new Error('Future param must be the last param of the function'));
                else
                    //Apply all the parameters to convert it to a unary function.
                    pipeFunc = currentPipeFunc === null || currentPipeFunc === void 0 ? void 0 : currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1));
            }
            // Then extract last parameter
            if (index === 0) {
                acum = acum[acum.length - 1];
            }
            if (acum instanceof Error) {
                return acum;
            }
            // Try to find a chain kind of method for the accumlated drag value
            if (typeof (acum === null || acum === void 0 ? void 0 : acum.chain) === 'function')
                chainFun = acum.chain;
            else if (typeof (acum === null || acum === void 0 ? void 0 : acum['fantasy-land/chain']) === 'function')
                chainFun = acum['fantasy-land/chain'].bind(acum);
            else if (typeof (acum === null || acum === void 0 ? void 0 : acum.flatMap) === 'function')
                chainFun = acum.flatMap.bind(acum);
            // if acum is a chain type the pipeFunc will be executed inside the chain.
            if (chainFun) {
                return chainFun((elem) => {
                    var _a, _b, _c, _d, _e;
                    if (isAcumAFutureAndElemAnError(acum, elem)) {
                        return createReject(acum, elem);
                    }
                    let result;
                    // For flutures we try catch so there will be transformed in a reject,
                    if (((_a = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Future') {
                        try {
                            result = pipeFunc(elem);
                        }
                        catch (e) {
                            result = e;
                        }
                    }
                    else {
                        // Exceptions in pipeFunc will need to be handle by the caller in sync calls.
                        result = pipeFunc(elem);
                    }
                    if (isAcumAFutureAndElemAnError(acum, result)) {
                        return createReject(acum, result);
                    }
                    // inside chainFun the return needs to be of the same type as the original acum drag value.
                    // else we wrap the result using the constructor.
                    if (((_b = result === null || result === void 0 ? void 0 : result.constructor) === null || _b === void 0 ? void 0 : _b.name) === ((_c = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _c === void 0 ? void 0 : _c.name))
                        return result;
                    else {
                        if (typeof ((_d = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _d === void 0 ? void 0 : _d.of) === 'function')
                            return acum.constructor.of(result);
                        if (typeof ((_e = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _e === void 0 ? void 0 : _e['fantasy-land/of']) === 'function')
                            return acum.constructor['fantasy-land/of'](result);
                        return result;
                    }
                });
            }
            // If acum drag value is not chainable we execute pipeFunc in a normal way.
            return pipeFunc(acum);
        }, params);
    };
};
exports.pipeWithChain = pipeWithChain;
RE.pipeWithChain = pipeWithChain;
// Example with Future monad
// last parameter (and only this one) must be wrapped in a Future as in ((5, resolve(6)), and resolve(6) gives us that.
// pipeWithChain will chain the function (called flatmap as well). It means to descend the function to be executed with the unwrapepd value. 
// Chain always wraps the function return value... BUT if this value is already wrapped it will collapsed the two nested wraps into one,
// flatting the structure. then we will use this wrap value in the next function and so on.
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => x * 2,
//   x => resolve([x+8, x+3]),
//   x => resolve([x[0] +2, x[1] + 4]),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex1-Err: '))(RLog('pipeWithChain-Ex1-OK: ')))
// // //
// // // Example with Array monad
// RE.pipeWithChain(
//   (x,y) => x+y,
//   (x) => (x+1)/2,
//   x => [x * 2, x+5],
//   //x => { throw new Error('asdas') },
//   x => [x+5, x*2]
// )(5, 6)
// .filter(elem => elem >= 17)//?
// // Example with Future and Array monad mixed
// RE.pipeWithChain(
//   R.map(
//     R.pipe (
//       R.add(2),
//       R.divide(3)
//     )
//   )
// )(resolve([1,2,3,4,56]))
// .pipe(fork(RLog('pipeWithChain-Ex2-Err: '))(RLog('pipeWithChain-Ex2-OK: ')))
// // Example with error
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   x => new Error('My controlled error...'),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex3-Err: '))(RLog('pipeWithChain-Ex3-OK: ')))
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => new Error('My controlled error...'),
// )(5, 6).message //?
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => reject('my error...'),
//   x=>x+3
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex4-Err: '))(RLog('pipeWithChain-Ex4-OK: ')))
// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex5-Err: '))(RLog('pipeWithChain-Ex5-OK: ')))
// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x,
//   x => x +2,
// )(5, reject(10))
// .pipe(fork(RLog('pipeWithChain-Ex6-Err: '))(RLog('pipeWithChain-Ex6-OK: ')))
// // Passing a Future as a parameter. Remember this must be the last one.
// RE.pipeWithChain(
//   (x,y) => x + y,
//   x => x + ' --- The End!!! ---',
// )('the value after 5ms is: ', after(5)('5'))
// .pipe(fork(RLog('pipeWithChain-Ex7-Err: '))(RLog('pipeWithChain-Ex7-OK: ')))
// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x,
//   x => x +2,
// )(5, new Error('return error')).message //?
// // Note!: Arrays passing through each function of the pipeWithChain will be flatmap
// RLog
//   ('pipe doesnt apply flatmap to arrays: ')
//   (
//     RE.pipe(
//       R.identity
//     )([['a','b'], ['c','d']])
//   )
// Same as pipe with chain but arrays are not chainable:
const pipe = function (...func) {
    return function (...params) {
        return func.reduce(
        // iterate over functions to call in a specific way with the acum value. 
        (acum, currentPipeFunc, index) => {
            var _a, _b;
            let chainFun;
            let pipeFunc = currentPipeFunc;
            // First function accepts multiVariant function... but there must meet certain condition.
            if (index === 0 && acum.length > 1) {
                const numberOfFutures = acum.filter(param => { var _a; return ((_a = param === null || param === void 0 ? void 0 : param.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Future'; }).length;
                if (numberOfFutures > 1)
                    acum[acum.length - 1] = (0, fluture_1.reject)(new Error('Only one Future allowed...'));
                else if (numberOfFutures === 1 && ((_b = (_a = R.last(acum)) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== 'Future')
                    acum[acum.length - 1] = (0, fluture_1.reject)(new Error('Future param must be the last param of the function'));
                else
                    //Apply all the parameters to convert it to a unary function.
                    pipeFunc = currentPipeFunc === null || currentPipeFunc === void 0 ? void 0 : currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1));
            }
            // Then extract last parameter
            if (index === 0) {
                acum = acum[acum.length - 1];
            }
            if (acum instanceof Error) {
                return acum;
            }
            // Try to find a chain kind of method for the accumlated drag value
            if (typeof (acum === null || acum === void 0 ? void 0 : acum.chain) === 'function')
                chainFun = acum.chain;
            else if (typeof (acum === null || acum === void 0 ? void 0 : acum['fantasy-land/chain']) === 'function')
                chainFun = acum['fantasy-land/chain'].bind(acum);
            else if ((0, jsUtils_js_1.isPromise)(acum))
                chainFun = acum.then.bind(acum);
            //else if (typeof acum?.flatMap === 'function')
            //  chainFun = acum.flatMap.bind(acum)
            // if acum is a chain type the pipeFunc will be executed inside the chain.
            if (chainFun) {
                return chainFun((elem) => {
                    var _a, _b, _c, _d, _e;
                    if (isAcumAFutureAndElemAnError(acum, elem)) {
                        return createReject(acum, elem);
                    }
                    let result;
                    // For flutures we try catch so there will be transformed in a reject,
                    if (((_a = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Future' || (0, jsUtils_js_1.isPromise)(acum)) {
                        try {
                            result = pipeFunc(elem);
                        }
                        catch (e) {
                            result = e;
                        }
                    }
                    else {
                        // Exceptions in pipeFunc will need to be handle by the caller in sync calls.
                        result = pipeFunc(elem);
                    }
                    if (isAcumAFutureAndElemAnError(acum, result)) {
                        return createReject(acum, result);
                    }
                    if (isAcumAPromiseAndElemAnError(acum, result)) {
                        return acum.then(() => Promise.reject(result));
                    }
                    // inside chainFun the return needs to be of the same type as the original acum drag value.
                    // else we wrap the result using the constructor.
                    if (((_b = result === null || result === void 0 ? void 0 : result.constructor) === null || _b === void 0 ? void 0 : _b.name) === ((_c = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _c === void 0 ? void 0 : _c.name))
                        return result;
                    else {
                        if (typeof ((_d = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _d === void 0 ? void 0 : _d.of) === 'function')
                            return acum.constructor.of(result);
                        if (typeof ((_e = acum === null || acum === void 0 ? void 0 : acum.constructor) === null || _e === void 0 ? void 0 : _e['fantasy-land/of']) === 'function')
                            return acum.constructor['fantasy-land/of'](result);
                        return result;
                    }
                });
            }
            // If acum drag value is not chainable we execute pipeFunc in a normal way.
            return pipeFunc(acum);
        }, params);
    };
};
exports.pipe = pipe;
RE.pipe = pipe;
// RLog
//   ('pipe doesnt apply flatmap to arrays: ')
//   (
//     RE.pipe(
//       R.identity
//     )([['a','b'], ['c','d']])
//   )
// RE.pipe(
//   R.identity,
//   RLog('RLog print the whole array in one go. RLog is not iterated as it would in pipeWithChain ')
// )([['a','b'], ['c','d']])
// // Example with error
// RE.pipe(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   x => new Error('My controlled error...'),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex3-Err: '))(RLog('pipeWithChain-Ex3-OK: ')))
// // Example with Future reject(error)
// RE.pipe(
//   (x,y) => x+y,
//   x => reject('my error...'),
//   x=>x+3
// )(5, 6)
// .pipe(fork(RLog('pipe-Ex4-Err: '))(RLog('pipe-Ex4-OK: ')))
// // Example with Promise.reject(error)
// RE.pipe(
//   (x,y) => x+y,
//   x => Promise.reject('my error...'),
//   x=>x+3
// )(5, 6)
// .then(RLog('pipe-Ex5-OK: '),RLog('pipe-Ex5-Err: ') )
// // Example with throw error Future
// RE.pipe(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex6-Err: '))(RLog('pipeWithChain-Ex6-OK: ')))
// // Example with throw error Promise
// RE.pipe(
//   (x,y) => x+y,
//   x => Promise.resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .then(RLog('pipe-Ex7-OK: '),RLog('pipe-Ex7-Err: ') )
// // Example with throw error sync
// // Exeption is raised up in sync mode vs async
// // where exception is transjform in rejec(exception)
// try {
//   RE.pipe(
//     (x,y) => x+y,
//     x => {throw new Error('aaaa')},
//     x => x.filter(elem => elem > 15)
//   )(5, 6)
// } catch(e)
// {
//   console.log('Sync failed with: ', e)
// }
const pipeWhile = (funCond, ini) => (...funcs) => (...inputs) => {
    if (typeof funCond !== 'function' ||
        funcs.some(func => typeof func !== 'function') ||
        (ini !== undefined && typeof ini !== 'function')) {
        const dataErrorString = `funCond: ${typeof funCond} ${ini === undefined ? '' : 'ini: ' + typeof ini} funcs: ${funcs.map(el => typeof el)}`;
        throw new Error(`pipeWhile was called without funcfion/s in funCond or pipe functions ${dataErrorString}`);
    }
    if (typeof ini === 'function')
        ini(...inputs);
    let finalReturn = inputs;
    while (funCond(...finalReturn)) {
        finalReturn = funcs.reduce((acum, func) => [func(...acum)], finalReturn);
    }
    return R.last(finalReturn);
};
exports.pipeWhile = pipeWhile;
RE.pipeWhile = pipeWhile;
// pipeWhile(x => x < 20)
// (
//  x => x + 2
// )(2) //?
function parallel(numberOfthreads = Infinity) {
    return futuresOrValues => (0, fluture_1.parallel)(numberOfthreads)(futuresOrValues.map(elem => (0, fluture_1.isFuture)(elem) ? elem : (0, fluture_1.resolve)(elem)));
}
exports.parallel = parallel;
RE.parallel = parallel;
const runFutureFunctionsInParallel = (numberOfThreads = Infinity) => (functionsToRunInParallel) => data => RE.parallel(numberOfThreads)(functionsToRunInParallel.map(fun => fun(data)));
exports.runFutureFunctionsInParallel = runFutureFunctionsInParallel;
RE.runFutureFunctionsInParallel = runFutureFunctionsInParallel;
// runFutureFunctionsInParallel
//   ()
//   (
//     [
//       (data) => after(15)(data + 2), //7
//       (data) => after(15)(data + 3), //8
//       (data) => after(15)(data + 4), //9
//     ]
//   )(5).pipe(fork(RLog('1: Err runFutureFunctionsInParallel'))(RLog('1: OK runFutureFunctionsInParallel')))
// example of race to update variable
// RE.pipeWithChain(
//   runFutureFunctionsInParallel
//     ()
//     (
//       [
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges + 2)(after(15)()),
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges * 2)(after(22)()),
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges * 3)(after(10)())
//       ]
//     ),
// )(resolve({ varToRaceChanges: 5 })).pipe(fork(RLog('2: Err runFutureFunctionsInParallel'))(RLog('2: OK runFutureFunctionsInParallel')))
//
// Mixing Futures with non Futures.
// runFutureFunctionsInParallel
//   ()
//   (
//     [
//       (data) => after(15)(data + 2), //7
//       data => data + 3, //8
//       (data) => after(15)(data + 4), //9
//     ]
//   )(5).pipe(fork(RLog('1: Err runFutureFunctionsInParallel'))(RLog('1: OK runFutureFunctionsInParallel')))
const getTypeSyncFuturePromiseBoth = (list) => {
    const typeofAsyncList = (0, jsUtils_js_1.transition)(['SYNC', 'PROMISE', 'FUTURE', 'MIX_PROMISE_AND_FUTURE'], ['sync', 'promise', 'future'], {
        PROMISE: {
            sync: 'PROMISE',
            future: 'MIX_PROMISE_AND_FUTURE'
            //by default: promise: 'PROMISE'
        },
        FUTURE: {
            sync: 'FUTURE',
            promise: 'MIX_PROMISE_AND_FUTURE',
        },
        MIX_PROMISE_AND_FUTURE: 'MIX_PROMISE_AND_FUTURE' // same as {sync: 'MIX_PROMISE_AND_FUTURE', promise: 'MIX_PROMISE_AND_FUTURE', future: 'MIX_PROMISE_AND_FUTURE'}
    });
    list.forEach(el => typeofAsyncList((0, jsUtils_js_1.isPromise)(el)
        ? 'promise'
        : (0, fluture_1.isFuture)(el)
            ? 'future'
            : 'sync'));
    return typeofAsyncList.valueOf();
};
const runFunctionsSyncOrParallel = (numberOfFunctionsToRunInParallel = Infinity) => (functionsToRun) => data => {
    if (!(numberOfFunctionsToRunInParallel > 0))
        throw new jsUtils_js_1.CustomError('NUMBEROFFUNCTIONSTORUNINPARALLEL_MUST_BE_BETWEEN_0_TO_INFINITY');
    let activeFunctions = 0;
    let nextIndex = 0;
    let globalTypeSync = 'sync';
    let currentTypeSync = 'sync';
    let resultWithValuesPromisesOrFuture = [];
    return run();
    function run() {
        if (nextIndex >= functionsToRun.length)
            return finalResult();
        if (currentTypeSync === 'promise' && activeFunctions >= numberOfFunctionsToRunInParallel) {
            activeFunctions--;
            return R.last(resultWithValuesPromisesOrFuture).then(run);
        }
        else {
            resultWithValuesPromisesOrFuture[nextIndex] = functionsToRun[nextIndex](data);
            setGlobalTypeSync(resultWithValuesPromisesOrFuture[nextIndex]);
            if (currentTypeSync === 'promise')
                activeFunctions++;
            nextIndex++;
            return run();
        }
    }
    function finalResult() {
        if (globalTypeSync === 'future') {
            return RE.parallel(numberOfFunctionsToRunInParallel)(resultWithValuesPromisesOrFuture);
        }
        if (globalTypeSync === 'promise') {
            return Promise.all(resultWithValuesPromisesOrFuture);
        }
        return resultWithValuesPromisesOrFuture;
    }
    function setGlobalTypeSync(task) {
        currentTypeSync =
            (0, fluture_1.isFuture)(task)
                ? 'future'
                : (0, jsUtils_js_1.isPromise)(task)
                    ? 'promise'
                    : 'sync';
        if (globalTypeSync === 'sync')
            globalTypeSync = currentTypeSync;
        if (currentTypeSync !== 'sync' && globalTypeSync !== currentTypeSync)
            throw new jsUtils_js_1.CustomError('MIX_PROMISE_AND_FUTURE', `Promises and future cannot be mixed ${globalTypeSync} ${currentTypeSync}`);
    }
};
exports.runFunctionsSyncOrParallel = runFunctionsSyncOrParallel;
RE.runFunctionsSyncOrParallel = runFunctionsSyncOrParallel;
//runFunctionsSyncOrParallel(2)([()=>Promise.resolve(3), ()=>4])() //?
function pickPathsUnc(pickTransformations, obj) {
    if (Array.isArray(pickTransformations) === false)
        return pickPathsUnc([pickTransformations], obj);
    return pickTransformations.reduce((acum, pickObj) => {
        let pickObjToProcess = pickObj;
        if (typeof pickObj === 'string')
            pickObjToProcess = { path: pickObj };
        let { path, name, apply } = pickObjToProcess;
        let paths = path.split('.');
        if (name === undefined)
            name = R.last(paths);
        let valueAtPath = R.path(paths, obj);
        acum[name] =
            typeof apply === 'function'
                ? apply(valueAtPath)
                : valueAtPath;
        return acum;
    }, {});
}
const pickPaths = R.curryN(2, pickPathsUnc);
exports.pickPaths = pickPaths;
RE.pickPaths = pickPaths;
function toFixed(decimals) {
    return (number) => number.toFixed(decimals);
}
// pickPaths(
//   //'a.1.b'
//   //['a.1.b', 'c.0.d']
//   //{path:'a.1.b', name:'x'}
//   //{path:'a.1.b', apply: toFixed(2)}
//   //{path:'a.1.b', name:'x', apply: toFixed(2)}
//   [{ path: 'a.1.b', name: 'x', apply: toFixed(2) }, { path: 'c.0.d' }]
// )
//   (
//     {
//       a: [{},
//       {
//         c: 3,
//         b: 6.32321,
//         d: 1
//       }, {}
//       ],
//       c: [{ d: 8.54332 }]
//     }
//   ) //?
function mergeArrayOfObjectsRenamingPropsUnc(newValues, propPaths, original) {
    const offset = newValues.length - original.length;
    return original.map((elem, index) => (Object.assign(Object.assign({}, elem), pickPaths(propPaths, newValues[index + offset]))));
}
const mergeArrayOfObjectsRenamingProps = R.curryN(3, mergeArrayOfObjectsRenamingPropsUnc);
exports.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps;
RE.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps;
// mergeArrayOfObjectsRenamingProps(
//   [{ close: 5 }, { close: 6 }, { close: 30 }, { close: 50 }],
//   [{ path: 'close', name: 'gspc' }, { path: 'close', name: 'anotherCopy' }],
//   [{ close: 3 }, { close: 2 }]
// )//?
function RLog(prefixOrFormatter) {
    return (...obj) => {
        if (typeof prefixOrFormatter === 'function') {
            const cloneObj = (0, just_clone_1.default)(obj);
            console.log(prefixOrFormatter(...cloneObj));
        }
        else
            console.log(prefixOrFormatter, ...obj);
        return R.last(obj);
    };
}
exports.RLog = RLog;
// RLog('test')('a','b',[1,2,'test']) //?
// RLog(
//   (x,y,z)=> {
//     // changing values in object doesn't change the return value.
//     z[2].a=z[2].a.toUpperCase()
//     return `param1: ${x} param2: ${y} param3[0]: ${z[0]} param3[1]: ${z[1]} param3[2].a: ${z[2].a}`
//   })
//   ('a','b',[1,2,{a:'test'}]) //?
RE.RLog = RLog;
RE.findSolution = findSolution;
RE.something = something;
RE.uncurry = uncurry;
