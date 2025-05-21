# js-awe

Awesome javascript utilities and extensions. Taking javascript to the next level. Including:

* plan: New functional async style. Avoid await contamination
* [Chrono](#chrono): Chrono time events and console.log using a visual charArt timeline.

```Bash
npm install js-awe
```

Compatible with bun, web, CDN, import, require. To full guide on installation [Go to Section](#installation)

## plan

### Example

***Simple declarative way to specify running functions sequencially or concurrently resulting in the below execution flow:***

```plainText
       |-> fun2A -> fun3-|
fun1 --|                 |-> fun5
       |-> fun2B -> fun4-|
```

```javascript
const { plan } = require("js-awe")
 
let { fun1, fun2A, fun3, fun2B, fun4, fun5 } = exportDemoFunctions()
 
const myCalc = plan().build([
  fun1,                      
  [fun2A, fun3],
  [fun2B, fun4],
  fun5                  
])

myCalc(3).then(result => console.log(result)) //=> 17

// Just some simple functions to demonstrate the plan functionality
function exportDemoFunctions() {
  return { 
    fun1: val1 => Promise.resolve(val1 * 2),    // fun1: 3*2 = 6
    fun2A: val2 => val2 + 1,                    // fun2A: 6 + 1 = 7
    fun3: val3 => Promise.resolve(val3 + 3),    // fun3: 7 + 3 = 10
    fun2B: val2 => Promise.resolve(val2 - 1),   // fun2B: 6 - 1 = 5;
    fun4: val4 => val4 + 2,                     // fun4: 5 + 2 = 7
    fun5: ([val4, val5]) => val4 + val5,        // fun5: 10 + 7 = 17; Promise.resolve(17)
  }
}
```

### New Functional Asynchronous Style: Preventing Await Complexity

* By using ***plan***, it seamlessly pipe functions. Values are passed automatically between functions. In case of the value being a promise, it will extract the resolve value before being passed to the next function.
* Automatic error handling is provided. If any function returns an "Error" object or a rejected Promise, the rest of the pipeline is skipped, and the error is propagated without the need for explicit error handling in each individual function.
* Sequential or concurrent execution can be defined through nested arrays, allowing for a clean and intuitive syntax without the need for artificial constructs. The code remains pure JavaScript.

In essence, this new functional asynchronous style introduced by ***plan*** simplifies asynchronous programming by abstracting away the complexities of dealing with promises and await statements. It provides a streamlined approach to composing asynchronous functions, automatically handling errors, and organizing the execution flow through a declarative syntax, all while maintaining the familiarity of JavaScript.

***The libary handles the mixing of sync and async functions seamlessly***

***No need to handle errors in all functions.***

* Returning error or Promise.reject in a function will skip the rest of execution automatically. No need to throw exceptions.
* Only add error handling when we want expressely to recover from the error at that point.

```javascript
const { plan } = require('js-awe')
// import { plan } from 'js-awe'

const result = plan().build([
  (val1, val2) => 
    val2 !==0
      ? Promise.resolve(val1 / val2)
      : Promise.reject(new Error('Zero division')),
  val3 => {
    const result = Math.sqrt(val3 - 5)
    return Number.isNaN(result)
      ? new Error('Root of negative')
      : result
  } 
])

const handlingErrors = e => {
  if(e.message === 'Zero division') console.log('ooops divison by zero')
  if(e.message === 'Root of negative') console.log('ooops root of a negative value')
  if(e.message !== 'Zero division' && e.message !== 'Root of negative') console.log(e)
}

result(3, 0)
  .then(result => console.log(`result: ${result}`))
  // Error handling managed in one place
  .catch(handlingErrors)

result(4,2)
  .then(result => console.log(`result: ${result}`))
  .catch(handlingErrors)
```

***The purpose:***

Async await has done a lot to improve the readability of code when compared with callbacks style. But sometimes it is not a good construct, especially if you want to use it in a functional style!!!

**plan** tries to solve the problem of too many async await all spreads in a messy way around the code. It declares in just one point of your code the flow of execution, so you can work with pure functions that receives real values (no promises).

How many times you have experienced the problem of expecting real values and what you receive is a promise. How many times you solve this problem with an await making the code non performant as we end-up programming secuencially.

Whenever we use await, the execution flow branches into two separate paths. Employing await statements across different parts of your code creates an execution flow that resembles a tree-like structure. This complicates code readability, as you need to maintain and synchronize two mental models concurrently: one for the data flow and another for the execution flow. Juggling this dual cognitive load makes the code more challenging to comprehend and reason about effectively.

“plan” tries to solve this problem by declaring the asynchoricity explicitly in one place and in a simple elegant way. It uses array nesting to define this tree. It does not use weird DSL. “plan” is an execution planner that pipes functions to run in sequence and functions to run concurrently. It handles for you the promise chaining and data passing **so you can write pure functions free of async await**.

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

You can see below a more realistic example of its use. This could be part of an API to get the bank balances of all the holdings (savings and loans) for a specific customer:

```javascript
import { plan } from 'js-awe'
// const { plan } = require('js-awe')

const getCustomerBalances = plan().build([
  fetchAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  format,
])

getCustomerBalances('0396d9b0').then(result => console.log('result: ', result))
```

Execution:

```Plaintext
            |->filterSavings -> getSavingBalances -|
getAccounts-|                                      |-> format
            |->filterLoans   -> getLoanBalances   -|

```

The flow of data:

* Return values from functions are passed to the next function to run, in a pipe-style way.
* When the return value is a promise, the planner will wait for its resolution before calling the next function.

You can see the whole example here:

```javascript
import { plan } from 'js-awe'
// const { plan } = require('js-awe')

const getCustomerBalances = plan().build([
  fetchAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  format,
])

getCustomerBalances('0396d9b0').then(result => console.log('result: ', result))

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

// Data fetch services below are mocked just for demonstration to run locally.
// In production they should be fetch APIs of the real implementations that return promises.
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

* Simple async flows. Introducing another tool to learn may not be worth it.
* Critical applications. It is not a contrasted solution with complex products using it in production.
* You have the skills to do it better yourself: more flexible, readible and performance.
* You are tired of new libraries, frameworks and abstractions. I get it!
* You are happy with your current approach.

## <a id="chrono"></a>Chrono

Chrono time events and visualize them.

Spread in your Async code some:

```Javascript
chrono.time('step1')
chrono.timeEnd('step1')
```

And then ```chrono.report()``` to log the timeline and some stats.

Full example: [chronoExample.js](https://github.com/josuamanuel/js-awe/blob/main/examples/nodeImport/chrono/chronoExample.js)

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

## build

npm run build

* Run the test. If it fails cancel the build.
* This will build for nodeJs in ./dist with support for Module Es in mjs folder and commonjs in cjs.
* Build for web in dist/browser/js-awe.min.js
* generate types and copy them to genTypes folder. see more details below

## Generating types

The library offer typescript types in ./types/ for the consumer. Currently only the main functions are typed in detail.

To generate automatically a basic type definition (mainly all with generic any type) you can execute:

npm run genAndCopyTypes

This will output types in ./genTypes then it will copy the d.ts.map to ./types/ and d.ts files if they don't exist in ./types/. It is recommended to improve the automatic generation of types and to document with JsDoc.

## publishing lib to npm

Change the version of the library in package.json version field. npm forces that each version published to have a unique version value.

npm publish

## <a id="installation"></a>Installation

**NodeJS:**

```Bash
npm install js-awe
```

supporting import (ES Modules) and require (commonjs)

```javascript
import { plan } from 'js-awe'
```

or

```javascript
const { plan } = require('js-awe')
```

**100% compatible with bun:**

```Bash
bun install js-awe
```

Includes ```consoleTable([{a:1,b2},{a:2,b:3}])``` an equivalent implementatation of node console.table() producing similar visualization.

**Web:**

**Option 1:** Grab the minified version at:

<https://raw.githubusercontent.com/josuamanuel/js-awe/main/dist/browser/js-awe.min.js>

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

If you want to have types and IntelliSense support in your javascript files, grab file js-awe.min.dts and copy to the same folder as you copied js-awe-min.js:

<https://raw.githubusercontent.com/josuamanuel/js-awe/main/dist/browser/js-awe.min.d.ts>

N.B.: vscode does not support IntelliSense inside html script tag, at least at current 1.82.1. So if you want to work with type support you will need to externalize your javascript code in an external file and add it to your html with ```<script type="module" src="filename.js"></script>```

**Option 2:** CDN

```html
...
<body>
  <script type="module">
    import { firstCapital } from 'https://cdn.jsdelivr.net/gh/josuamanuel/js-awe/dist/browser/js-awe.min.js'

    const newDiv = document.createElement('div');
    newDiv.innerText = firstCapital('library is loaded correctly...');
    document.body.appendChild(newDiv);

  </script>
</body>
...
```

## TO-DO

* Take Ramda, fluture and JSONPath (project function) to another library so we can have a minimalist light library. Only dependencies allowed: just-*
* Take logLevelExtension to another library.
* Taking fluture means we remove flutures from plan()

## In progress

Generation of plantUML from a plan definition:

You can paste the plan definition at the end of src/planExt.js and uncomment, then you can run it:

```sh
node src/planExt.js
```

Then copy the log in console to a file.puml and preview with: cmd+shift+p preview current PlantUML
