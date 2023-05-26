# js-awe

javascript utilities and extensions. Taking javascript to the next level.

## New functional async style. Avoid await contamination

Async await has done a lot to improve the readibility of code when compared with callbacks style. But sometimes it is not a good construct, specially if you want to use it in a functional style!!!

One problem I see, is the spread of async await around the source code wherever it is handy. Everytime we use await, an async branch will be created. The result will be a execution flow with the shape of a tree, with some chain functions running in sequence and others running concurrently. Understanding the tree of execution flow turns difficult. This is mainly by the fact that the construct of the tree is not explicitly coded in one place.

"Plan" tries to solve this problem by declaring this tree explicitly in one place and in a symple elegant way. "Plan" is an execution planner that pipe functions to run in sequence and functions to run concurrently. It handle for you promise chainning and data passing **so you can write pure functions free of async await**.

The construct to run in sequence: [fun1, fun2, fun3]

```comments
fun1 -> fun2 -> fun3
```

The construct ro run concurrently [[fun1],[fun2], fun3]

```comments
fun1 --|
        > fun3
fun2 --|
```

The best thing is to view an example of an API to get all the Bank contracts (savings and loans) with its balances for a customer:

```javascript
import { plan } from 'js-awe'

const getCustomerBalances = plan([
  getAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  formatCustomerBalances,
])

console.log(await getCustomerBalances('F12'))
```

Execution:

```comments
             |->filterSavings -> getSavingBalances -|
getAccounts -|                                      |-> formatCustomerBalances
             |->filterLoans   -> getLoanBalances   -|

```

Flow of data:

- Return values from functions are passed to the next function to run, in a pipe style way.
- When the return value is a promise, the planner will wait for its resolution before calling to the next function.

You can see the whole example here:

```javascript
import { plan } from 'js-awe'

const getCustomerBalances = plan([
  getAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  formatCustomerBalances,
])

console.log(await getCustomerBalances('F12'))

function getAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
  ])
}

function filterSavings(accounts) {
  return accounts.filter((account) => account.type === 'saving')
}

function getSavingBalances(savingAccounts) {
  return Promise.resolve(savingAccounts.map((account) => ({ balance: 5, ...account })))
}

function filterLoans(accounts) {
  return accounts.filter((account) => account.type === 'loan')
}
function getLoanBalances(loanAccounts) {
  return Promise.resolve(loanAccounts.map((account) => ({ balance: 4, ...account })))
}

function formatCustomerBalances([savingBalances, loanBalances]) {
  return [...savingBalances, ...loanBalances]
}


```

the Plan utility is recommended when we have a complex tree, and you want to manifest explicitly this async flow. For example, This utility would be a good tool for an API that generate its response based in different calls to other APIS. Specially if some of the calls needs to be call in sequence and others can be run concurrently.

When it is not recommended:

- Simple async flows. Introducing another tool to learn may not be worth it.
- You hate frameworks and abstractions.... totally get it.

## Chrono

Chrono time events and visualize them.

[chronoExampl.js](https://github.com/josuamanuel/js-awe/blob/main/sandbox/Chrono/chronoExample.js)

```logs
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
└─────────┴──────────────────────┴──────────┴─────
```

## And much more

For you to explore... or help with documentation.

## Generating types

The library offer typescript types in ./types/ for the consumer. Currently only the main functions are typed in detail.

To generate types:

tsc -p tsconfig.json

This will output types in ./genTypes then we will need to copy the new type definitions into ./types/ . This is to keep the documentation that was already manually generated.

## publishing lib to npm

Change the version of the library in package.json version field. npm forces that each version published to have a unique version value.

npm publish
