// ts-check
import * as R from 'ramda';
import { sorterByPaths } from './jsUtils.js'
import { fork, reject, resolve, parallel, isFuture } from 'fluture';

// Only needed for testing
import {  after, both, chain, map } from 'fluture';
import { repeat, CustomError } from './jsUtils.js' 

const RE = {}

const groupByWithCalcUnc = (cond, keyOp) => data => {

  const opsToApply = Object.entries(keyOp)

  const groupObj = data.reduce(
    (acum, current, index) => {
      const indexRow = cond(current)
      opsToApply.forEach(
        ([key, opFunc]) => {
          acum[indexRow] = acum[indexRow] ?? {}
          acum[indexRow][key] = opFunc(acum[indexRow]?.[key], current?.[key])
        }
      )
      acum[indexRow] = { ...current, ...acum[indexRow] }
      return acum
    },
    {}
  )

  return Object.values(groupObj)
}

const groupByWithCalc = R.curryN(2, groupByWithCalcUnc)
RE.groupByWithCalc = groupByWithCalc
// RE.groupByWithCalc(
//   (row) => row.date,
//   {
//     total:(l,r) => (l??0) + r,
//     count:(l,r) => (l??0) + 1
//   },
// )(
//   [
//     {date:'2020-01-02', total:6}, 
//     {date:'2020-01-03', total:5}, 
//     {date:'2020-01-02', total:11}, 
//     {date:'2020-01-03', total:6}, 
//     {date:'2020-01-02', total:-5}
//   ]
// )//?

const innerRightJoinWithUnc = (joinCond, transform = (k, l, r) => r, left, right) => {

  const joinCondCurry = R.uncurryN(2, joinCond)
  return R.chain(rightRow => {

    const mergeRecords = R.pipe(
      R.filter(joinCondCurry(R.__, rightRow)),
      R.map(R.mergeWithKey(transform, R.__, rightRow))
    )(left)

    if (mergeRecords.length === 0) return rightRow

    return mergeRecords

  })(right)

}
const innerRightJoinWith = R.curryN(4, innerRightJoinWithUnc)
RE.innerRightJoinWith = innerRightJoinWith
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
  const union = new Map()

  for (let elem of master) {
    union.set(hashMaster(elem), elem)
  }

  for (let elem of addNoDupsToTheEnd) {
    if (union.get(hashAddNoDups(elem)) === undefined) union.set(hashAddNoDups(elem), elem)
  }

  if (isAsc === true || isAsc === false) {
    return Array.from(union.entries()).sort(sorterByPaths('0', isAsc)).map(elem => elem[1])
  }

  return Array.from(union.values())
}
const unionWithHashKeys = R.curryN(5, unionWithHashKeysUnc)
RE.unionWithHashKeys = unionWithHashKeys
// RE.unionWithHashKeys(undefined,
//   elem=>elem.date,
//   [{date:'2020-01-02', a:4},{date:'2020-01-03'}],
//   elem=>elem.date
// )(
//   [{date:'2020-01-01'},{date:'2020-01-02',a:1}]
// )//?


// function updateWithHashKeysUnc(isAsc, hashAddNoDups, addNoDupsToTheEnd, hashMaster, master) {
//   const union = new Map()

//   for (let elem of master) {
//     union.set(hashMaster(elem), elem)
//   }

//   for (let elem of addNoDupsToTheEnd) {
//     union.set(hashAddNoDups(elem), elem)
//   }

//   if(isAsc === true || isAsc === false) {
//     return Array.from(union.entries()).sort(sorterByPaths('0',isAsc)).map(elem => elem[1]) 
//   }

//   return Array.from(union.values())
// }
// const updateWithHashKeys = R.curryN(5, updateWithHashKeysUnc)
// RE.updateWithHashKeys = updateWithHashKeys
// RE.updateWithHashKeys(
//   true,
//   elem=>elem.date,
//   [{date:'2020-01-08'},{date:'2020-01-03'},{date:'2020-01-02',a:2},{date:'2020-01-05',a:1}],
//   elem=>elem.date
// )(
//   [{date:'2020-01-08',a:4},{date:'2020-01-01',a:1},{date:'2020-01-05',a:5}]
// )//?


function isOldLessThanNew(hashOldRecords, hashNewRecords) {
  if (hashOldRecords === hashNewRecords) return false

  if (hashNewRecords === undefined) return true
  if (hashOldRecords < hashNewRecords) return true

  return false
}

function isOldGreatThanNew(hashOldRecords, hashNewRecords) {
  if (hashOldRecords === hashNewRecords) return false

  if (hashOldRecords === undefined) return true
  if (hashOldRecords > hashNewRecords) return true

  return false
}

