
import { performance } from 'node:perf_hooks'
import { sleepWithValue, } from '../src/jsUtils.js'
import { Chrono } from '../src/chrono.js'

const myChrono = Chrono()

myChrono.time('start')
sleepWithValue(100, 5).then(x => {
  console.log(x, myChrono.timeEnd('start'))
  myChrono.average()
  myChrono.report()
})


/*
const msStart = performance.now()
sleepWithValue(100, 5).then(x => { console.log(x, performance.now() - msStart) })
*/