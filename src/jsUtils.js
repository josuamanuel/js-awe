'use strict'
import clone from 'just-clone'
const logWithPrefix = (title, displayFunc) => (message) => {

  let finalMessage = message

  if (typeof displayFunc === 'function') {

    finalMessage = displayFunc(message)
  }

  console.log(`${title}: ${finalMessage}`)

  return message
}


class CustomError extends Error {
  constructor(name = 'GENERIC', message = name, data = { status: 500 }) {
    super(message)
    super.name = name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.data = data
  }

  map(func) {
    return this
  }

  chain(func) {
    return this
  }

  static of=CustomError
}
// try {
//   throw new CustomError('aa','bb',{a:1,b:2})
// }catch(e)
// {
//   console.log(`name: ${e.name}, message: ${e.message}, data: ${JSON.stringify(e.data)}, stack: ${e.stack}`)
// }
//
// mapping a function to CustomError should return the CustomError without exeecuting the function
// import { pipeWithChain, R } from './ramdaExt.js'
// let divide = (dividend, divisor) => 
//   divisor !== 0 
//     ? dividend/divisor
//     : new CustomError('ZERO_DIVISION_EXC','Division by zero',{dividend,divisor}) 

// R.map(a => {
//   console.log(`It shouldn't print this`)
//   return a +2
// })(divide(8,0)) //?

class Enum {

  constructor(values, rules) {
    // activeObjectKey will be an object with keys from values array and only one current key active: {ON:false,OFF:true}
    let activeObjectKey

    // It will contain the active key for example 'OFF'. Once initialized activeObjectKey[activeKey] should be always equal to true
    let activeKey

    let stateRules

    if (Array.isArray(values) === false) throw new CustomError('NOT_AN_ARRAY', 'Only Array composed of non objects are permitted')
    if (values.filter((elem) => elem === 'object').length > 0) throw new CustomError('ARRAY_VALUES_MUST_BE_OF_BASIC_TYPE', 'Only basic types are allowed')

    let valuesNotAllowed = values.filter(elem => elem === 'get' || elem === 'set' || elem === 'getValue')

    if (valuesNotAllowed.length > 0) {
      throw new CustomError('ENUM_INVALID_ENUM_VALUE', `The following ENUM value/s are not allowed: ${valuesNotAllowed} as they are reserved words for enum`)
    }

    let valuesWithoutDuplicates = removeDuplicates(values)
    activeObjectKey = arrayToObject(valuesWithoutDuplicates, function defaultValue() { return false })
    activeKey = values[0]
    activeObjectKey[activeKey] = true

    if (rules !== undefined) setupRules(rules)

    this.get = get
    this.set = set
    this.getValue = getValue

    return new Proxy(activeObjectKey, this)

    ///

    function setupRules(rules) {
      if (rules === null || typeof rules !== 'object' || Array.isArray(rules) === true) {
        throw new CustomError('ENUM_RULES_BAD_FORMAT', 'rules is not an object: ' + rules)
      }

      for (let elem in rules) {
        if (activeObjectKey[elem] === undefined || Array.isArray(rules[elem]) === false) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', 'Each attribute of rules must be an element in the ENUM and its value should be an array: ' + activeObjectKey[elem] + rules[elem])
        }

        let valuesWithProblems = rules[elem].filter(itemTo => activeObjectKey[itemTo] === undefined)

        if (valuesWithProblems.length > 0) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', 'All elements in a rule entry must be one of the list values in the ENUM. The following values dont exist: ' + valuesWithProblems)
        }
      }

      stateRules = clone(rules)
    }

    function get(_target, prop) {
      if (prop === 'getValue') {
        return getValue
      }

      if (activeObjectKey[prop] == null) throw new CustomError('ENUM_INVALID_PROPERTY', `.${prop} is none of the possible values ${this}`)

      return activeObjectKey[prop]
    }

    function set(_undefined, prop, value) {
      if (value !== true) {
        throw new CustomError('ENUM_ACTIVATION_NO_TRUE', `Tryng to set ${prop} with ${value} but activation only admits true`)
      }

      if (activeObjectKey[prop] === undefined) {
        throw new CustomError('ENUM_INVALID_PROPERTY', `.${prop} is none of the possible values ${this}`)
      }

      if (validateChange(activeKey, prop)) {
        activeObjectKey[activeKey] = false
        activeObjectKey[prop] = true
        activeKey = prop
      } else throw new CustomError('ENUM_TRANSITION_NOT_ALLOWED', `.From: ${activeKey} --> To: ${prop}`)

      return true
    }

    function validateChange(activeElement, prop) {
      if (stateRules === undefined) return true

      return stateRules[activeElement] !== undefined && stateRules[activeElement].indexOf(prop) !== -1

    }
    function getValue() {
      return activeKey
    }
  }
}
// const ENGINE = new Enum(
//   ['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP','ABANDONED'],
//   {
//     'UNDEFINED':['START'],
//     'START':['SPEED', 'BREAK', 'STOP'],
//     'SPEED':['BREAK', 'STOP'],
//   }
// )
// ENGINE.START = true
// ENGINE.START //?
// ENGINE.SPEED = true
// ENGINE.SPEED 

// try {
//   ENGINE.SPEED = true
// }catch(e)
// {
//   e  //? ENUM_TRANSITION_NOT_ALLOWED It is not defined to go to itself.
// }

// try {
//   const result = new Enum(
//     ['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP','ABANDONED'],
//     {
//       'UNDEFINED':['START'],
//       'START':['SPEED', 'BREAK', 'STOP'],
//       'SPEEDRT':['BREAK', 'STOP'],
//     }
//   )

// } catch (e) {
//   e //?  ENUM_RULES_BAD_FORMAT SPEEDRT is not valid
// }


