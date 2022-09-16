import { arraySorter, pushUniqueKeyOrChange, sorterByPaths, pushUniqueKey, sleepWithValue, CustomError, pushAt } from './jsUtils.js';
import { groupByWithCalc, R, RE } from './ramdaExt.js';
import { Table } from './table/table.js'
import { Text } from './table/components/text.js'
import { Timeline } from './table/components/timeline.js'
import { performance } from 'node:perf_hooks'
import { plan } from './plan.js';

// needed only for debuging
//import { RE } from './ramdaExt.js';

//TDL avarage
//TDL serialize and deserilize using performance.getEntriesByType("measure")

function Chrono() {
  let milisecondsNow
  if(performance.now) milisecondsNow = () => performance.now()
  if(milisecondsNow === undefined) milisecondsNow = ()=> Date.now()

  let historyTimeIntervals = {}

  let chronoEvents = {}
  createTimeEvent('chronoCreation')

  let rangeType = Range({type:'miliseconds', displayFormat:'ms', referenceMilisecondss: chronoEvents['chronoCreation'].miliseconds})

  function createTimeEvent(eventName) {
    chronoEvents[eventName] = {
      date: new Date(),
      miliseconds: milisecondsNow()
    }
  }

  function time(eventNames) {

    let currentMiliseconds = milisecondsNow()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {

      if(typeof eventName !== 'string' ||  isNaN(Number(eventName)) === false ) 
        throw new CustomError(
          'EVENT_NAME_MUST_HAVE_ALPHABETICS_CHARS',
          `Event name '${eventName}' must be of type string and contain some non numeric character`,
          eventName
        )

      historyTimeIntervals[eventName] = historyTimeIntervals[eventName] ?? {}

      historyTimeIntervals[eventName].start = historyTimeIntervals[eventName].start ?? []
      historyTimeIntervals[eventName].start.push(currentMiliseconds)
    })
  }


  function timeEnd(eventNames) {
    let currentMiliseconds = milisecondsNow()

    let listOfEvents =
      typeof eventNames === 'string'
        ? [eventNames] 
        : eventNames

    listOfEvents.forEach(eventName => {
      if (historyTimeIntervals[eventName] === undefined) {
        throw new CustomError('EVENT_NAME_NOT_FOUND', `No such Label '${eventName}' for .timeEnd(...)`, eventName);
      }

      let start = historyTimeIntervals[eventName].start.pop()

      if (start === undefined) {
        throw new CustomError('EVENT_NAME_ALREADY_CONSUMED',`eventName: '${eventName}' was already consumed by a previous call to .timeEnd(...)`, eventName);
      }

      historyTimeIntervals[eventName].ranges = historyTimeIntervals[eventName].ranges ?? []
      historyTimeIntervals[eventName].ranges.push(
        rangeType(
          start,
          currentMiliseconds
        )
      )

    })
  }

  function validateEvents()
  {
    const greatestNumberOfRanges = Object.entries(historyTimeIntervals).find(
      ([eventName, eventValues], indexEvent, intervalEntries) => 
        eventValues.ranges.length > intervalEntries[0][1].ranges.length
    )

    if(greatestNumberOfRanges !== undefined) 
      throw new CustomError(
        'FIRST_EVENT_SHOULD_HAVE_THE_GREATEST_NUMBER_OF_RANGES',
        `Found an event with more ranges than the first recorded`,
        greatestNumberOfRanges
      )
  }


  function fillWithUndefinedRanges()
  {
    //historyTimeIntervals['firstPap150'].ranges.pop()
    historyTimeIntervals //?

    Object.entries(historyTimeIntervals).forEach(
      ([eventName, eventValues], indexEvent, intervalEntries) => {
        let indexRangeForEvent = 0
        intervalEntries[0][1].ranges.forEach(
          ({start: startRef, end: endRef}, indexRangeRef) => {
            if(indexEvent === 0 ) {
              eventValues.ranges[indexRangeRef] = rangeType(startRef, endRef, indexRangeRef)
              return
            }

            let foundMatchingInterval = false
            while( 
              eventValues.ranges[indexRangeForEvent]?.start >= startRef &&
              ( 
                indexRangeRef + 1 === intervalEntries[0][1].ranges.length ||
                eventValues.ranges[indexRangeForEvent].start < intervalEntries[0][1].ranges[indexRangeRef + 1]?.start 
              )
            )
            {
              foundMatchingInterval = true
              
              // Accrued ranges for same interval, deleting the previous one
              if(eventValues.ranges[indexRangeForEvent -1]?.interval === indexRangeRef)
              {
                eventName
                eventValues.ranges[indexRangeForEvent] = 
                  rangeType(
                    eventValues.ranges[indexRangeForEvent].start - (eventValues.ranges[indexRangeForEvent-1].end - eventValues.ranges[indexRangeForEvent-1].start),
                    eventValues.ranges[indexRangeForEvent].end,
                    indexRangeRef
                  )
                eventValues.ranges.splice(indexRangeForEvent -1, 1)
              }else
              {
                eventValues.ranges[indexRangeForEvent] = 
                rangeType(
                  eventValues.ranges[indexRangeForEvent].start, 
                  eventValues.ranges[indexRangeForEvent].end,
                  indexRangeRef
                )
                indexRangeForEvent++
              }  
            }

            if(foundMatchingInterval === false)
            {
              pushAt(indexRangeForEvent, rangeType(undefined, undefined, indexRangeRef), eventValues.ranges)
              indexRangeForEvent++
            }
          }
        )
      }
    )
    historyTimeIntervals //?
  }

  function findParentRanges(indexEvent, intervalEntries)
  {
    let isNotAParent = true
    while(indexEvent !== 0 && isNotAParent === true) {
      indexEvent--
      isNotAParent = intervalEntries[indexEvent][1].ranges.some(({start, end}) => start === undefined || end === undefined)
    }

    indexEvent
    return [intervalEntries[indexEvent][1].ranges, indexEvent]
  }

  //TDL
  function avarageEvents()
  {
    validateEvents()
    fillWithUndefinedRanges()

    let newHistoryArrayTimeIntervals = Object.entries(historyTimeIntervals).reduce(
      (newHistoryIntervals, [eventName, eventValues], indexEvent, intervalEntries) => {

        const [parentRanges, parentIndexEvent] = findParentRanges( indexEvent, intervalEntries)

        const [totalElapse, totalEndToStartGap, totalStartToStartGap] =
          eventValues.ranges.reduce(
            ([totalElapse, totalEndToStartGap, totalStartToStartGap], {start=0, end=0}, indexRange) => {
              totalElapse = totalElapse + end - start
              if(indexEvent !== 0 && start !== 0 && end !== 0) {
                totalEndToStartGap = totalEndToStartGap + start - parentRanges[indexRange].end
                totalStartToStartGap = totalStartToStartGap + start - parentRanges[indexRange].start 
              }

              return [
                totalElapse,
                totalEndToStartGap,
                totalStartToStartGap
              ]
            },
            [0, 0, 0]
          )
        
        let avarageEventStart  
        let avarageEventEnd

        const totalRangesWithValues = 
          eventValues.ranges.filter(
            ({start, end}) => start !== undefined & end !== undefined
          ).length

        if(indexEvent === 0) {
          avarageEventStart = intervalEntries[0][1].ranges[0].start
        }

        if(indexEvent !== 0 && Math.abs(totalEndToStartGap) <= Math.abs(totalStartToStartGap) )
        {
          avarageEventStart = 
            newHistoryIntervals[parentIndexEvent].ranges[0].end +
            totalEndToStartGap/totalRangesWithValues
        }

        if(indexEvent !== 0 && Math.abs(totalStartToStartGap) < Math.abs(totalEndToStartGap) )
        {
          avarageEventStart = 
          newHistoryIntervals[parentIndexEvent].ranges[0].start +
            totalStartToStartGap/eventValues.ranges.length 
        }

        avarageEventEnd = avarageEventStart + totalElapse/eventValues.ranges.length

        newHistoryIntervals[indexEvent] = 
          {
            eventName,
            ranges: [
              rangeType(
                avarageEventStart,
                avarageEventEnd,
                0
              )
            ]
          }
 
        return newHistoryIntervals
      },
      []
    )
    historyTimeIntervals = newHistoryArrayTimeIntervals.reduce(
      (acum, el) => {
        acum[el.eventName] = {ranges:el.ranges}
        return acum
      },
      {}
    )

    //range: { start:3.5852760076522827 <-133.67405599355698-> end:137.25933200120926 }
  }

  function eventsReport(events)
  {
    const entriesEvents = Object.entries(events)
    const [minMilisecondss, maxMilisecondss] = entriesEvents.reduce(
      (acum, [eventName, eventObject]) => {
        eventObject.ranges.forEach(
          range => {
            if(acum[0] > range.start) acum[0] = range.start
            if(acum[1] <range.end) acum[1] = range.end
          })
       return acum
      },
      [Infinity,0]
    ) //?
    
    return events
  }

  function totalEventsElapseTimeReport(events)
  {
    let totalElapse = 0
    const toLog = events.reduce(
      (acum, current) => {
        let found = acum.find(el => el.name === current.name)

        const currentElapseMs = current.range.end - current.range.start
        totalElapse = totalElapse + currentElapseMs
        if(found) found.elapse = found.elapse + currentElapseMs
        else acum.push({name: current.name, elapse: currentElapseMs})

        return acum
      },
      []
    ).map(nameRange => {
      nameRange.percentage = Number(Number(100 * nameRange.elapse / totalElapse).toFixed(2))
      nameRange.elapse = Math.floor(nameRange.elapse)
      return nameRange
    })

    console.log('')
    console.log('Total elapse Time of each event: ')

    if(console.table) console.table(toLog)
    else console.log(toLog)

    return events
  }

  function coincidingEventsReport(elapseTable)
  {

    R.pipe(
      groupByWithCalc(
        (row) => JSON.stringify(row.runningEvents.sort(arraySorter())),
        { percentage: (l, r) => (l??0) + r, elapseMs: (l, r) => (l??0) + r }
      ),
      R.map( row => ({...row, elapseMs: Math.floor(row.elapseMs), percentage: Number(row.percentage.toFixed(2))}) ),
      (coincidingEvents) => {
        console.log('')
        console.log('Coinciding Events timeline: ')
        if(console.table) console.table(coincidingEvents)
        else console.log(coincidingEvents)
      }
    )(elapseTable)

    return elapseTable
  }

  function timelineReport(data)
  {
    const timeline = Table()

    timeline.addColumn({ type: Text(), id: 'event', title: 'Events' })
    timeline.addColumn({ type: Timeline(), id: 'ranges' })

    console.log('')
    console.log('Timeline of events:')
    console.log(timeline.draw(data))

    return data
  }

  function formatReportAndReturnInputParam(data)
  {
    let toReport = Object.entries(data).map(
      ([eventName, event]) => (
        {
          event: eventName, 
          ranges: event.ranges.map(
            ({start, end} ) => ({start: Math.floor(start), end: Math.floor(end)})
          )
        }))
    timelineReport(toReport)

    return data
  }
  
  function chronoReport()
  {
    console.log('')
    Object.entries(chronoEvents).forEach(
      ([key, value]) => console.log(key, ': ', value.date)
    )
  }

  function report() {
    createTimeEvent('report')
    chronoReport()
      R.pipe(
        //RE.RLog('0-->: '),
        formatReportAndReturnInputParam,
        eventsReport,
        historyToListOfNameRanges,
        //RE.RLog('1-->: '),
        totalEventsElapseTimeReport,
        //RE.RLog('2-->: '),
        compactListOfNameRanges,
        //RE.RLog('3-->: '),
        R.sort(sorterByPaths('range.start')),
        reportListOfNameRanges,
        //RE.RLog('4-->: '),
        coincidingEventsReport
      )(historyTimeIntervals)
  }

  function historyToListOfNameRanges(historyTimeIntervals) {
    return Object.entries(historyTimeIntervals)
      .reduce(
        (acum, [key, value]) => {
          acum.push(
            ...(value.ranges?.map(
              range => ({ name: key, range })
            ))??[]
          )

          return acum
        },
        []
      )
  }

  function compactListOfNameRanges(ListOfRangeNames) {
    return ListOfRangeNames.reduce(
      (acum, { name, range }) => {
        acum.push({ name, isLeft: true, edge: range.start, edgeEnd: range.end, interval:range.interval })
        acum.push({ name, isLeft: false, edge: range.end, interval:range.interval })
        return acum
      },
      []
    )
      .sort(sorterByPaths('edge'))
      .reduce(
        (acum, { name, isLeft, edge, edgeEnd }, index, table) => {
          if (isLeft) {
            let i = index
            do {
              pushUniqueKeyOrChange(
                { runningEvents: [name], range: rangeType(table[i].edge, table[i + 1].edge, table[i].interval) }
                , acum
                , ['range']
                , (newRow, existingRow) => {
                  pushUniqueKey(name, existingRow.runningEvents)
                  return existingRow
                }
              )
              i++
            } while (!(table[i].name === name && table[i].isLeft === false && table[i].edge === edgeEnd))
          }

          return acum
        },
        []
      ).filter(
        elem => elem.range.start !== elem.range.end
      )
  }

  function reportListOfNameRanges(listOfNameRanges) {
    let totalElapse = 0
    return listOfNameRanges.map(
      ({ runningEvents, range }) => {
        let elapseMs = milisecondsRangeToElapseMs(range)
        totalElapse = totalElapse + elapseMs
        return {
          runningEvents,
          elapseMs
        }
      }
    ).map(nameRange => {
      nameRange.percentage = 100 * nameRange.elapseMs / totalElapse
      return nameRange
    })
  }

  const setTime = event => data => { 
    time(event)
    return data
  }

  const setTimeEnd = event => data => { 
    timeEnd(event)
    return data
  }

  const logReport = data => {
    report()
    return data
  }

  const getChronoState = () => historyTimeIntervals

  return { time, timeEnd, report, setTime, setTimeEnd, logReport, getChronoState, avarageEvents }
}


