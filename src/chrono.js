import { arraySorter, pushUniqueKeyOrChange, sorterByPaths, pushUniqueKey } from './jsUtils.js';
import { sleepWithFunction } from './jsUtils.js';
import { groupByWithCalc, R, RE } from './ramdaExt.js';
import { Table } from './table/table.js'
import { Text } from './table/components/text.js'
import { Timeline } from './table/components/timeline.js'

function Chrono() {
  let now;
  try {
    now = process.hrtime.bigint; 
  }catch(e)
  {}

  try { 
    if(now === undefined) now = ()=> BigInt(performance.now()*1000);
  }catch(e)
  {
    now = ()=> BigInt(Date.now()*1000);
  }

  let historyTimeIntervals = {}

  let chronoEvents = {}
  createTimeEvent('chronoCreation')

  let rangeType = Range({type:'hrtimeBigInt', displayFormat:'ms', referenceHrtime: chronoEvents['chronoCreation'].hrtime})

  function createTimeEvent(eventName) {
    chronoEvents[eventName] = {
      date: new Date(),
      hrtime: now()
    }
  }

  function time(eventNames) {

    let currentHrtime = now()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {
      historyTimeIntervals[eventName] = historyTimeIntervals[eventName] ?? {}

      historyTimeIntervals[eventName].start = historyTimeIntervals[eventName].start ?? []
      historyTimeIntervals[eventName].start.push(currentHrtime)
    })
  }


  function timeEnd(eventNames) {
    let currentHrtime = now()

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
          currentHrtime
        )
      )

    })
  }

  function eventsReport(events)
  {
    const entriesEvents = Object.entries(events)
    const [minHrtime, maxHrtime] = entriesEvents.reduce(
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
    
     
  //   console.log(`
  //  -------------------------------------------------------------------------------------------
  // | events              | ms  0     80        200   500        900     1100                   |
  // |---------------------|---------------------------------------------------------------------|          
  // | loadConfig          |     |----------------------|          |--------|                    |
  // | getCards            |     |-----------|          |---------------|                        |
  // | getAccounts         |     |------|                                                        |
  // | compeseFinalOutput  |                       |--------------|         |---------------|    |
  //  -------------------------------------------------------------------------------------------
  //   `)
    //plot(entriesEvents, minHrtime, maxHrtime)
    return events
  }

  function totalEventsElapseTimeReport(events)
  {
    let totalElapse = 0
    const toLog = events.reduce(
      (acum, current) => {
        let found = acum.find(el => el.name === current.name)

        const currentElapseMs = hrtimeBigIntToMs(current.range.end - current.range.start)
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
        { percentage: (l, r) => (l??0) + r, elapseMs: (l, r) => (l??0) + r }
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
            ({start, end} ) => ({start: hrtimeBigIntToMs(start), end: hrtimeBigIntToMs(end)})
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
        R.sort(sorterByPaths('range')),
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
        let elapseMs = hrtimeBigIntRangeToElapseMs(range)
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

  function hrtimeToDate(currentHrtime) {
    let chronoCreation = chronoEvents['chronoCreation']
    let milisecondsDate =
      chronoCreation.date - 0 +
      Number((currentHrtime - chronoCreation.hrtime) / BigInt(1000000))

    return new Date(milisecondsDate)
  }

  return { time, timeEnd, report }
}


function hrtimeBigIntRangeToElapseMs({start, end}) {
  return Number((end - start) / BigInt(1000000))
}
//hrtimeBigIntRangeToElapseMs(Range(BigInt(1953997827221605), BigInt(1953997981407671) )) //?
//hrtimeBigIntRangeToElapseMs({ start:BigInt(1953997827221605), end:BigInt(1953997981407671) }) //?

function hrtimeBigIntToMs(hrtime) {
  return Number(hrtime / BigInt(1000000))
}

function Range(...params) {
  let type
  let displayFormat
  let referenceHrtime

  if(params.length === 2 ) {
    return range(params[0], params[1])
  }
  else {
    ({ type, displayFormat, referenceHrtime} = params[0])
    return range
  }

  function range(start, end)
  {
    if (start > end) throw new Error('range(start, end) start cannot be > than end')

    function toString() 
    {
      if(type === 'hrtimeBigInt' && displayFormat === 'ms' && referenceHrtime !== undefined) {
        const startMs = hrtimeBigIntRangeToElapseMs({start:referenceHrtime, end:start})
        const endMs = hrtimeBigIntRangeToElapseMs({start:referenceHrtime, end})
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