class EnumMap {
  constructor(values) {

    return new Proxy(clone(values), this)
  }

  get(target, prop) {
    if (target[prop] == null && this[prop] == null) throw new CustomError('ENUM_OUT_OF_RANGE', `.${prop} is none of the possible values ${this}`)

    if (this[prop] != null) return this[prop]

    return target[prop]
  }

  set(_undefined, prop) {
    throw new CustomError('ENUM_NOT_MODIFIABLE', `Object of .${prop} is not modifiable`)
  }

  invert() {
    let invertedValues = {}

    for (const elem in this) {
      if (this.hasOwnProperty(elem)) {
        if (invertedValues[this[elem]] === undefined) {
          invertedValues[this[elem]] = []
        }

        pushUniqueKey(elem, invertedValues[this[elem]])
      }
    }

    if (Object.keys(invertedValues).reduce((acum, current) => acum && invertedValues[current].length === 1, true)) {
      invertedValues = Object.keys(invertedValues).reduce(
        (acum, current) => {
          acum[current] = invertedValues[current][0]
          return acum
        },
        {}
      )
    }

    return new EnumMap(clone(invertedValues))
  }

}
// {
//   const SWITCHER = new EnumMap({ON:0,OFF:1})
//   SWITCHER.ON //? 0
//   SWITCHER.OFF //? 1
//   try { SWITCHER.ONFF
//   }catch(e){
//     e // ENUM_OUT_OF_RANGE
//   }
//   const INVERT_SWITCHER = SWITCHER.invert()
//   INVERT_SWITCHER['0'] //?
//   const value = SWITCHER.ON
//   value === 0 //? true
// }


function transition(states, events, transitions)
{
  states.forEach(validateStateFormat)
  events.forEach(validateEventFormat)

  let state = states[0]
  let finalTransitions = Object.entries(transitions).reduce(
    (acum, [stateKey, stateValue]) => {
      // validations
      validateState(stateKey)

      let newStateValue = stateValue
      if(typeof stateValue === 'string') 
      {
        validateState(stateValue)

        newStateValue = events.reduce(
          (acum, current) => {
            acum[current] = stateValue
            return acum
          },
          {}
        )
      }else
      {
        Object.entries(newStateValue).forEach(([key, value])=> {
          validateEvent(key)
          validateState(value)
        })
      }

      

      acum[stateKey] = {...acum[stateKey], ...newStateValue}
      return acum
    },
    states.reduce(
      (acum, current) => {
        acum[current] = 
          events.reduce(
            (acum2, el2) => {
              acum2[el2] = el2.toUpperCase()
              return acum2
            },
            {}
          )
        return acum
      },
      {}
    )
  )

  function sendEvent(event) {
    validateEvent(event)
    return state = finalTransitions[state][event]
  }

  sendEvent.valueOf = () => state

  return sendEvent

  function validateStateFormat(state)
  {
    if(state !== state.toUpperCase())
      throw new CustomError('STATE_MUST_BE_UPPERCASE', `The state: ${state} does not have all characters in uppercase`)
  }

  function validateState(state)
  {
    if(states.some(el => el === state) === false)
      throw new CustomError('STATE_NOT_FOUND', `The state: ${state} was not found in the list of states supplied: ${states}`)
  }


  function validateEventFormat(event)
  {
    if(event !== event.toLowerCase())
      throw new CustomError('EVENT_MUST_BE_LOWERCASE', `The event: ${event} does not have all characters in lowercase`)
  }


  function validateEvent(event)
  {
    if(events.some(el => el === event) === false)
      throw new CustomError('EVENT_NOT_FOUND', `The event: ${event} was not found in the list of events supplied: ${events}`)
  }
}

// const tranDef = [
//   ['SYNC', 'PROMISE', 'FUTURE', 'PROMISE_AND_FUTURE'],
//   ['sync','promise','future'],
//   // STATE:{event:NEW_STATE}
//   // if a event is not defined within a STATE then the default value is selected STATE:{missing_event: NEW_STATE(missing_event.toUpperCase())}
//   {
//     PROMISE:{
//       sync:'PROMISE',
//       future: 'PROMISE_AND_FUTURE'
//       //by default: promise: 'PROMISE'
//     },
//     FUTURE:{
//       sync:'FUTURE',
//       promise: 'PROMISE_AND_FUTURE',
//     },
//     PROMISE_AND_FUTURE: 'PROMISE_AND_FUTURE' // same as {sync: 'PROMISE_AND_FUTURE', promise: 'PROMISE_AND_FUTURE', future: 'PROMISE_AND_FUTURE'}
//   }
// ]

// const typeOfList = transition(...tranDef)

// typeOfList('future') //?
// typeOfList('future') //?
// typeOfList('promise') //?
// typeOfList('sync') //?
// try{
//   typeOfList('sync2')  //?
// }catch(e) {console.log(e)}

// typeOfList('sync') //?

// typeOfList.valueOf() //?

function arrayToObject(arr, defaultValueFunction) {
  return arr.reduce((acum, current, index) => {
    acum[current] = defaultValueFunction(current, index)
    return acum
  }, {})
}

function arrayOfObjectsToObject(iterable) {
  if (typeof iterable?.[Symbol.iterator] === 'function') {
    let acum = {}
    for (let elem of iterable) {
      for (const key in elem) {
        acum[key] = elem[key]
      }
    }
    return acum
  }

  return arr.reduce((acum, current, index) => {
    for (const key in current) {
      acum[key] = current[key]
    }
    return acum
  }, {})
}

function removeDuplicates(arr) {
  return [...new Set(arr)]
}


function reviverPromiseForCloneDeep(value) {
  if (jsUtils.isPromise(value)) return value
}

