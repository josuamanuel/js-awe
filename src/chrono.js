import { arraySorter, pushUniqueKeyOrChange, sorterByPaths, pushUniqueKey } from './jsUtils.js';
import { sleepWithFunction } from './jsUtils.js';
import { groupByWithCalc, R, RE } from './ramdaExt.js';

function Chrono() {


  let historyTimeIntervals = {}

  let chronoEvents = {}
  createTimeEvent('chronoCreation')

  function createTimeEvent(eventName) {
    let currentDate = new Date()

    chronoEvents[eventName] = {
      date: new Date(),
      hrtime: process.hrtime.bigint()
    }
  }

  function time(eventNames) {

    let currentHrtime = process.hrtime.bigint()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {
      historyTimeIntervals[eventName] = historyTimeIntervals[eventName] ?? {}

      historyTimeIntervals[eventName].start = historyTimeIntervals[eventName].start ?? []
      historyTimeIntervals[eventName].start.push(currentHrtime)
    })
  }


  function timeEnd(eventNames) {
    let currentHrtime = process.hrtime.bigint()

    let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames

    listOfEvents.forEach(eventName => {
      if (historyTimeIntervals[eventName] === undefined) {
        process.emitWarning(`No such Label '${eventName}' for .timeEnd(...)`, 'CustomWarning', 'WARN002');
        return
      }

      let start = historyTimeIntervals[eventName].start.pop()

      if (start === undefined) {
        process.emitWarning(`Label '${eventName}' was already consumed by a previous call to .timeEnd(...)`, 'CustomWarning', 'WARN003');
        return
      }

      historyTimeIntervals[eventName].ranges = historyTimeIntervals[eventName].ranges ?? []
      historyTimeIntervals[eventName].ranges.push(
        Range(
          start,
          currentHrtime
        )
      )

    })
  }



  function report() {
    createTimeEvent('report')
    console.log(chronoEvents)
    console.table(
      R.pipe(
        historyToListOfNameRanges,
        compactListOfNameRanges,
        R.sort(sorterByPaths('range')),
        reportListOfNameRanges,
        //RE.RLog('1-->: '),
        groupByWithCalc(
          (row) => JSON.stringify(row.runningEvents.sort(arraySorter())),
          { percentage: (l, r) => l??0 + r, elapseMs: (l, r) => l??0 + r }
        ),
        //RE.RLog('2-->: '),
      )(historyTimeIntervals) //?
    )
  }

  function historyToListOfNameRanges(historyTimeIntervals) {
    historyTimeIntervals
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
                { runningEvents: [name], range: Range(table[i].edge, table[i + 1].edge) }
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
      ) //?
  }

  function reportListOfNameRanges(listOfNameRanges) {
    let totalElapse = 0
    return listOfNameRanges.map(
      ({ runningEvents, range }) => {
        let elapseMs = Number((range.end - range.start) / BigInt(1000000))
        totalElapse = totalElapse + elapseMs
        return {
          runningEvents,
          elapseMs
        }
      }
    ).map(nameRange => {
      nameRange.percentage = 100 * nameRange.elapseMs / totalElapse
      return nameRange
    }) //?
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


function Range(start, end) {

  if (start > end) throw new Error('Range(start, end) start cannot be > than end')

  function toString() {
    return `{ start:${start}, end:${end} }`
  }

  function intersect(rangeB) {
    let newStart = start > rangeB.start ? start : rangeB.start
    let newEnd = end < rangeB.end ? end : rangeB.end

    if (newStart === undefined || newEnd === undefined) return Range(undefined, undefined)
    if (newStart > newEnd) return Range(undefined, undefined)

    return Range(newStart, newEnd)
  }

  return {
    [Symbol.for('nodejs.util.inspect.custom')]: toString,
    toString,
    intersect,
    start,
    end
  }
}

export { Chrono }


// let chrono = Chrono()

// chrono.time('step1')
// tasks().then(()=>{
//   chrono.timeEnd('step1')
//   chrono.report()
// })

// async function tasks()
// {

//   await sleepWithFunction(
//     650,
//     () => {
//       chrono.time('step2')
//     }
//   )

//   await sleepWithFunction(
//     300,
//     () => {
//       chrono.time('step3')
//     }
//   )

//   await sleepWithFunction(
//     400,
//     () => {
//       chrono.timeEnd('step2')
//     }
//   )

//   await sleepWithFunction(
//     500,
//     () => {
//       chrono.timeEnd('step3')
//     }
//   )
// }
