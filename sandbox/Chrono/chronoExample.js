import { Chrono } from '../../src/chrono.js'
import { sleepWithFunction } from '../../src/jsUtils.js'

let chrono = Chrono()

chrono.time('step1')
tasks().then(()=>{
  chrono.timeEnd('step1')
  chrono.report()
})

async function tasks()
{

  await sleepWithFunction(
    650,
    () => {
      chrono.timeEnd('step1')
    }
  )

  await sleepWithFunction(
    20,
    () => {
      chrono.time('step2')
    }
  )

  await sleepWithFunction(
    12,
    () => {
      chrono.time('step3')
    }
  )

  await sleepWithFunction(
    500,
    () => {
      chrono.timeEnd('step3')
    }
  ),
  await sleepWithFunction(
    100,
    () => {
      chrono.timeEnd('step2')
    }
  ),
  await sleepWithFunction(
    15,
    () => {
      chrono.time('step1')
    }
  )
}



// let chrono2 = Chrono()

// chrono2.time('step1')
// tasks2().then(()=>{
//   chrono2.timeEnd('step1')
//   chrono2.report()
// })

async function tasks2()
{

  await sleepWithFunction(
    650,
    () => {
      chrono2.timeEnd('step1')
    }
  )

  await sleepWithFunction(
    300,
    () => {
      chrono2.time('step1')
    }
  )

  await sleepWithFunction(
    400,
    () => {
      chrono2.timeEnd('step1')
    }
  )

  await sleepWithFunction(
    500,
    () => {
      chrono2.time('step1')
    }
  )
}