function milisecondsRangeToElapseMs({start, end}) {
  return end - start
}




function Range(...params) {
  let type
  let displayFormat
  let referenceMilisecondss

  if(params.length >= 2 ) {
    return range(...params)
  }
  else {
    ({ type, displayFormat, referenceMilisecondss} = params[0])
    return range
  }

  function range(start, end, interval)
  {
    //console.log(interval) 
    if (start > end) throw new Error('range(start, end) start cannot be > than end')

    function toString() 
    {
      if(type === 'miliseconds' && displayFormat === 'ms' && referenceMilisecondss !== undefined) {
        const startMs = milisecondsRangeToElapseMs({start:referenceMilisecondss, end:start})
        const endMs = milisecondsRangeToElapseMs({start:referenceMilisecondss, end})
        return `${'interval: ' + interval} { start:${startMs} <-${endMs - startMs}-> end:${endMs} }`
      }

      return `{ start:${start}, end:${end} }`
    }

    function intersect(rangeB) {
      let newStart = start > rangeB.start ? start : rangeB.start
      let newEnd = end < rangeB.end ? end : rangeB.end

      if (newStart === undefined || newEnd === undefined) return range(undefined, undefined)
      if (newStart > newEnd) return range(undefined, undefined)

      return range(newStart, newEnd)
    }

    return {
      [Symbol.for('nodejs.util.inspect.custom')]: toString,
      toString,
      intersect,
      start,
      end,
      interval
    }
  }
}

export { Chrono }

let {setTime, setTimeEnd, logReport, avarageEvents, getChronoState} = Chrono()


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
)().then(avarageEvents).then(()=>console.log(getChronoState())).then(logReport)