// reviver is called for each node as: reviver(nodeRef, currentPath, parent, key). 
// For example: being objIni={a:{b:{c:3}},d:4} the reviver to call node a.b will be
// reviver({c:3}, ['a','b'], {b:{c:3}}, 'b') currentPath=['root', 'parent', 'son', '0', 'jose']
// reviver return value will impact traverse: 
//  undefined: do nothing.
//  Any value: assign this value (parent[key])
//  traverse.stop: stop inmediatly traverse
//  traverse.skip: skip node. It doesnt look at children of node.
//  prune: if true remove node.


function traverse(objIni, reviver, pureFunction = true) {
  const currentPath = ['root']

  const objClone = pureFunction ? clone(objIni, reviverPromiseForCloneDeep) : objIni

  let exitVar = false
  let objForReviver = {}
  objForReviver['root'] = objClone

  let isSkipNodeOnce = reviverProcess(reviver, objForReviver, 'root', currentPath)

  if (objClone !== objForReviver['root']) return objForReviver['root']

  if (exitVar === true) return objForReviver['root']

  if (isSkipNodeOnce === false) {
    traverseRec(objForReviver['root'])
  }

  return objForReviver['root']

  function traverseRec(obj) {

    if (obj && obj instanceof Object && exitVar === false) {
      for (const prop in obj) {

        if (obj.hasOwnProperty(prop)) {
          currentPath.push(prop)

          let isSkipNodeOnce = reviverProcess(reviver, obj, prop, currentPath)

          if (exitVar === true) return

          if (isSkipNodeOnce === false) {
            traverseRec(obj[prop])
          }

          currentPath.pop()
        }
      }
    }
  }

  function reviverProcess(reviver, obj, prop, currentPath) {
    let isSkipNodeOnce = false

    if (reviver) {
      const resultReviver = reviver(obj[prop], currentPath, obj, prop)
      if (resultReviver !== undefined && resultReviver !== traverse.stop && resultReviver !== traverse.skip && resultReviver !== traverse.delete) {
        obj[prop] = resultReviver
      }

      if (resultReviver === traverse.stop) {
        exitVar = true
      }

      if (resultReviver === traverse.skip) {
        isSkipNodeOnce = true
      }

      if (resultReviver === traverse.delete) {
        obj[prop] = undefined
        isSkipNodeOnce = true
      }
    }

    return isSkipNodeOnce
  }

}

traverse.skip = Symbol()
traverse.stop = Symbol()
traverse.delete = Symbol()


function traverseVertically(functionToRun, verFields, toTraverse)
{
  if(Array.isArray(toTraverse) === false) return

  let runIndex = 0
  let maxLength = 0
  let firstTime = true
  for(let i = 0; firstTime || i < maxLength; i++)
  {
    let toReturn = []
    for(let j = 0; j< toTraverse.length; j++)
    {
      toReturn[j] = {...toTraverse[j]}
      for(const field of verFields)
      {
        if( firstTime) {
          maxLength = toTraverse[j]?.[field]?.length > maxLength
            ? toTraverse[j][field].length 
            : maxLength
        }
        toReturn[j][field] = toTraverse[j]?.[field]?.[i]
      }
    }
    if(maxLength !== 0) {
      functionToRun(toReturn, runIndex)
      runIndex++
    }
    firstTime = false
  }
}

function copyPropsWithValueUsingRules(objDest, copyRules, shouldUpdateOnlyEmptyFields = false) {

  return function (inputObj) {
    copyRules.map(
      (rule) => {
        let from, to
        if (typeof rule === 'object') {
          from = rule.from
          to = rule.to
        } else {
          from = rule
          to = rule
        }

        let valueToCopy = getValueAtPath(inputObj, from)

        if (valueToCopy === undefined || valueToCopy === null) return

        if (shouldUpdateOnlyEmptyFields === true && isEmpty(getValueAtPath(objDest, to)))
          setValueAtPath(objDest, to, valueToCopy)

        if (shouldUpdateOnlyEmptyFields === false)
          setValueAtPath(objDest, to, valueToCopy)

      }
    )

    return objDest
  }
}
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}}
//   copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d'}])(objFrom)
//   objTo
// }
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}}
//   copyPropsWithValueUsingRules(objTo, 
//     [
//       {from:'a.b', to:'c'},
//       {from:'d.e.f', to:'d.f'},
//       {from:'d.e.g', to:'d.g'}
//     ],
//     true
//   )(objFrom)
//   objTo
// }

function copyPropsWithValue(objDest, shouldUpdateOnlyEmptyFields = false) {
  return function (input) {
    traverse(input, (nodeValue, currentPath) => {

      if (isALeaf(nodeValue) === false) return

      if (nodeValue === undefined || nodeValue === null) return

      const destPath = currentPath.slice(1 - currentPath.length)

      if (shouldUpdateOnlyEmptyFields === true) {
        const valueAtDest = getValueAtPath(objDest, destPath)
        if (isEmpty(valueAtDest)) setValueAtPath(objDest, destPath, nodeValue)

        return
      }

      setValueAtPath(objDest, destPath, nodeValue) //?

    })

    return objDest
  }
}
// {
//   let objTo = { a: { b: 2 }, c: 3, h: { i: 3 } }
//   let objFrom = { a: { b: 4 }, c: undefined, d: { e: { f: 12 } } }
//   copyPropsWithValue(objTo)(objFrom) //?
//   objTo
// }
// {
//   let objTo = { a: { b: 2 }, c: 3, h: { i: 3 } }
//   let objFrom = { a: { b: 4 }, c: '', d: { e: { f: 12 } } }
//   copyPropsWithValue(objTo, undefined, true)(objFrom) //?
//   objTo
// }

