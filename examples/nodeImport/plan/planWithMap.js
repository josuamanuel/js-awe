/*
Example using map function from plan()

plan has a default parameter numberOfThreads with default value infitnity to specify the number of concurrent calls to run in parallel.
But sometimes we would like to apply a different numberOfThreads value for a specific part of the pipeline.
We can use map preceded by something that returns an array or a Promise<array> to apply for each value of the array
a function that return a promise. These promises will be executed with a maximun number of elements in parallel equal to the
numberOfThreads.

The typical scenario for this is:

plan().build(
  [
    queryAllCustomersWithBalanceGreatThan2000,
    map(fetchAddres, 5)
  ]
)

As the fist method could return 50k customers. We could be banned for the fetchAddress API. so we need to call in batch of 5 calls.
This will keep the default value numberOfThreads=Infinity for the rest of the pipeline.

*/

import { plan, sleepWithValue } from 'js-awe'
// const { plan } = require('js-awe')

const {build, map } = plan()

const result = build(
  [
    arrayWithValues,
    map((elInArray)=> sleepWithValue(1000, elInArray), 5) // numberOfThreads 5 (willl take 2seconds: 1sec *(10 el in array / 5 (taken in 5))
  ]
)

function arrayWithValues()
{
  return [1,2,4,8,16,32,64,128,256,512,1024]
}

result()
  .then(result => console.log(`result: ${result}`))
  .catch(error => console.log(`error: ${error}`))
