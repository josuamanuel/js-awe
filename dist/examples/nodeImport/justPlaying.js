
import { sleepWithValue, Chrono} from 'js-awe'

const myChrono = Chrono()

myChrono.time('start')
sleepWithValue(100, 5)
  .then(x => {
    console.log(x, myChrono.timeEnd('start'))
    return sleepWithValue(100,5)
  })
  .then(x => {
    myChrono.average()
    myChrono.report()
  })


/*
const msStart = performance.now()
sleepWithValue(100, 5).then(x => { console.log(x, performance.now() - msStart) })
*/