function isALeaf(node) {
  const isABranch =
    (node?.constructor.name === 'Object' && Object.keys(node).length > 0) ||
    (node?.constructor.name == 'Array' && node.length > 0)

  return !isABranch
}
// isALeaf(undefined) //?
// isALeaf({a:'this is a leaf'}.a) //?
// isALeaf(new Date()) //?
// isALeaf([]) //?
// isALeaf({}) //?
// isALeaf({a:3}) //?
// isALeaf([undefined]) //?

function isEmpty(value) {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 0 ||
    value !== value ||
    (Array.isArray(value) && value?.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  ) return true

  return false
}
//isEmpty(0) //?

function firstCapital(str) {

  return typeof str === 'string' ? str[0].toUpperCase() + str.substring(1).toLowerCase() : str
}


function queryObjToStr(query) {
  return Object.keys(query).reduce((acum, current) => {
    const newAcum = acum ? acum + '&' : acum
    return newAcum + current + '=' + query[current]
  }, '')
}

function varSubsDoubleBracket(strToResolveVars, state, mode) {
  if (typeof strToResolveVars !== 'string') {
    return strToResolveVars
  }

  /*
    
  {
    "response": {
      "id": 1231,
      "description": "{{description=\"This is a test\"}}",
      "car": "{{plate}}",
      "active": "{{active=true}}",
      "ratenumber": "{{rate=10}}"
    }
  }
  */

  // regex to deal with the case the entire value is a substitution group
  let regexVar = /"{{(.*?)(?:=(.*?))?}}"/g

  let resultStr = strToResolveVars.replace(
    regexVar,
    (_notused, group1, group2) => {
      if (state && state[group1] !== undefined) {
        if (typeof state[group1] === 'string') return '"' + state[group1] + '"'
        else if (typeof state[group1] === 'object') {
          if (mode === 'url' && Array.isArray(state[group1]))
            return arrayToListQuery(state[group1])
          if (mode === 'url' && !Array.isArray(state[group1]))
            return objToQueryParams(state[group1])
          if (!mode) return JSON.stringify(state[group1])
        } else return state[group1]
      } else {
        if (group2 === undefined) return null
        //else if(group2.substring(0,2) === '\\"' && group2.substring([group2.length -1],2) === '\\"') return ('"' + group2 + '"')
        else return group2.replace(/\\"/g, '"')
      }
    }
  )

  // regex to do partial substitution of a group inside of a string value
  let regexVarPartial = /{{(.*?)(?:=(.*?))?}}/g
  let resultStrFinal = resultStr.replace(
    regexVarPartial,
    (_notused, group1, group2) => {
      if (state && state[group1] !== undefined) {
        if (typeof state[group1] === 'object') {
          if (mode === 'url' && Array.isArray(state[group1]))
            return arrayToListQuery(state[group1])
          if (mode === 'url' && !Array.isArray(state[group1]))
            return objToQueryParams(state[group1])
          if (!mode) return JSON.stringify(state[group1])
        } else return state[group1]
      } else {
        if (group2 === undefined) return null
        //else if(group2.substring(0,2) === '\\"' && group2.substring([group2.length -1],2) === '\\"') return ('"' + group2 + '"')
        else return group2.replace(/\\"/g, '')
      }
    }
  )

  return resultStrFinal
}

function arrayToListQuery(arr) {
  return arr.reduce((prev, curr) => prev + ',' + curr)
}

function objToQueryParams(obj) {
  return Object.keys(obj)
    .reduce((acum, curr) => acum + curr + '=' + obj[curr] + '&', '')
    .slice(0, -1)
}

function urlCompose(gatewayUrl, serviceName, servicePath) {
  return {
    gatewayUrl,
    serviceName,
    servicePath,
    url: gatewayUrl + serviceName + servicePath
  }
}

function urlDecompose(url, listOfServiceNames) {
  return listOfServiceNames
    .filter(elem => url.split(elem).length >= 2)
    .map(elem => {
      const [part1, ...restParts] = url.split(elem)
      return {
        gatewayUrl: part1,
        serviceName: elem,
        servicePath: restParts.join(elem)
      }
    })
}

function indexOfNthMatch(string, toMatch, nth) {
  return string.split(toMatch, nth).join(toMatch).length
}

function isDate(d) {
  return d instanceof Date && !isNaN(d);
}

function isStringADate(stringDate) {
  if (typeof stringDate !== 'string') return false

  const date = new Date(stringDate)

  if (date >= new Date('0000-01-01') && date <= new Date('9999-12-31')) return true

  return false
}

function dateFormatter(format) {
  return (date) => formatDate(format, date)
}

function formatDate(format, date) {

  let dateToProcess = (date ? new Date(date) : new Date())

  const months = new EnumMap({
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  })

  const indexMonths = months.invert()

  const days = new EnumMap({
    'Sunday': '0',
    'Monday': '1',
    'Tuesday': '2',
    'Wednesday': '3',
    'Thursday': '4',
    'Friday': '5',
    'Saturday': '6'
  })

  const indexDays = days.invert()

  const dateIsoString = dateToProcess.toISOString()

  const YYYY = dateIsoString.substr(0, 4)
  const YY = dateIsoString.substr(2, 2)
  const MM = dateIsoString.substr(5, 2)
  const DD = dateIsoString.substr(8, 2)
  const D = parseInt(DD, 10).toString()
  const hh = dateIsoString.substr(11, 2)
  const h = parseInt(hh, 10).toString()
  const mm = dateIsoString.substr(14, 2)
  const ss = dateIsoString.substr(17, 2)
  const mil = dateIsoString.substr(20, 3)
  const mi = dateIsoString.substr(20, 2)

  const month = indexMonths[MM]
  const dayOfWeek = indexDays[dateToProcess.getDay()]

  return format
    .replace(/\$YYYY/g, YYYY)
    .replace(/\$YY/g, YY)
    .replace(/\$MM/g, MM)
    .replace(/\$DD/g, DD)
    .replace(/\$D/g, D)
    .replace(/\$hh/g, hh)
    .replace(/\$h/g, h)
    .replace(/\$mm/g, mm)
    .replace(/\$ss/g, ss)
    .replace(/\$mil/g, mil)
    .replace(/\$mi/g, mi)
    .replace(/\$month/g, month)
    .replace(/\$dayOfWeek/g, dayOfWeek)

}
//formatDate('$YYYY-$MM-$DD', new Date('2021-02-28')) //?

function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss) {
  // Input format has 1 char (any could work) between each elements: years, months, days, hours, minutes and seconds
  const dateYYYY = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(0, 4))
  const dateMM = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(5, 2)) - 1 // Months start with 0
  const dateDD = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(8, 2))
  const datehh = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(11, 2))
  const datemm = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(14, 2))
  const datess = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(17, 2))

  return Date.UTC(dateYYYY, dateMM, dateDD, datehh, datemm, datess)
}