function callFuncOrUndefinedIfError(value, func) {
  try {
    return func(value)
  } catch (err) {
    return undefined
  }
}

function updateWithHashKeysUnc(isAsc, getHashNewRecords, newRecords, getHashOldRecords, oldRecords) {
  const union = new Map()

  let hashNewRecords = callFuncOrUndefinedIfError(newRecords[0], getHashNewRecords)
  let hashOldRecords = callFuncOrUndefinedIfError(oldRecords[0], getHashOldRecords)

  for (let i = 0, j = 0; i < newRecords.length || j < oldRecords.length;) {
    if (isOldLessThanNew(hashOldRecords, hashNewRecords)) {
      if (union.get(hashOldRecords) === undefined) union.set(hashOldRecords, oldRecords[j])
      j++
      hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords)
    } else {
      if (isOldGreatThanNew(hashOldRecords, hashNewRecords)) {
        union.set(hashNewRecords, newRecords[i])
        i++
        hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords)
      } else {
        union.set(hashNewRecords, newRecords[i])
        i++
        j++

        hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords)
        hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords)
      }
    }
  }

  if (isAsc === true || isAsc === false) {
    return Array.from(union.entries()).sort(sorterByPaths('0', isAsc)).map(elem => elem[1])
  }

  return Array.from(union.values())
}
const updateWithHashKeys = R.curryN(5, updateWithHashKeysUnc)
RE.updateWithHashKeys = updateWithHashKeys
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



const between = R.curry((l, r) => (R.both(R.gte(R.__, l), R.lt(R.__, r))))
RE.between = between

const matchById = (l, r) =>
  R.isNil(l) === false
  && R.isNil(r) === false
  && ((l.id || l.Id || l.ID) === (r.id || r.Id || r.ID))
  && ((l.id || l.Id || l.ID) !== undefined)


const matchByPropId = R.curryN(2, matchById)
RE.matchByPropId = matchByPropId

// Returns matching in 1st index and filtered out in 0 index... followin success goes to the end rule.
function splitCondUnc(condFun, array) {
  return R.reduce((acu, cur) => {
    if (condFun(cur)) return R.update(1, R.append(cur, acu[1]), acu)
    else return R.update(0, R.append(cur, acu[0]), acu)
  }, [[], []])
}
const splitCond = R.curryN(2, splitCondUnc)
RE.splitCond = splitCond

const filterMap = R.curry(
  (filter, map, data) =>
    R.reduce(
      (acum, current) =>
        filter(current) ?
          R.append(map(current), acum) :
          acum, [], data)
)
RE.filterMap = filterMap

const mapWithNext = R.curry(
  (mapper, endValue, array) =>
    array.map(
      (elem, index) => {
        let nextValue
        if (index === array.length - 1) nextValue = endValue
        else nextValue = array[index + 1]
        return mapper(elem, nextValue)
      }
    )
)
RE.mapWithNext = mapWithNext

const mapWithPrevious = R.curry(
  (mapper, iniValue, array) =>
    array.map(
      (elem, index) => {
        let previousValue
        if (index === 0) previousValue = iniValue
        else previousValue = array[index - 1]
        return mapper(previousValue, elem)
      }
    )
)
RE.mapWithPrevious = mapWithPrevious

const n0IsNotUnfold =
  R.pipe(
    R.propEq('0', 'unfold'),
    R.not
  )

const n1IsFunction =
  R.pipe(
    R.prop('1'),
    R.type,
    R.equals('Function')
  )

function something(lib) {
  return (...args) =>
    R.pipe(
      // Convert to an array of for each function with array of 2 elements: 0 (key) name of function, 1 (value) function
      Object.entries,
      RE.filterMap(
        R.both(
          n0IsNotUnfold,
          n1IsFunction
        ),
        R.chain(
          // add a 3rd value. Now we will have 0: name function, 1: function, 2 result
          R.append,
          R.pipe(
            //R.tap(R.pipe(R.prop('0'),console.log)),
            R.prop('1'),
            R.tryCatch(
              R.pipe(
                //R.uncurryN(args.length),
                fun => {
                  const funU = uncurry(true)(fun)
                  const firstResult = funU(...R.clone(args))

                  if (typeof firstResult[0] === 'function' && args.length > 1) {
                    return funU(R.clone(...R.init(args)))(R.clone(R.last(args)))
                  }
                  return firstResult
                }
              ),
              (exc, fun) => {
                try {
                  return [
                    fun(R.clone(...R.init(args)))(R.clone(R.last(args))),
                    '(all,arguments,but)(last)'
                  ]
                } catch (e) {
                  return ['error']
                }
              }
            ),
            //R.tap(console.log)//(R.pipe(R.prop('2'),console.log)),
          )
        )
      )
    )(lib)
}

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
  return R.tryCatch(
    R.pipe(
      R.filter(
        (solution) => R.equals(solution[2][0], solutionToFind)
      ),
      R.map(R.applySpec({ fun: R.prop('0'), sign: R.path(['2', '1']) }))
    ),
    () => []
  )(solutions)
}

