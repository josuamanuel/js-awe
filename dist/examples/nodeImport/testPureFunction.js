import assert, { deepEqual } from 'assert'
import { isPromise } from 'util/types'
import { sleepWithValue } from 'js-awe'

let a = 3

function sum(b) {
  return a + b
}

testWithContext(sum, [2], 5, {})
//testWithContext(sum, [2], 5, { a: 4 }) // Fails
//testWithContext(sum, [2], 6, { a: 4 }) // Works

function testPure(fun, values, expected) {
  const actual = fun(...values)

  if (isPromise(actual)) actual.then((actualVal) => deepEqual(actualVal, expected, 'failed'))
  else deepEqual(actual, expected, 'failed')
}

function testWithContext(fun, values, expected, context) {
  Object.entries(context).forEach(([key, value]) => {
    eval(`${key} = value`)
  })

  testPure(fun, values, expected)
}

function closureFun(a) {
  return function sum(b) {
    return a + b
  }
}

let toTestSum = closureFun(2)

testWithContext(toTestSum, [4], 6, {})
testWithContext(toTestSum, [4], 6, { a: 9 })

function mutableStateClosureFun(a) {
  return {
    sum: function (b) {
      return a + b
    },
    changeA: (newA) => (a = newA),
  }
}

let toTestSumChangeScope = mutableStateClosureFun(2)
testWithContext(toTestSumChangeScope.sum, [3], 5, {})
toTestSumChangeScope.changeA(3)
//testWithContext(toTestSumChangeScope.sum, [3], 5, {}) // Fails
//testWithContext(toTestSumChangeScope.sum, [3], 6, {}) // Works

// Functions with promises as input param are pure if final result is predictable with specific values of input: Promise.resolve()
// For testing we need to fix the value of the input to be predictable,  otherwise it does not meet the creteria of:
// SAME INPUT VALUES produces different results.
//
// testPromise is a pure function
async function testPromise(myProm) {
  const myData = await myProm

  return myData.map((el) => el + 1)
}

let myProm = Promise.resolve([2, 6, 3])
testWithContext(testPromise, [myProm], [3, 7, 4], {})
testWithContext(testPromise, [myProm], [3, 7, 4], {})

// sumWithPromises is pure
function sumWithPromises(promA, promB) {
  return Promise.all([promA, promB]).then(([a, b]) => a + b)
}

const result = await sumWithPromises(Promise.resolve(3), Promise.resolve(2))
const expected = 5
assert(result === expected, `result: ${result} not equal to ${expected}`)

// I consider the following function pure as the fact that we could make the prom to resolve at different time, this will
// make the inputs different so it does not meet the requirement for  "WITH SAME INPUT" returns different values
//
// The fact that this function can return different outputs for same resolve values of promises in inputs... it is not sufficient
// because the time of the resolution of the promise differs between tests. Both, values and time resolution need to meet for a
// valid purity test to be considered.
//
// If the original intention of the function was to return the first value if not undefined othewise it should return the second,
// then definetly the function is implemented incorrectly,  but this is not related to the classification of purity of a function.
//
async function raceCond(promA, promB) {
  let valueA, valueB
  let result = await Promise.race([promA, promB])
  if (result === undefined) return await promB
}

console.log(
  await raceCond(
    sleepWithValue(6 /* ms */, 5 /* value */),
    sleepWithValue(4 /* ms */, 3 /* value */)
  )
)

// The fact that the implementation above is not easy to reason is more related with a bad implementation of functional design.
// It will make more sense to isolate promises and resolve them in the non functional part of the application,  and
// inject real resolve values to the core functional.

// Non functional side of the app

const [customerPrefs, customerDefaultPrefs] = await Promise.all([
  getCustomerPrefs('0396d9b0'),
  getCustomerDefaultPrefs(),
])
const prefs = valueOrDefault(customerPrefs, customerDefaultPrefs)

console.log(`preferences for customer: ${prefs}`)

function getCustomerPrefs(customer) {
  return sleepWithValue(6 /* ms */, undefined /* value */)
}

function getCustomerDefaultPrefs(customer) {
  return sleepWithValue(3 /* ms */, 5 /* value */)
}

// functional side

function valueOrDefault(valueA, valueB) {
  return valueA ?? valueB
}
