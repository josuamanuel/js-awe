# js-awe

javascript awesome utilities and extensions. Taking javascript to the next level.

**NodeJS:**

```Bash
npm install js-awe
```

**100% compatible with bun:**

```Bash
bun install js-awe
```

Includes ```consoleTable([{a:1,b2},{a:2,b:3}])``` an equivalent implementatation of node console.table() producing similar visualization.

**Web:**

Grab the minified version at:

<https://raw.githubusercontent.com/josuamanuel/js-awe/main/dist/js-awe.min.js>

Then copy it in your project and work with it in your html:

```html
...
<body>
  <script type="module">
    import { firstCapital } from './js-awe.min.js';

    const newDiv = document.createElement('div');
    newDiv.innerText = firstCapital('library is loaded correctly...');
    document.body.appendChild(newDiv);

  </script>
</body>
...
```

## New functional async style. Avoid await contamination

Async await has done a lot to improve the readability of code when compared with callbacks style. But sometimes it is not a good construct, especially if you want to use it in a functional style!!!

One problem I see, is the spread of async await around the source code wherever it is handy. This casual handling of await usually makes code non performant.

Every-time we use await, an async branch will be created. The result will be an execution flow with the shape of a tree, with some chain functions running in sequence and others running concurrently.

js-awe library has a “plan” function that can help you with that.

“plan” tries to solve this problem by declaring this tree explicitly in one place and in a simple elegant way. It uses array nesting to define this tree. It does not use weird DSL. “plan” is an execution planner that pipe functions to run in sequence and functions to run concurrently. It handles for you the promise chaining and data passing **so you can write pure functions free of async await**.

The construct to run in sequence:

```Plaintext
[ fun1, fun2, fun3 ]

execution and data flow coincides:

fun1 -> fun2 -> fun3

* fun1 receives all the parameters when running the plan:
   plan().build(...)(param1, param2)
* fun2 receives output from fun1
* fun3 receives output from fun2
```

The construct to run concurrently:

```Plaintext
[ fun1, [fun2], [fun3], fun4 ]

execution and data flow coincides:

       |-> fun2 --|
fun1 --|          |-> fun4
       |-> fun3 --|

* fun1 receives all the parameters when running the plan:
   plan().build(...)(param1, param2)
* fun2 receives output from fun1
* fun3 receives output from fun1
* fun4 receives an array that contains two values:
  [outputFromfun2, outputFromFun3]
```

The best thing is to view an example. First, we need to install it:

```Bash
npm install js-awe
```

You can see below is a simple example of its use. This could be part of an API to get the bank balances of all the holdings (savings and loans) for a specific customer:

```javascript
import { plan } from 'js-awe'

const getCustomerBalances = plan().build([
  fetchAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  format,
])

console.log('result: ', await getCustomerBalances('0396d9b0'))
```

Execution:

```Plaintext
            |->filterSavings -> getSavingBalances -|
getAccounts-|                                      |-> format
            |->filterLoans   -> getLoanBalances   -|

```

The flow of data:

- Return values from functions are passed to the next function to run, in a pipe-style way.
- When the return value is a promise, the planner will wait for its resolution before calling the next function.

You can see the whole example here:

```javascript
import { plan } from 'js-awe'

const getCustomerBalances = plan().build([
  fetchAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  format,
])

console.log('result: ', await getCustomerBalances('0396d9b0'))

function filterSavings(accounts) {
  return accounts.filter((account) => account.type === 'saving')
}

function getSavingBalances(savingAccounts) {
  const listOfAcccountsToFetch = savingAccounts.map((account) => account.id)
  return fetchSavingBalances(listOfAcccountsToFetch)
}

function filterLoans(accounts) {
  return accounts.filter((account) => account.type === 'loan')
}
function getLoanBalances(loanAccounts) {
  const listOfAcccountsToFetch = loanAccounts.map((account) => account.id)
  return fetchLoanBalances(listOfAcccountsToFetch)
}

function format([savingBalances, loanBalances]) {
  return [...savingBalances, ...loanBalances]
}

// Data fetch services are mocked for local running.
// In production they should be fetch APIs to real implementations.
function fetchAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
  ])
}

function fetchSavingBalances(listOfAcccountsToFetch) {
  return Promise.resolve([
    {
      id: 1,
      type: 'saving',
      balance: 13,
    },
  ])
}

function fetchLoanBalances(listOfAcccountsToFetch) {
  return Promise.resolve([
    {
      id: 2,
      type: 'loan',
      balance: 24,
    },
  ])
}

```

The Plan utility is recommended when we have a complex tree, and you want to manifest explicitly this async flow. For example, This utility would be a good tool for an API that generates its response based on different calls to other APIs. Especially if some of the calls need to be called in sequence and others can be run concurrently.

When it is not recommended:

- Simple async flows. Introducing another tool to learn may not be worth it.
- You have the skills to do it better yourself: more flexible, readible and performance.
- You are tired of new libraries, frameworks and abstractions. I get it!
- You are happy with your current approach.

## Chrono

Chrono time events and visualize them.

Spread in your Async code some:

```Javascript
chrono.time('step1')
chrono.timeEnd('step1')
```

And then ```chrono.report()``` to log the timeline and some stats.

Full example: [chronoExample.js](https://github.com/josuamanuel/js-awe/blob/main/sandbox/Chrono/chronoExample.js)

```Plaintext
chronoCreation :  2023-05-25T20:58:17.175Z
report :  2023-05-25T20:58:18.480Z

Timeline of events:
┌────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│ Events │ ms 0                                     650                             1186   1288  │
├────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ step1  │    |--------------------------------------|                                        || │
│ step2  │                                             |-------------------------------------|   │
│ step3  │                                              |-----------------------------|          │
└────────┴───────────────────────────────────────────────────────────────────────────────────────┘

Total elapse Time of each event:
┌─────────┬─────────┬────────┬────────────┐
│ (index) │  name   │ elapse │ percentage │
├─────────┼─────────┼────────┼────────────┤
│    0    │ 'step1' │  650   │   36.81    │
│    1    │ 'step2' │  615   │   34.84    │
│    2    │ 'step3' │  501   │   28.36    │
└─────────┴─────────┴────────┴────────────┘

Coinciding Events timeline:
┌─────────┬──────────────────────┬──────────┬────────────┐
│ (index) │    runningEvents     │ elapseMs │ percentage │
├─────────┼──────────────────────┼──────────┼────────────┤
│    0    │     [ 'step1' ]      │   650    │   51.38    │
│    1    │     [ 'step2' ]      │   114    │    9.04    │
│    2    │ [ 'step2', 'step3' ] │   501    │   39.58    │
└─────────┴──────────────────────┴──────────┴────────────┘
```

## And much more

For you to explore... Don't hesitate to explore the code: table.js, sanitizer.js, jsUtils.js...

Most of the functions has TS types. But more documentation will be needed. So if you want to help others:

please PULL REQUEST!!! with your changes.

## Generating types

The library offer typescript types in ./types/ for the consumer. Currently only the main functions are typed in detail.

To generate types:

tsc -p tsconfig-types.json

This will output types in ./genTypes then we will need to copy the new type definitions into ./types/ . This is to keep the documentation that was already manually generated.

## publishing lib to npm

Change the version of the library in package.json version field. npm forces that each version published to have a unique version value.

npm publish