function partialAtPos(fun, pos) {
  return (...paramValues) => {
    let funAcum = fun
    let count = 0
    if (pos === 0) return funAcum(...paramValues)

    const iteFun = (...params) => {
      if (count >= pos) return funAcum(...paramValues)(...params)

      funAcum = funAcum(...params)
      count = count + params.length

      if (count >= pos) return funAcum(...paramValues)

      return iteFun
    }

    return iteFun
  }
}
RE.partialAtPos = partialAtPos
// const nestedFun = (a,b) => c => (d,e) => f => console.log(a,b,c,d,e,f)
// partialAtPos(nestedFun, 3)('jose','Luchi')('a','b')('c')('d')
// partialAtPos(nestedFun, 5)('jose')('a','b')('c')('d','e')


function uncurry(withLog = false) {
  return function uncurryWithOrWithoutLog(funcParam) {
    let prevConsumedUpTo = 0
    let func = funcParam
    let howWasCalled = ''

    return uncurryFunc

    function uncurryFunc(...args) {
      let end, listOfArgs
      while (prevConsumedUpTo < args.length && typeof func === 'function') {
        if (func.length === 0) end = args.length
        else end = prevConsumedUpTo + func.length

        listOfArgs = args.slice(prevConsumedUpTo, end)
        prevConsumedUpTo = end

        if (typeof func === 'function') {
          howWasCalled = `${howWasCalled}(${listOfArgs.map((elem) => typeof elem).join(',')})`

          func = func(...listOfArgs)
        }
      }

      if (typeof func === 'function')
        return withLog ? [uncurryWithOrWithoutLog(func), howWasCalled] : uncurryWithOrWithoutLog(func)

      return withLog ? [func, howWasCalled] : func
    }
  }
}

function createReject(baseObject, elem) {
  return baseObject.constructor(
    (rej, res) => {
      rej(elem)
      return (() => { })
    }
  )
}

function isAcumAFutureAndElemAnError(acum, elem) {
  return elem instanceof Error && acum?.constructor?.name === 'Future'
}

const pipeWithChain = function (...func) {
  return function (...params) {
    return func.reduce(
      // iterate over functions to call in a specific way with the acum value. 
      (acum, currentPipeFunc, index) => {

        let chainFun
        let pipeFunc = currentPipeFunc

        // First function accepts multiVariant function... but there must meet certain condition.
        if (index === 0 && acum.length > 1) {
          const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length
          if (numberOfFutures > 1)
            acum[acum.length - 1] = reject(new Error('Only one Future allowed...'))
          else
            if (numberOfFutures === 1 && R.last(acum)?.constructor?.name !== 'Future')
              acum[acum.length - 1] = reject(new Error('Future param must be the last param of the function'))
            else
              //Apply all the parameters to convert it to a unary function.
              pipeFunc = currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1))
        }

        // Then extract last parameter
        if (index === 0) {
          acum = acum[acum.length - 1]
        }

        if (acum instanceof Error) {
          return acum
        }

        // Try to find a chain kind of method for the accumlated drag value
        if (typeof acum?.chain === 'function')
          chainFun = acum.chain
        else if (typeof acum?.['fantasy-land/chain'] === 'function')
          chainFun = acum['fantasy-land/chain'].bind(acum)
        else if (typeof acum?.flatMap === 'function')
          chainFun = acum.flatMap.bind(acum)

        // if acum is a chain type the pipeFunc will be executed inside the chain.
        if (chainFun) {
          return chainFun(
            (elem) => {
              if (isAcumAFutureAndElemAnError(acum, elem)) {
                return createReject(acum, elem)
              }

              let result

              // For flutures we try catch so there will be transformed in a reject,
              if (acum?.constructor?.name === 'Future') {
                try {
                  result = pipeFunc(elem)
                } catch (e) {
                  result = e
                }
              } else result = pipeFunc(elem)

              if (isAcumAFutureAndElemAnError(acum, result)) {
                return createReject(acum, result)
              }

              // inside chainFun the return needs to be of the same type as the original acum drag value.
              // else we wrap the result using the constructor.
              if (result?.constructor?.name === acum?.constructor?.name)
                return result
              else {
                if (typeof acum?.constructor?.of === 'function') return acum.constructor.of(result)
                if (typeof acum?.constructor?.['fantasy-land/of'] === 'function') return acum.constructor['fantasy-land/of'](result)

                return result
              }
            }
          )
        }

        // If acum drag value is not chainable we execute pipeFunc in a normal way.
        return pipeFunc(acum)
      }
      , params
    )

  }
}

