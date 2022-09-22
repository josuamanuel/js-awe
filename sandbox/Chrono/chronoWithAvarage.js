
import { plan } from '../../src/plan.js'
import { Chrono } from '../../src/chrono.js'
import { sleepWithValue } from '../../src/jsUtils.js'

let { setTime, setTimeEnd, logReport, average, getChronoState } = Chrono()


plan(
  [
    // Ite 1
    setTime('100ms'),
    () => sleepWithValue(100, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap70'),
      () => sleepWithValue(93, 5).then(setTimeEnd('firstPap70')),
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
    () => sleepWithValue(115, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap70'),
      () => sleepWithValue(93, 5).then(setTimeEnd('firstPap70')),
    ],
    [
      setTime('secondPap80'),
      () => sleepWithValue(160, 5).then(setTimeEnd('secondPap80')),
    ],
    // setTime('lastProcess30'),
    // () => sleepWithValue(70, 5).then(setTimeEnd('lastProcess30')),

    // Ite 3
    setTime('100ms'),
    () => sleepWithValue(90, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
    ],
    // [
    //   setTime('firstPap70'),
    //   () => sleepWithValue(60, 5).then(setTimeEnd('firstPap70')),
    // ],
    // [
    //   setTime('secondPap80'),
    //   () => sleepWithValue(280, 5).then(setTimeEnd('secondPap80')),
    // ],
    // setTime('lastProcess30'),
    // () => sleepWithValue(70, 5).then(setTimeEnd('lastProcess30')),

    // Ite 4
    setTime('100ms'),
    () => sleepWithValue(95, 5).then(setTimeEnd('100ms')),
    [
      setTime('parentOfFirstPap150'),
      () => sleepWithValue(2, 5).then(setTimeEnd('parentOfFirstPap150')),
      setTime('firstPap70'),
      () => sleepWithValue(94, 5).then(setTimeEnd('firstPap70')),
    ],
    // [
    //   setTime('secondPap80'),
    //   () => sleepWithValue(280, 5).then(setTimeEnd('secondPap80')),
    // ],
    setTime('lastProcess30'),
    () => sleepWithValue(120, 5).then(setTimeEnd('lastProcess30')),

  ]
)().then(average)
  //.then(()=>console.log(getChronoState()))
  .then(logReport)