function dateToObj(date) {
  let dateToProcess = new Date(date) ?? new Date()
  let ISODate = dateToProcess.toISOString()

  return {
    YYYY: parseInt(ISODate.substr(0, 4)),
    MM: parseInt(ISODate.substr(5, 2)),
    DD: parseInt(ISODate.substr(8, 2)),
    hh: parseInt(ISODate.substr(11, 2)),
    mm: parseInt(ISODate.substr(14, 2)),
    ss: parseInt(ISODate.substr(17, 2)),
    mil: parseInt(ISODate.substr(20, 3))
  }
}
//dateToObj() //?
// const toPeriod = new Date()
// const fromPeriod = `${dateToObj(toPeriod).YYYY - 3}${formatDate('-$MM-$DD', toPeriod)}` 
// fromPeriod //?

function diffInDaysYYYY_MM_DD(iniDate, endDate) {
  return Math.ceil(
    (
      new Date(endDate) - new Date(iniDate)
    ) / (1000 * 60 * 60 * 24)
  ) //?
}

function subtractDays(daysToSubtract, date) {
  let dateToReturn =
    date
      ? new Date(date)
      : new Date()

  if (isDate(dateToReturn) === false) return date

  dateToReturn.setDate(dateToReturn.getDate() - daysToSubtract);
  return dateToReturn
}
//subtractDays(40).toISOString() //?
//subtractDays(3, new Date('2021-03-25')) //?

function previousDayOfWeek(dayOfWeek, date) {
  let dateObj = date ?? new Date()

  if (isDate(dateObj) === false) return date

  let diffInDaysOfWeek = dateObj.getDay() - dayOfWeek

  let toSubtract = diffInDaysOfWeek >= 0
    ? diffInDaysOfWeek
    : 7 + diffInDaysOfWeek

  return subtractDays(toSubtract, dateObj)
}
//previousDayOfWeek(6,new Date('2021-05-07')).toISOString() //?
//previousDayOfWeek(1,new Date('2021-03-25'))

function getSameDateOrPreviousFridayForWeekends(date) {
  let dateObj = date ?? new Date()

  if (isDate(dateObj) === false) return date

  const dayOfWeek = dateObj.getUTCDay()

  if (dayOfWeek > 0 && dayOfWeek < 6) return dateObj

  //Sunday
  if (dayOfWeek === 0) return subtractDays(2, dateObj)

  //Saturday (dayOfWeek === 6)
  return subtractDays(1, dateObj)
}
// getSameDateOrPreviousFridayForWeekends() //?
// //2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-15')).toISOString() //?
// ////2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-16')).toISOString() //?


const {
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus
} = (function () {
  //alias
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    //most importants
    reset: '\x1b[0m',
    reverse: '\x1b[7m',
    fgBlack: '\x1b[30m',
    fgRed: '\x1b[31m',
    fgGreen: '\x1b[32m',
    fgYellow: '\x1b[33m',
    //Others
    fgBlue: '\x1b[34m',
    fgMagenta: '\x1b[35m',
    fgCyan: '\x1b[36m',
    fgWhite: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    hidden: '\x1b[8m'
  }

  const colorMessage = (message, color) =>
    colors[color] + message + colors.reset

  const colorMessageByStatus = (message, status) => {
    let colorStatus

      ; (status >= 200) & (status < 300)
        ? (colorStatus = colors.green)
        : (status >= 300) & (status < 400)
          ? (colorStatus = colors.cyan)
          : (status >= 400) & (status < 500)
            ? (colorStatus = colors.yellow)
            : (colorStatus = colors.red)

    return colorStatus + message + colors.reset
  }

  const colorByStatus = status => {
    let colorStatus

      ; (status >= 200) & (status < 300)
        ? (colorStatus = colors.green)
        : (status >= 300) & (status < 400)
          ? (colorStatus = colors.cyan)
          : (status >= 400) & (status < 500)
            ? (colorStatus = colors.yellow)
            : (colorStatus = colors.red)

    return colorStatus
  }

  return { colors, colorMessage, colorMessageByStatus, colorByStatus }
})()

function findDeepKey(objIni, keyToFind) {
  const currentPath = []
  const result = []

  traverse(objIni)

  function traverse(obj) {
    for (const prop in obj) {
      if (prop === keyToFind) {
        result.push([...currentPath])
        result[result.length - 1].push(prop)
        result.push(obj[prop])
      }

      if (obj[prop] !== null && typeof obj[prop] == 'object') {
        currentPath.push(prop)
        traverse(obj[prop])
        currentPath.pop()
      }
    }
  }
  return result
}

function deepFreeze(o) {
  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function')
    ) {
      deepFreeze(o[prop])
    }
  })

  Object.freeze(o)

  return o
}

