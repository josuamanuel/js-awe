
import { sleepWithValue, Chrono, filterMap} from 'js-awe'

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

filterMap((el, index)=> el > index, (el,index)=> el*index, [0,1,7,3,4,5,9]) //?


/*
const msStart = performance.now()
sleepWithValue(100, 5).then(x => { console.log(x, performance.now() - msStart) })
*/