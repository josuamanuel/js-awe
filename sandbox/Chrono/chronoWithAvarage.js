
import { plan } from '../../src/plan.js'
import { Chrono } from '../../src/chrono.js'
import { sleepWithValue } from '../../src/jsUtils.js'

let { setTime, setTimeEnd, logReport, avarageEvents, getChronoState } = Chrono()


plan(
  [
    // Ite 1
    setTime('100ms'),
    () => sleepWithValue(100, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap150'),
      () => sleepWithValue(150, 5).then(setTimeEnd('firstPap150')),
    ],
    [
      setTime('secondPap80'),
      () => sleepWithValue(80, 5).then(setTimeEnd('secondPap80')),
      setTime('secondPap80'),
      () => sleepWithValue(80, 5).then(setTimeEnd('secondPap80')),
    ],
    // setTime('lastProcess30'),
    // () => sleepWithValue(30, 5).then(setTimeEnd('lastProcess30')),

    // Ite 2
    setTime('100ms'),
    () => sleepWithValue(70, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap150'),
      () => sleepWithValue(60, 5).then(setTimeEnd('firstPap150')),
    ],
    [
      setTime('secondPap80'),
      () => sleepWithValue(280, 5).then(setTimeEnd('secondPap80')),
    ],
    // setTime('lastProcess30'),
    // () => sleepWithValue(70, 5).then(setTimeEnd('lastProcess30')),

    // Ite 3
    setTime('100ms'),
    () => sleepWithValue(70, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
    ],
    // [
    //   setTime('firstPap150'),
    //   () => sleepWithValue(60, 5).then(setTimeEnd('firstPap150')),
    // ],
    // [
    //   setTime('secondPap80'),
    //   () => sleepWithValue(280, 5).then(setTimeEnd('secondPap80')),
    // ],
    // setTime('lastProcess30'),
    // () => sleepWithValue(70, 5).then(setTimeEnd('lastProcess30')),

    // Ite 4
    setTime('100ms'),
    () => sleepWithValue(70, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap150'),
      () => sleepWithValue(60, 5).then(setTimeEnd('firstPap150')),
    ],
    // [
    //   setTime('secondPap80'),
    //   () => sleepWithValue(280, 5).then(setTimeEnd('secondPap80')),
    // ],
    setTime('lastProcess30'),
    () => sleepWithValue(70, 5).then(setTimeEnd('lastProcess30')),

  ]
)().then(avarageEvents)
  //.then(()=>console.log(getChronoState()))
  .then(logReport)