RE.pipeWithChain = pipeWithChain

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

        let chainFun
        let pipeFunc = currentPipeFunc

        // First function accepts multiVariant function... but there must meet certain condition.
        if (index === 0 && acum.length > 1) {
          const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length
          if (numberOfFutures > 1)
            acum[acum.length - 1] = reject(new Error('Only one Future allowed...'))
          else
            if (numberOfFutures === 1 && R.last(acum)?.constructor?.name !== 'Future')
              acum[acum.length - 1] = reject(new Error('Future param must be the last param of the function'))
            else
              //Apply all the parameters to convert it to a unary function.
              pipeFunc = currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1))
        }

        // Then extract last parameter
        if (index === 0) {
          acum = acum[acum.length - 1]
        }

        if (acum instanceof Error) {
          return acum
        }

        // Try to find a chain kind of method for the accumlated drag value
        if (typeof acum?.chain === 'function')
          chainFun = acum.chain
        else if (typeof acum?.['fantasy-land/chain'] === 'function')
          chainFun = acum['fantasy-land/chain'].bind(acum)
        //else if (typeof acum?.flatMap === 'function')
        //  chainFun = acum.flatMap.bind(acum)

        // if acum is a chain type the pipeFunc will be executed inside the chain.
        if (chainFun) {
          return chainFun(
            (elem) => {
              if (isAcumAFutureAndElemAnError(acum, elem)) {
                return createReject(acum, elem)
              }

              let result

              // For flutures we try catch so there will be transformed in a reject,
              if (acum?.constructor?.name === 'Future') {
                try {
                  result = pipeFunc(elem)
                } catch (e) {
                  result = e
                }
              } else result = pipeFunc(elem)

              if (isAcumAFutureAndElemAnError(acum, result)) {
                return createReject(acum, result)
              }

              // inside chainFun the return needs to be of the same type as the original acum drag value.
              // else we wrap the result using the constructor.
              if (result?.constructor?.name === acum?.constructor?.name)
                return result
              else {
                if (typeof acum?.constructor?.of === 'function') return acum.constructor.of(result)
                if (typeof acum?.constructor?.['fantasy-land/of'] === 'function') return acum.constructor['fantasy-land/of'](result)

                return result
              }
            }
          )
        }

        // If acum drag value is not chainable we execute pipeFunc in a normal way.
        return pipeFunc(acum)
      }
      , params
    )

  }
}

RE.pipe = pipe

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

const runFunctionsInParallel =
  (numberOfThreads = Infinity) =>
    functionsToRunInParallel =>
      data => {

        return parallel
          (numberOfThreads)
          (
            R.map
              (
                funToRunInParallel => {
                  let toReturn = funToRunInParallel(data)

                  return isFuture(toReturn)
                    ? toReturn
                    : resolve(toReturn)
                }
              )
              (functionsToRunInParallel)
          )
      }

RE.runFunctionsInParallel = runFunctionsInParallel

// runFunctionsInParallel
//   ()
//   (
//     [
//       (data) => after(15)(data + 2), //7
//       (data) => after(15)(data + 3), //8
//       (data) => after(15)(data + 4), //9
//     ]
//   )(5).pipe(fork(RLog('1: Err runFunctionsInParallel'))(RLog('1: OK runFunctionsInParallel')))

// example of race to update variable
// RE.pipeWithChain(
//   runFunctionsInParallel
//     ()
//     (
//       [
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges + 2)(after(15)()),
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges * 2)(after(22)()),
//         (data) => map(() => data.varToRaceChanges = data.varToRaceChanges * 3)(after(10)())
//       ]
//     ),
// )(resolve({ varToRaceChanges: 5 })).pipe(fork(RLog('2: Err runFunctionsInParallel'))(RLog('2: OK runFunctionsInParallel')))
//
// Mixing Futures with non Futures.
// runFunctionsInParallel
//   ()
//   (
//     [
//       (data) => after(15)(data + 2), //7
//       data => data + 3, //8
//       (data) => after(15)(data + 4), //9
//     ]
//   )(5).pipe(fork(RLog('1: Err runFunctionsInParallel'))(RLog('1: OK runFunctionsInParallel')))


