import { arraySorter, pushUniqueKeyOrChange, sorterByPaths, pushUniqueKey } from './jsUtils.js';
import { groupByWithCalc, R } from './ramdaExt.js';
import { Table } from './table/table.js'
import { Text } from './table/components/text.js'
import { Timeline } from './table/components/timeline.js'

// needed only for debuging
//import { RE } from './ramdaExt.js';

function Chrono() {
  let microSecondsNow
  if(performance.now) microSecondsNow = () => Math.floor(performance.now()*1000)
  if(microSecondsNow === undefined) microSecondsNow = ()=> Date.now()*1000

  let historyTimeIntervals = {}

  let chronoEvents = {}
  createTimeEvent('chronoCreation')

  let rangeType = Range({type:'microSeconds', displayFormat:'ms', referenceMicroSeconds: chronoEvents['chronoCreation'].microSeconds})

  function createTimeEvent(eventName) {
    chronoEvents[eventName] = {
      date: new Date(),
      microSeconds: microSecondsNow()
    }
  }

  function time(eventNames) {

    let currentMicroSeconds = microSecondsNow()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {
      historyTimeIntervals[eventName] = historyTimeIntervals[eventName] ?? {}

      historyTimeIntervals[eventName].start = historyTimeIntervals[eventName].start ?? []
      historyTimeIntervals[eventName].start.push(currentMicroSeconds)
    })
  }


  function timeEnd(eventNames) {
    let currentMicroSeconds = microSecondsNow()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {
      if (historyTimeIntervals[eventName] === undefined) {
        console.log(`No such Label '${eventName}' for .timeEnd(...)`, 'CustomWarning', 'WARN002');
        return
      }

      let start = historyTimeIntervals[eventName].start.pop()

      if (start === undefined) {
        console.log(`Label '${eventName}' was already consumed by a previous call to .timeEnd(...)`, 'CustomWarning', 'WARN003');
        return
      }

      historyTimeIntervals[eventName].ranges = historyTimeIntervals[eventName].ranges ?? []
      historyTimeIntervals[eventName].ranges.push(
        rangeType(
          start,
          currentMicroSeconds
        )
      )

    })
  }

  function eventsReport(events)
  {
    const entriesEvents = Object.entries(events)
    const [minMicroSeconds, maxMicroSeconds] = entriesEvents.reduce(
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

        const currentElapseMs = microSecondsToMs(current.range.end - current.range.start)
        totalElapse = totalElapse + currentElapseMs
        if(found) found.elapse = found.elapse + currentElapseMs
        else acum.push({name: current.name, elapse: currentElapseMs})

        return acum
      },
      []
    ).map(nameRange => {
      nameRange.percentage = Number(Number(100 * nameRange.elapse / totalElapse).toFixed(2))
      return nameRange
    })

    console.log('')
    console.log('Total elapse Time of each event: ')
    console.table(toLog)

    return events
  }

  function coincidingEventsReport(elapseTable)
  {

    R.pipe(
      groupByWithCalc(
        (row) => JSON.stringify(row.runningEvents.sort(arraySorter())),
        { percentage: (l, r) => (l??0) + r, elapseMs: (l, r) => Math.floor((l??0) + r) }
      ),
      R.map( row => ({...row, percentage: Number(row.percentage.toFixed(2))}) ),
      (coincidingEvents) => {
        console.log('')
        console.log('Coinciding Events timeline: ')
        console.table(coincidingEvents)
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
            ({start, end} ) => ({start: microSecondsToMs(start), end: microSecondsToMs(end)})
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
        //RE.RLog('-1-->: '),
        formatReportAndReturnInputParam,
        eventsReport,
        historyToListOfNameRanges,
        //RE.RLog('0-->: '),
        totalEventsElapseTimeReport,
        compactListOfNameRanges,
        //RE.RLog('1-->: '),
        R.sort(sorterByPaths('range.start')),
        reportListOfNameRanges,
        //RE.RLog('3-->: '),
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
        acum.push({ name, isLeft: true, edge: range.start, edgeEnd: range.end })
        acum.push({ name, isLeft: false, edge: range.end })
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
                { runningEvents: [name], range: rangeType(table[i].edge, table[i + 1].edge) }
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
        let elapseMs = microSecondsRangeToElapseMs(range)
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

  function microSecondsToDate(currentMicroSeconds) {
    let chronoCreation = chronoEvents['chronoCreation']
    let milisecondsDate =
      chronoCreation.date + (currentMicroSeconds - chronoCreation.microSeconds) / 1000

    return new Date(milisecondsDate)
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

  return { time, timeEnd, report, setTime, setTimeEnd, logReport, getChronoState }
}


function microSecondsRangeToElapseMs({start, end}) {
  return (end - start) / 1000
}


function microSecondsToMs(microSeconds) {
  return Math.floor(microSeconds / 1000)
}

function Range(...params) {
  let type
  let displayFormat
  let referenceMicroSeconds

  if(params.length === 2 ) {
    return range(params[0], params[1])
  }
  else {
    ({ type, displayFormat, referenceMicroSeconds} = params[0])
    return range
  }

  function range(start, end)
  {
    if (start > end) throw new Error('range(start, end) start cannot be > than end')

    function toString() 
    {
      if(type === 'microSeconds' && displayFormat === 'ms' && referenceMicroSeconds !== undefined) {
        const startMs = microSecondsRangeToElapseMs({start:referenceMicroSeconds, end:start})
        const endMs = microSecondsRangeToElapseMs({start:referenceMicroSeconds, end})
        return `{ start:${startMs} <-${endMs - startMs}-> end:${endMs} }`
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
      end
    }
  }
}

export { Chrono }