function getValueAtPath(obj, valuePath) {
  if (obj === undefined || obj === null || valuePath === undefined || valuePath === null) {
    return
  }

  if (valuePath === '') return obj

  let result = obj

  const valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath

  for (let o of valuePathArray) {
    if (result === undefined) return result

    if (
      (result instanceof Object)
    ) {
      if (o === '$last' && Array.isArray(result)) result = result[result.length - 1]
      else result = result[o]
    } else {
      result = undefined
    }
  }

  return result
}
// getValueAtPath(undefined, '') //?
// getValueAtPath(5, '') //?
// getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?
// getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'arr.$last.b') //?
// getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?


function setValueAtPath(obj, valuePath, value) {
  // modified the value of an existing property:   {a:8} ==> 'a' with 12 => {a:12}
  const MODIFIED = 'MODIFIED'

  // added another property to an existing object: {a:8} ==> 'b' with 14 => {a:8,b:14}   --or--   {a:{c:8}} == 'a.b' with 14 => {a:{c:8, b:14}}
  const ADDED = 'ADDED'

  // The path provoked the creation of a new object that was nested.
  // Examples: {a:8} == 'a.b' with 3 => {a:{b:3}}  --or--   {a:{b:3}} == 'c.d' with 3 => {a:{b:3},c:{d:3}}
  // Before the request the penultimate path item is not an object. As in: a of 'a.b' ... or c of 'c.d' for the above examples
  const CREATED = 'CREATED'

  const FAILED = 'FAILED'

  let result = obj
  let valueReturn = FAILED
  let valuePathArray

  if (obj === undefined || obj === null || valuePath === undefined || valuePath === null) {
    throw { name: 'setValueAtPathParamsException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
  }

  try {
    valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath
    valuePathArray
    for (let i = 0, j = valuePathArray.length; i < j; i++) {

      if (i === (valuePathArray.length - 1)) {
        if (result?.[valuePathArray[i]] !== undefined) {
          result?.[valuePathArray[i]] //?
          valueReturn
          if (valueReturn !== CREATED) valueReturn = MODIFIED
        } else {
          if (valueReturn !== CREATED) valueReturn = ADDED
        }
        result[valuePathArray[i]] = value
      } else {
        if (typeof result[valuePathArray[i]] !== 'object') {
          if (Number.isNaN(Number(valuePathArray[i + 1]))) result[valuePathArray[i]] = {}
          else result[valuePathArray[i]] = []

          valueReturn = CREATED
        }

        result = result[valuePathArray[i]]
      }
    }
    if (valueReturn === FAILED) {
      throw { name: 'setValueAtPathException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
    }
  }
  catch (e) {
    console.log(e + ' Warning: There was an exception in setValueAtPath(obj, valuePath, value)... obj: ' + obj + ' valuePath: ' + valuePath + ' value: ' + value)
    valueReturn = FAILED
    return valueReturn
  }
  return valueReturn
}
// {
//   let obj = {}
//   setValueAtPath(obj, 'a', '8') //?
//   obj //?
//   let obj2 = {a:3}
//   setValueAtPath(obj2, 'b', '8') //?
//   setValueAtPath(obj2, 'a.b', '8') //?
//   setValueAtPath(obj2, 'd.e', 'a') //?
//   obj2
//   setValueAtPath(obj2, 'd.f', 'b') //?
//   setValueAtPath(obj2, 'd.e', 'aa') //?
//   setValueAtPath(obj2, 'e.g', 'c') //?
//   obj2 //?
// }

const sorterByPaths = (paths, isAsc = true) => {
  let great = 1
  let less = -1

  if (isAsc === false) {
    great = -1
    less = 1
  }

  let pathArr
  if (typeof paths === 'string') pathArr = [paths]
  else pathArr = [...paths]

  return (objA, objB) => {

    for (let currentPath of pathArr) {
      if (getValueAtPath(objA, currentPath) > getValueAtPath(objB, currentPath)) return great
      else if (getValueAtPath(objA, currentPath) < getValueAtPath(objB, currentPath)) return less
    }

    return 0
  }

}
// console.log(
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b')),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b', true)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b', false)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths(['a.b'], false)),
//   [{a:{b:3,c:2}}, {a:{b:3,c:1}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths(['a.b','a.c'], true)),
// )

function filterFlatMap(mapWithUndefinedFilterFun, data) {
  let result = []
  let resultSize = 0
  let mappedItem

  for (let index = 0, dataLength = data.length; index < dataLength; index++) {
    mappedItem = mapWithUndefinedFilterFun(data[index], index, data)

    if (mappedItem !== undefined) {
      if (Array.isArray(mappedItem) === true) {
        for (let mappedItemIndex = 0, mappedItemLength = mappedItem.length; mappedItemIndex < mappedItemLength; mappedItemIndex++) {
          if (mappedItem[mappedItemIndex] !== undefined) result[resultSize++] = mappedItem[mappedItemIndex]
        }
      } else {
        result[resultSize++] = mappedItem
      }

    }
  }

  return result
}
// filterFlatMap(
//   (elem, index)=> {
//     if(index === 0) return [elem, elem + 2, undefined]
//     if(index === 1) return elem + 2
//     if(index === 2) return undefined
//     if(index === 5) return [undefined]
//     if(index === 6) return []

//     return elem
//   }
//   , [1,4,13,3,8,9,11]) //?

const arraySorter = (isAsc = true) =>
  (a, b) => {
    if (isAsc === false) {
      if (a < b) return 1
      if (a > b) return -1
      return 0
    }

    if (a < b) return -1
    if (a > b) return 1
    return 0
  }
// [1, 4, 3, 6].sort(arraySorter()); //?
// ['as', 'dc', 'ce', ' as'].sort(arraySorter(false)); //?
// [new Date('2020-01-01'), new Date('2021-01-05')].sort(arraySorter(true)); //?


function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function sleepWithValue(ms, value) {
  return new Promise(resolve =>
    setTimeout(() => resolve(value), ms)
  )
}

function sleepWithFunction(ms, func, ...params) {
  return new Promise(resolve =>
    setTimeout(() => resolve(func(...params)), ms)
  )
}

async function retryWithSleep(times, updateSleepTimeFun, funToRun, funToRunParams, shouldStopRetrying) {
  let result
  let currentSleepTime = 0

  for (let index = 0; index < times; index++) {
    if (index > 0) await sleep(currentSleepTime)

    try {
      result = await funToRun(...funToRunParams)
    } catch (e) {
      if (index === times - 1) throw e
      result = e
    }

    if (shouldStopRetrying === undefined && ((result instanceof Error) === false)) {
      return result
    }

    try {
      if (shouldStopRetrying?.(result) === true) return result
    } catch (e) {
      console.log('Called to shouldStopFun failed with params: ', { currentSleepTime, index })
      console.log('Throwing exception...')
      throw e
    }

    const extractError = result?.message ?? result?.error ?? result?.code ?? result?.status ?? result?.status ?? result?.name
    console.log(`Iteration: ${index + 1} sleepTime: ${currentSleepTime} Error: ${extractError}`)

    try {
      currentSleepTime = updateSleepTimeFun(currentSleepTime, index)
    } catch (e) {
      console.log('Calling updateSleepTimeFun failed with params: ', { currentSleepTime, index })
      throw e
    }

  }

  return result

}
// retryWithSleep(
//   10, 
//   (_, index) => 300 + index*500, 
//   (input)=> Math.random() < 0.9 ? new Error('Error...'): {value:'OK',status:'Didnt failed'}, 
//   []
// )
//   .then(result => console.log(result))

// retryWithSleep(
//   10, 
//   (_, index) => 300 + index*500, 
//   (input)=> {input.total = input.total + Math.random(); return input}, 
//   [{total:0}],
//   (currentResult) => currentResult.total > 5? true: false
// )
//   .then(result => console.log(result))

const notTo = funct => (...params) => !funct(...params)

function pushUniqueKey(row, table, indexes = [0]) {

  const keyOfRowToInsert = key(row, indexes)

  if (
    table.find(rowTable => key(rowTable, indexes) === keyOfRowToInsert)
    ===
    undefined
  ) {
    table.push(row)
    return row
  }

  return undefined

  ////
  function key(row, indexes) {
    //if (Array.isArray(row) === false) return row
    if (typeof row !== 'object') return row

    return indexes.reduce((acum, current, index) => acum + `-${index}-` + row[current], '')
  }

}
// pushUniqueKey(
//   [2,3],
//   [[1,2],[2,3],[1,3]],
//   [0,1]
// ) //?
// pushUniqueKey(
//   [2,4],
//   [[1,2],[2,3],[1,3]],
//   [0,1]
// ) //?
// pushUniqueKey(
//   4,
//   [1,2],
// ) //?
// pushUniqueKey(
//   2,
//   [1,2],
// ) //?
// pushUniqueKey(
//   {a:2,b:4},
//   [{a:1,b:2},{a:2,b:5},{a:3,b:4}],
//   ['a','b']
// ) //?
// pushUniqueKey(
//   {a:2,b:4},
//   [{a:1,b:2},{a:2,b:4},{a:3,b:4}],
//   ['a','b']
// ) //?


function pushUniqueKeyOrChange(newRow, table, indexes = [0], mergeFun) {

  if (pushUniqueKey(newRow, table, indexes) === undefined) {

    const newRowKey = key(newRow, indexes)
    return table.map(
      (existingRow) => {
        if (newRowKey === key(existingRow, indexes)) return mergeFun(newRow, existingRow)

        return existingRow
      }
    )
  }

  return table

  ////
  function key(row, indexes) {
    //if (Array.isArray(row) === false) return row
    if (typeof row !== 'object') return row

    return indexes.reduce((acum, current, index) => acum + `-${index}-` + row[current], '')
  }

}
// pushUniqueKeyOrChange(
//   [1,3],
//   [[1,2],[2,3],[1,3]],
//   [0],
//   (newRow, existingRow) => [newRow[0] + existingRow[0], newRow[1] + existingRow[1]]
// ) //?

function pushAt(pos,value, arr){
  if(Array.isArray(arr) === false) throw new CustomError('PUSHAT_LAST_PARAMETER_MUST_BE_ARRAY')

  // if(pos >= arr.length) {
  //   arr[pos] = value 
  //   return arr
  // }

  const length = arr.length
  repeat(arr.length - pos).times( index => arr[length - index] =  arr[length - index - 1] )
  arr[pos] = value 
  return arr

}
// pushAt(0,2,[]) //?
// pushAt(0,2,[1,2,3]) //?
// pushAt(5,2,[1,2,3]) //?

function memoize() {
  const resultsMap = new Map()

  function memoizeMap(func, ...params) {
    let key = JSON.stringify(params)
    let result = resultsMap.get(key)

    if (result === undefined && resultsMap.has(key) === false) {
      result = func(...params)
      resultsMap.set(key, result)
    }

    return result
  }

  function memoizeWithHashFun(func, hashFunc, ...params) {
    let key = JSON.stringify(hashFunc(params))
    let result = resultsMap.get(key)

    if (result === undefined && resultsMap.has(key) === false) {
      result = func(...params)
      resultsMap.set(key, result)
    }

    return result
  }

  return { memoizeMap, memoizeWithHashFun }

}

// const plus = (a,b) => a+b
// const plusMem = memoize()
// plusMem(plus, 2,3) //?
// plusMem(plus, 2,3) //?
// plusMem(plus, 3,3) //?
//

function fillWith(mapper, lenOrWhileTruthFun) {
  let result = []

  let isWhileTruthFun =
    typeof lenOrWhileTruthFun === 'function'
      ? lenOrWhileTruthFun
      : (index) => index < lenOrWhileTruthFun

  let index = -1
  let isWhileTruth
  do {
    index++
    result[index] = mapper(index, result)
    isWhileTruth = isWhileTruthFun(index, result)
    if (!isWhileTruth) result.pop()
  } while (isWhileTruth)

  return result
}
// console.log(
//   fillWith(
//     (index) => index*2,
//     (index, result) => result[index] < 12
//   ) //?
// )

// console.log(
//   fillWith(
//     (index) => index*2,
//     12
//   ) //?
// )



// can be called with list of parameters or with array.
//console.log(replaceAll('I like red cars and red houses', {from:'red',to:'yellow'},{from:'e',to:'E'}))
//console.log(replaceAll('I like red cars and red houses', [{from:'red',to:'yellow'},{from:'e',to:'E'}]))
function replaceAll(str, ...fromTo) {
  if (fromTo[0][0].from !== undefined) fromTo = fromTo[0]

  return fromTo.reduce(
    (acum, current) =>
      acum.split(current.from).join(current.to)
    , str
  )
}

function cleanString(str) {
  return str.replace(/([^a-z0-9 .,]+)/gi, '').replace(/  */g, ' ').trim()
}
//cleanString('  Only let%ters,%% numbers 1,2,3 d@ot &*&an(((d co[mma. Text is trimmed   ')  ===  
//  'Only letters, numbers 1,2,3 dot and comma. Text is trimmed' //?

function repeat(numberOfTimes) {
  let toReturn = []
  function times(funToRepeat) {
    for (let index = 0; index < numberOfTimes; index++) {
      toReturn[index] = funToRepeat(index)
    }

    return toReturn
  }

  async function awaitTimes(funToRepeat) {
    for (let index = 0; index < numberOfTimes; index++) {
      toReturn[index] = await funToRepeat(index)
    }

    return toReturn
  }

  function value(value) {
    return Array(numberOfTimes).fill(value)
  }

  return { times, awaitTimes, value }
}
// repeat(8).times((index) => {
//   console.log(index)
// })

// repeat(8).value(0) //?

function runEvery(period) {

  let count = 0

  function calls(runFunc) {

    function toExecute(...args) {
      count++
      if (count === period) {
        count = 0
        return runFunc(...args)
      }
    }

    toExecute.reset = () => count = 0

    return toExecute
  }

  return { calls }
}

// let myRunEvery = runEvery(3).calls((txt1, txt2, txt3)=>{console.log(txt1, txt2, txt3);return 3})
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery.reset()
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?



function* loopIndexGenerator(initValue, iterations) {
  let count = 0

  while (true) {
    yield initValue + count % iterations
    count++
  }
}
// let cycles = loopIndexGenerator(2, 3)
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?


function processExit(error) {
  console.log(`Shutting down with error: ${error}`);
  try {
    process.exit(1)
  }catch(e)
  {
    console.log(e)
  }
}

const jsUtils = {
  logWithPrefix,
  firstCapital,
  varSubsDoubleBracket,
  queryObjToStr,
  CustomError,
  urlCompose,
  urlDecompose,
  indexOfNthMatch,
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus,
  findDeepKey,
  deepFreeze,
  getValueAtPath,
  setValueAtPath,
  sorterByPaths,
  filterFlatMap,
  arraySorter,
  isPromise,
  sleep,
  sleepWithValue,
  sleepWithFunction,
  notTo,
  arrayToObject,
  arrayOfObjectsToObject,
  removeDuplicates,
  traverse,
  traverseVertically,
  copyPropsWithValue,
  copyPropsWithValueUsingRules,
  EnumMap,
  Enum,
  transition,
  pushUniqueKey,
  pushUniqueKeyOrChange,
  pushAt,
  memoize,
  fillWith,
  isDate,
  isEmpty,
  isStringADate,
  formatDate,
  dateFormatter,
  YYYY_MM_DD_hh_mm_ss_ToUtcDate,
  dateToObj,
  diffInDaysYYYY_MM_DD,
  subtractDays,
  previousDayOfWeek,
  getSameDateOrPreviousFridayForWeekends,
  replaceAll,
  cleanString,
  repeat,
  runEvery,
  loopIndexGenerator,
  retryWithSleep,
  processExit
}

export default jsUtils
export {
  logWithPrefix,
  firstCapital,
  varSubsDoubleBracket,
  queryObjToStr,
  CustomError,
  urlCompose,
  urlDecompose,
  indexOfNthMatch,
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus,
  findDeepKey,
  deepFreeze,
  getValueAtPath,
  setValueAtPath,
  sorterByPaths,
  filterFlatMap,
  arraySorter,
  isPromise,
  sleep,
  sleepWithValue,
  sleepWithFunction,
  notTo,
  arrayToObject,
  arrayOfObjectsToObject,
  removeDuplicates,
  traverse,
  traverseVertically,
  copyPropsWithValue,
  copyPropsWithValueUsingRules,
  EnumMap,
  Enum,
  transition,
  pushUniqueKey,
  pushUniqueKeyOrChange,
  pushAt,
  memoize,
  fillWith,
  isDate,
  isEmpty,
  isStringADate,
  formatDate,
  dateFormatter,
  YYYY_MM_DD_hh_mm_ss_ToUtcDate,
  dateToObj,
  diffInDaysYYYY_MM_DD,
  subtractDays,
  previousDayOfWeek,
  getSameDateOrPreviousFridayForWeekends,
  replaceAll,
  cleanString,
  repeat,
  runEvery,
  loopIndexGenerator,
  retryWithSleep,
  processExit
}