/**
 * Create a plan of execution.
 * @param {(function | undefined)} piper function used to pipe. If undefined it uses pipeWithChain
 */
function plan(piper = pipeWithChain) {
  return function (...callValues) {
    return planBivariate(piper, callValues)
  }
}

function planBivariate(piper, callValues) {
  const listOfFuncToExecute = []

  const toReturn = {
    pipe,
    fork: go
  }

  return toReturn

  /**
   * pipe functions and it returns a future that can be executed with fork
   * @param { ...(function | Object.<string, any>)} funcs functions to be chained 
   */
  function pipe(...funcs) {
    funcs.forEach(
      funcDef => {
        if (typeof funcDef === 'function' && funcDef.name !== undefined) {
          listOfFuncToExecute.push({ [funcDef.name]: funcDef })
          return
        }

        if (typeof funcDef === 'function') {
          listOfFuncToExecute.push({ [listOfFuncToExecute.length]: funcDef })
          return
        }

        listOfFuncToExecute.push(funcDef)

      }
    )

    return toReturn
  }

  /**
  * @typedef { import("fluture").RejectFunction } RejectFunction
  * @typedef { import("fluture").ResolveFunction } ResolveFunction
  */

  /**
   * fork execution of chained functions, substituting when corresponds with mock values.
   * @param { RejectFunction } ko KO function 
   * @param { ResolveFunction} ok OK function 
   * @param {(Object.<string, any> | undefined)} mocks Replace function with value... 
   */
  function go(ko, ok, mocks) {

    listOfFuncToExecute
    const planList = listOfFuncToExecute.map(
      (funcDef, index) => {
        const funcKey = Object.keys(funcDef)[0]
        if (mocks?.[funcKey] !== undefined) return () => mocks[funcKey]

        return funcDef[funcKey]
      }
    )

    return fork
      (ko)
      (ok)
      (piper(...planList)(...callValues))
  }

}
// plan()(3, after(100)(2))
//   .pipe(
//     { sum:(a,b)=> a+b },
//     { by2: a=>after(100)(a*2) },
//     { minus3: a=>a-3 }
//   ).fork(RLog('plan Err'), RLog('plan OK'), {by2:8}) // plan OK 5
//   //.fork(RLog('plan Err'), RLog('plan OK')) // plan OK 7


function pickPathsUnc(pickTransformations, obj) {

  if (Array.isArray(pickTransformations) === false) return pickPathsUnc([pickTransformations], obj)

  return pickTransformations.reduce(
    (acum, pickObj) => {
      let pickObjToProcess = pickObj
      if (typeof pickObj === 'string') pickObjToProcess = { path: pickObj }

      let { path, name, apply } = pickObjToProcess

      let paths = path.split('.')
      if (name === undefined) name = R.last(paths)

      let valueAtPath = R.path(paths, obj)
      acum[name] =
        typeof apply === 'function'
          ? apply(valueAtPath)
          : valueAtPath

      return acum
    }
    , {}
  )
}
const pickPaths = R.curryN(2, pickPathsUnc)
RE.pickPaths = pickPaths
function toFixed(decimals) {
  return (number) => number.toFixed(decimals)
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
  const offset = newValues.length - original.length

  return original.map(
    (elem, index) =>
    ({
      ...elem,
      ...pickPaths(propPaths, newValues[index + offset])
    })
  )
}
const mergeArrayOfObjectsRenamingProps = R.curryN(3, mergeArrayOfObjectsRenamingPropsUnc)
RE.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps
// mergeArrayOfObjectsRenamingProps(
//   [{ close: 5 }, { close: 6 }, { close: 30 }, { close: 50 }],
//   [{ path: 'close', name: 'gspc' }, { path: 'close', name: 'anotherCopy' }],
//   [{ close: 3 }, { close: 2 }]
// )//?


function RLog(prefix) {
  return (...obj) => {
    console.log(prefix, ...obj)
    return R.last(obj)
  }
}

RE.RLog = RLog
RE.findSolution = findSolution
RE.something = something
RE.uncurry = uncurry

export {
  R,
  RE,
  groupByWithCalc,
  innerRightJoinWith,
  unionWithHashKeys,
  updateWithHashKeys,
  between,
  matchByPropId,
  splitCond,
  filterMap,
  mapWithNext,
  mapWithPrevious,
  pipeWithChain,
  pipe,
  runFunctionsInParallel,
  RLog,
  findSolution,
  something,
  pickPaths,
  mergeArrayOfObjectsRenamingProps,
  uncurry,
  partialAtPos
}

