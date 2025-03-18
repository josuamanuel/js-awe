import clone from 'just-clone'
import { JSONPath } from 'jsonpath-plus'
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { relative } from 'path'


const logWithPrefix = (title, displayFunc) => (message) => {

  let finalMessage = message

  if (typeof displayFunc === 'function') {

    finalMessage = displayFunc(message)
  }

  console.log(`${title}: ${finalMessage}`)

  return message
}

let processCwd
function transformStackTraceLine(line) {
  const processCwd = process.cwd();
  
  let starPathPos = line.indexOf('(file://','')
  if(starPathPos === -1) starPathPos = line.indexOf('file://','')
  if(starPathPos === -1) starPathPos = line.indexOf('(','')
  if(starPathPos === -1) return line

  const cleanLine = line
    .replace('(file://','')
    .replace('file://','')
    .replace('(','')
    .replace(')','')

  const resultPositionMatch = cleanLine.match(/[0-9]+:[0-9]+/);
  if(resultPositionMatch === null) return line;
  const position = resultPositionMatch[0]

  const filePath = cleanLine.substring(starPathPos,  resultPositionMatch.index - 1)
  const relativePath = relative(processCwd, filePath)

  return `${line.substring(0, starPathPos - 1)} ${relativePath}:${position}`
}

function summarizeError(error, maxStackTraces = 5) {

  if(error instanceof Error === false) return 'Not an error object';

  const stackTraceLines = error.stack.split('\n');
  const filteredStackTrace = stackTraceLines
    .filter(line => !line.includes('node_modules') && !line.includes('node:internal'))
    .map(line => line.trim())
    .filter(line => line.startsWith('at'))
    .map(transformStackTraceLine);

  const condensedStackTrace = [];
  const totalTraces = filteredStackTrace.length;

  if (totalTraces > maxStackTraces) {
    condensedStackTrace.push(...filteredStackTrace.slice(0, maxStackTraces - 1));
    condensedStackTrace.push('...skipped...');
    condensedStackTrace.push(filteredStackTrace[totalTraces - 1]);
  } else {
    condensedStackTrace.push(...filteredStackTrace);
  }

  const condensedStackTraceString = condensedStackTrace.join(' -> ');

  const ErrorString = `${error.name}: ${error.message} ${error.cause?.message ? `[cause]: ${error.cause.message}` : ''}`

  return `${ErrorString}\nStack Trace: ${condensedStackTraceString}`;
}
// function a(){b()}
// function b(){c()}
// function c(){d()}
// function d(){e()}
// function e(){f()}
// function f(){g()}
// function g(){throw new Error('This is an error')}
// try{
//   a()
// }catch(e)
// {
//   console.log(e)
//   console.log(summarizeError(e))
// }

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

  summarizeError(error) {
    return summarizeError(error)
  }

  static of = CustomError
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

function createCustomErrorClass(errorName) {
  const errorClass = class extends CustomError {
    constructor(name, message, data) {
      super(name, message, data);
      this.name = errorName;
    }
  };

  return errorClass;
}

function isBasicType(variableToCheck) {
  const type = typeof variableToCheck
  return (
    type !== 'object' && type !== 'undefined' && type !== 'function'
  );
}

// isBasicType(null) //?
// isBasicType(undefined) //?
// isBasicType(new Map()) //?
// isBasicType({}) //?
// isBasicType(Symbol()) //?
// isBasicType('22') //?
// isBasicType(Number(2)) //?


class Enum {

  constructor(values, rules) {
    // It will contain the active key for example 'OFF'. Once initialized activeObjectKey[activeKey] should be always equal to true
    let activeKey

    let stateRules

    if (Array.isArray(values) === false) throw new CustomError('NOT_AN_ARRAY', 'Only Array composed of non objects are permitted')
    if (values.filter((elem) => elem === 'object').length > 0) throw new CustomError('ARRAY_VALUES_MUST_BE_OF_BASIC_TYPE', 'Only basic types are allowed')

    const valuesNotAllowed = values.filter(elem => elem === 'get' || elem === 'set' || elem === 'getValue')

    if (valuesNotAllowed.length > 0) {
      throw new CustomError('ENUM_INVALID_ENUM_VALUE', `The following ENUM value/s are not allowed: ${valuesNotAllowed} as they are reserved words for enum`)
    }

    const valuesWithoutDuplicates = removeDuplicates(values)
    // activeObjectKey will be an object with keys from values array and only one current key active: {ON:false,OFF:true}
    const activeObjectKey = arrayToObject(valuesWithoutDuplicates, function defaultValue() { return false })
    activeKey = values[0]
    activeObjectKey[activeKey] = true

    if (rules !== undefined) setupRules(rules)

    this.get = get
    this.set = set
    this.getValue = getValue

    // biome-ignore lint/correctness/noConstructorReturn: <explanation>
    return new Proxy(activeObjectKey, this)

    ///

    function setupRules(rules) {
      if (rules === null || typeof rules !== 'object' || Array.isArray(rules) === true) {
        throw new CustomError('ENUM_RULES_BAD_FORMAT', `rules is not an object: ${rules}`)
      }

      for (const elem in rules) {
        if (activeObjectKey[elem] === undefined || Array.isArray(rules[elem]) === false) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', `Each attribute of rules must be an element in the ENUM and its value should be an array: ${activeObjectKey[elem]}${rules[elem]}`)
        }

        const valuesWithProblems = rules[elem].filter(itemTo => activeObjectKey[itemTo] === undefined)

        if (valuesWithProblems.length > 0) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', `All elements in a rule entry must be one of the list values in the ENUM. The following values dont exist: ${valuesWithProblems}`)
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

    const objLiteral = this.#validateAndTransform(clone(values))
    // biome-ignore lint/correctness/noConstructorReturn: <explanation>
    return new Proxy(objLiteral, this)
  }

  #validateAndTransform(values) {

    if (values === undefined || values === null) throw new Error('Null or undefined is not permitted to construct a EnumMap instance.')

    const valuesProtoName = Object.getPrototypeOf(values).constructor.name

    if (valuesProtoName === 'Map') {
      return Object.fromEntries(values)
    }

    if (valuesProtoName === 'Object') {
      return values
    }

    let typeOfValue
    const objectResult = []

    if (valuesProtoName === 'Array') {
      for (let i = 0; i < values.length; i++) {
        // basicTypes: ['SUNDAY', 'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
        if (isBasicType(values[i])) {
          objectResult[values[i]] = i
          if (typeOfValue !== undefined && typeOfValue !== 'basicType')
            throw new CustomError('ENUMMAP_VALUES_NOT_VALID', 'EnumMap values should be consistent...')

          typeOfValue = 'basicType'
        }

        // elements are [key, value]: [['SUNDAY',1],['MONDAY',5], ['TUESDAY',2],['WEDNESDAY',3],['THURSDAY',9],['FRIDAY',6],['SATURDAY',4]]
        if (Array.isArray(values[i]) && values[i].length === 2) {
          objectResult[values[i][0]] = values[i][1]
          if (typeOfValue !== undefined && typeOfValue !== 'array')
            throw new CustomError('ENUMMAP_VALUES_NOT_VALID', 'EnumMap values should be consistent...')

          typeOfValue = 'array'
        }

        // elements are object with {key:value} [{SUNDAY:1},{MONDAY:5}, {TUESDAY:2},{WEDNESDAY:3},{THURSDAY:9},{FRIDAY:6},{SATURDAY:4}]
        if (values[i] !== null && typeof values[i] === 'object' && Object.keys(values[i]).length === 1) {

          const key = Object.keys(values[i])[0]

          objectResult[key] = values[i][key]
          if (typeOfValue !== undefined && typeOfValue !== 'object')
            throw new CustomError('ENUMMAP_VALUES_NOT_VALID', 'EnumMap values should be consistent...')

          typeOfValue = 'object'
        }

      }

      if (typeOfValue === undefined) {
        throw new CustomError('ENUM_VALUES_NOT_VALID', 'Values must be an array of strings, an array of arrays, an array of objects or an array of maps')
      }
    }

    return objectResult
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
    const invertedValues = {}

    for (const elem in this) {
      // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
      if (this.hasOwnProperty(elem)) {
        if (isBasicType(this[elem]) === false) throw new CustomError('INVERT_VALUES_NOT_BASIC_TYPE', 'EnumMap values should be basic types')
        invertedValues[this[elem]] = elem
      }
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


function transition(states, events, transitions) {
  states.forEach(validateStateFormat)
  events.forEach(validateEventFormat)

  let state = states[0]
  const finalTransitions = Object.entries(transitions).reduce(
    (acum, [stateKey, stateValue]) => {
      // validations
      validateState(stateKey)

      let newStateValue = stateValue
      if (typeof stateValue === 'string') {
        validateState(stateValue)

        newStateValue = events.reduce(
          (acum, current) => {
            acum[current] = stateValue
            return acum
          },
          {}
        )
      } else {
        for (const [key, value] of Object.entries(newStateValue)) {
          validateEvent(key)
          validateState(value)
        }
      }



      acum[stateKey] = { ...acum[stateKey], ...newStateValue }
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
    state = finalTransitions[state][event]
    return state
  }

  sendEvent.valueOf = () => state

  return sendEvent

  function validateStateFormat(state) {
    if (state !== state.toUpperCase())
      throw new CustomError('STATE_MUST_BE_UPPERCASE', `The state: ${state} does not have all characters in uppercase`)
  }

  function validateState(state) {
    if (states.some(el => el === state) === false)
      throw new CustomError('STATE_NOT_FOUND', `The state: ${state} was not found in the list of states supplied: ${states}`)
  }


  function validateEventFormat(event) {
    if (event !== event.toLowerCase())
      throw new CustomError('EVENT_MUST_BE_LOWERCASE', `The event: ${event} does not have all characters in lowercase`)
  }


  function validateEvent(event) {
    if (events.some(el => el === event) === false)
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
    const acum = {}
    for (const elem of iterable) {
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
// reviver({c:3}, ['a','b'], {b:{c:3}}, 'b') currentPath=['$', 'parent', 'son', '0', 'jose']
// reviver return value will impact traverse: 
//  undefined: do nothing.
//  Any value: assign this value (parent[key])
//  traverse.stop: stop inmediatly traverse
//  traverse.skip: skip node. It doesnt look at children of node.
//  prune: if true remove node.


function traverse(objIni, reviver, pureFunction = true) {
  const currentPath = ['$']

  const objClone = pureFunction ? clone(objIni, reviverPromiseForCloneDeep) : objIni

  let exitVar = false
  const objForReviver = {}
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  objForReviver['$'] = objClone

  const isSkipNodeOnce = reviverProcess(reviver, objForReviver, '$', currentPath)

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  if (objClone !== objForReviver['$']) return objForReviver['$']

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  if (exitVar === true) return objForReviver['$']

  if (isSkipNodeOnce === false) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    traverseRec(objForReviver['$'])
  }

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  return objForReviver['$']

  function traverseRec(obj) {

    if (obj && obj instanceof Object && exitVar === false) {
      for (const prop in obj) {

        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (obj.hasOwnProperty(prop)) {
          currentPath.push(prop)

          const isSkipNodeOnce = reviverProcess(reviver, obj, prop, currentPath)

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

        // to avoid infinite loops of reviver. reviver example: changing a string for an object having a string.
        // (node)=>{if(typeof node === 'string') return {name:node}}
        isSkipNodeOnce = true
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

traverse.matchPath = (pathStringQuery, reviverPath) => {

  const pathStringArr = pathStringQuery.split('.')

  if (pathStringArr.length !== reviverPath.length) {
    return false;
  }

  return pathStringArr.every(
    (el, index) => el === '*' || el === reviverPath[index]
  )
}

function traverseVertically(functionToRun, verFields, toTraverse) {
  if (Array.isArray(toTraverse) === false) return

  let runIndex = 0
  let maxLength = 0
  let firstTime = true
  for (let i = 0; firstTime || i < maxLength; i++) {
    const toReturn = []
    for (let j = 0; j < toTraverse.length; j++) {
      toReturn[j] = { ...toTraverse[j] }
      for (const field of verFields) {
        if (firstTime) {
          maxLength = toTraverse[j]?.[field]?.length > maxLength
            ? toTraverse[j][field].length
            : maxLength
        }
        toReturn[j][field] = toTraverse[j]?.[field]?.[i]
      }
    }
    if (maxLength !== 0) {
      functionToRun(toReturn, runIndex)
      runIndex++
    }
    firstTime = false
  }
}


function project(paths, json, removeWithDelete = true) {
  const toDelete = Symbol()
  let copy
  if (json === null || json === undefined) return json
  if (Array.isArray(json)) copy = []
  else if (Object.getPrototypeOf(json) === Object.prototype) copy = {}
  else if (Array.isArray(paths) === false) throw new Error('paths must be an array')
  else if (paths.filter(el => el === '+$').length - paths.filter(el => el === '-$').length > 0) return json
  else return undefined

  for (const pathWithSign of paths) {
    if (pathWithSign[0] !== '+' && pathWithSign[0] !== '-') {
      throw new Error('ivanlid format')
    }
    const isInclude = pathWithSign[0] === '+'
    const path = pathWithSign.substring(1)

    const result = JSONPath({ resultType: 'all', path, json })

    const pendingToFilter = new Map()

    for (const { pointer, value } of result) {
      const setAtPath = pointer.substring(1).split('/')

      if (setAtPath.length === 1 && setAtPath[0] === '') copy = isInclude ? clone(value) : undefined
      else {
        if (removeWithDelete === true && isInclude === false) {
          const parentPath = setAtPath.slice(0, -1)
          const parent = getAt(copy, parentPath)

          if (Array.isArray(parent) === true) {
            // Arrays are stored in a map to be reviewed later to filter out the items mark for deletion.
            pendingToFilter.set(parentPath.join('/'), parent)
            // mark element for deletion
            setAt(copy, setAtPath, toDelete)
          } else {
            const fieldToDelete = setAtPath[setAtPath.length - 1]
            delete parent[fieldToDelete]
            setAt(copy, parentPath, parent)
          }

        } else
          setAt(copy, setAtPath, isInclude ? clone(value) : undefined)
      }
    }

    for (const [parentPath, parent] of pendingToFilter) {
      const compactingDeleteItems = parent.filter(el => el !== toDelete)
      setAt(copy, parentPath.split('/'), compactingDeleteItems)
    }

  }

  return copy
}
// {
//   const users = [
//     {
//       name: 'Jose',
//       age: 47,
//       salary: 52000,
//       posts: [
//         { id: 1, message: 'test', likes: 2 },
//         { id: 2, message: 'test1', likes: 2 },
//         { id: 3, message: 'test2', likes: 2 },
//       ],
//     },
//     {
//       name: 'Luchi',
//       age: 49,
//       salary: 52000,
//       twoLevels: {a:3},
//       posts: [
//         { id: 1, message: 'testL', likes: 2 },
//         { id: 2, message: 'testL1', likes: 2 },
//         { id: 3, message: 'testL2', likes: 2 },
//       ],
//     },
//   ]

//   const pathToSelect = ['+$', '-$[*].age', '-$[*].twoLevels.a', '-$[*].posts[:-1]'] //, '-$[*].age'];

//   console.log(
//     JSON.stringify(project(pathToSelect, users),undefined,2),
//     JSON.stringify(project(['+$[*].posts[0,2]', '-$[*].posts[1]'], users),undefined, 2),
//     JSON.stringify(project(['+$.a.b','-$.a.b.d'], {a:{b:{c:3,d:5,e:9}}}),undefined,2),
//     JSON.stringify(project(['+$'], 2),undefined,2)
//   )
// }

function copyPropsWithValueUsingRules(objDest, copyRules, shouldUpdateOnlyEmptyFields = false) {

  return (inputObj) => {
    copyRules.map(
      (rule) => {
        let from
        let to
        if (typeof rule === 'object') {
          from = rule.from
          to = rule.to
        } else {
          from = rule
          to = rule
        }

        let valueToCopy = getAt(inputObj, from)

        if (typeof rule.transform === 'function') {
          valueToCopy = rule.transform(valueToCopy)
        }

        if (valueToCopy === undefined || valueToCopy === null) return

        if (shouldUpdateOnlyEmptyFields === true && isEmpty(getAt(objDest, to)))
          setAt(objDest, to, valueToCopy)

        if (shouldUpdateOnlyEmptyFields === false)
          setAt(objDest, to, valueToCopy)

      }
    )

    return objDest
  }
}
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}},l:5}
//   copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d'}])(objFrom)
//   objTo
// }
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}, l:5}
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
// {
//   let objTo = {a:{b:2},c:12}
//   let objFrom = {a:{b:4},g:"2228",d:{e:{f:12}}, l:5}
//   copyPropsWithValueUsingRules(objTo, 
//     [
//       {from:'g', to:'e', transform: parseInt},
//       {from:'d.e.f', to:'d.f'},
//       {from:'d.e.g', to:'d.g'}
//     ],
//     true
//   )(objFrom)
//   objTo
// }

function copyPropsWithValue(objDest, shouldUpdateOnlyEmptyFields = false) {
  return (inputObj) => {
    traverse(inputObj, (nodeValue, currentPath) => {

      if (isALeaf(nodeValue) === false) return

      if (nodeValue === undefined || nodeValue === null || currentPath.length === 1) return

      const destPath = currentPath.slice(1 - currentPath.length)

      if (shouldUpdateOnlyEmptyFields === true) {
        const valueAtDest = getAt(objDest, destPath)
        if (isEmpty(valueAtDest)) setAt(objDest, destPath, nodeValue)

        return
      }

      setAt(objDest, destPath, nodeValue) //?

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
    (node?.constructor.name === 'Array' && node.length > 0)

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
    value === 0n ||
    Number.isNaN(value) ||
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
    const newAcum = acum ? `${acum}&` : acum
    return `${newAcum}${current}=${query[current]}`
  }, '')
}

function varSubsDoubleBracket(strToResolveVars, state, mode) {
  if (typeof strToResolveVars !== 'string') {
    return strToResolveVars
  }

  // regex to deal with the case the entire value is a substitution group
  // let regexVar = /"{{(.*?)(?:=(.*?))?}}"/g
  // ask ChatGPT to do a more performant regex without look ahead
  const regexVar = /"{{([^=}]+)(?:=([^}]+))?}}"/g

  const resultStr = strToResolveVars.replace(
    regexVar,
    (_notused, group1, group2) => {
      if (state && state[group1] !== undefined) {
        if (typeof state[group1] === 'string') return `"${state[group1]}"`
        if (typeof state[group1] === 'object') {
          if (mode === 'url' && Array.isArray(state[group1]))
            return arrayToListQuery(state[group1])

          if (mode === 'url' && !Array.isArray(state[group1]))
            return objToQueryParams(state[group1])

          if (!mode)
            return JSON.stringify(state[group1])
        }
      
        return state[group1]
      }
      if (group2 === undefined) return null
      //else if(group2.substring(0,2) === '\\"' && group2.substring([group2.length -1],2) === '\\"') return ('"' + group2 + '"')
      return group2.replace(/\\"/g, '"')
    }
  )

  // regex to do partial substitution of a group inside of a string value
  // let regexVarPartial = /{{(.*?)(?:=(.*?))?}}/g
  // ask ChatGPT to do a more performant regex without look ahead
  const regexVarPartial = /{{([^=}]+)(?:=([^}]+))?}}/g


  const resultStrFinal = resultStr.replace(
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

        return group2.replace(/\\"/g, '')
      }
    }
  )

  return resultStrFinal
}
// varSubsDoubleBracket(`
// {
//   "response": {
//     "id": 1231,
//     "description": "{{description=\"This is a test\"}}",
//     "slot": "{{slotNumber}}",
//     "active": "{{active=true}}",
//     "ratenumber": "{{rate=10}}"
//   }
// }`, {slotNumber:{a:3}, active:false}) //?

// varSubsDoubleBracket('https://bank.account?accounts={{accounts}}&c=3', {accounts:['10232-1232','2331-1233']},'url') //?
// varSubsDoubleBracket('https://bank.account?{{params=a=1&b=2}}&c=3', {params:{a:'10232-1232',b:'2331-1233'}},'url') //?
// varSubsDoubleBracket('https://bank.account?{{params=a=1&b=2}}&c=3', {},'url') //?

function arrayToListQuery(arr) {
  return arr.reduce((prev, curr) => `${prev},${curr}`)
}

function objToQueryParams(obj) {
  return Object.keys(obj)
    .reduce((acum, curr) => `${acum}${curr}=${obj[curr]}&`, '')
    .slice(0, -1)
}

function urlCompose(gatewayUrl, serviceName, servicePath) {
  return {
    gatewayUrl,
    serviceName,
    servicePath,
    url: `${gatewayUrl}${serviceName}${servicePath}`
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

function indexOfNthMatch(stringToInspect, toMatch, nth) {
  if (nth > 0 === false) return -1;
  let index = -1;
  for (let i = 0; i < nth; i++) {
    index = stringToInspect.indexOf(toMatch, index + 1);
  }
  return index;
}
// indexOfNthMatch('', '£', 0) //?
// indexOfNthMatch('£', '£', 3.12) //?
// indexOfNthMatch('£', '£', 1) //?
// indexOfNthMatch('It will not find', 'loop', 0) //?
// indexOfNthMatch('It will not find', 'loop', 1) //?
// indexOfNthMatch('a.b.c.d.e.f', '£', 3) //?
// indexOfNthMatch('a.b.c.d.e.f', '.', 3) //?
// indexOfNthMatch('a.b.c.d.e.f', '.', 2) //?
// indexOfNthMatch('a.b.c.d.e.f', '.', 1) //?


function toDate(date) {
  return date
    ? date instanceof Date
      ? date
      : new Date(date)
    : new Date()
}

function isDate(d) {
  return d instanceof Date && ! Number.isNaN(d);
}

function isStringADate(stringDate) {
  if (typeof stringDate !== 'string') return false

  return isDate(new Date(stringDate))
}

function dateFormatter(format) {
  return (date) => formatDate(format, date)
}

function formatDate(format, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return undefined


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

  const YYYY = dateIsoString.substring(0, 4)
  const YY = dateIsoString.substring(2, 4)
  const MM = dateIsoString.substring(5, 7)
  const DD = dateIsoString.substring(8, 10)
  const D = Number.parseInt(DD, 10).toString()
  const hh = dateIsoString.substring(11, 13)
  const h = Number.parseInt(hh, 10).toString()
  const mm = dateIsoString.substring(14, 16)
  const ss = dateIsoString.substring(17, 19)
  const mil = dateIsoString.substring(20, 23)
  const mi = dateIsoString.substring(20, 22)

  const month = indexMonths[MM]
  const dayOfWeek = indexDays[dateToProcess.getUTCDay()]

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
  const dateYYYY = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(0, 4))
  const dateMM = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(5, 7)) - 1 // Months start with 0
  const dateDD = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(8, 10))
  const datehh = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(11, 13))
  const datemm = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(14, 16))
  const datess = Number.parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(17, 19))

  return Date.UTC(dateYYYY, dateMM, dateDD, datehh, datemm, datess)
}

const DAYS = new EnumMap(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])
const MONTHS = new EnumMap(['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'])

function dateToObj(date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return undefined

  const ISODate = dateToProcess.toISOString()

  return {
    YYYY: Number.parseInt(ISODate.substring(0, 4)),
    MM: Number.parseInt(ISODate.substring(5, 7)),
    DD: Number.parseInt(ISODate.substring(8, 10)),
    hh: Number.parseInt(ISODate.substring(11, 13)),
    mm: Number.parseInt(ISODate.substring(14, 16)),
    ss: Number.parseInt(ISODate.substring(17, 19)),
    mil: Number.parseInt(ISODate.substring(20, 23))
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

function addDays(daysToAdd, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  // 864e5 is a valid JavaScript number that represents the number of milliseconds in a 24h
  return new Date(dateToProcess.valueOf() + 864E5 * daysToAdd)
}
// addDays(2, "2023-03-24").toISOString() //?
// addDays(3, "2023-03-24").toISOString() //?
// addDays(9, "2023-03-24").toISOString() //?

function subtractDays(daysToSubtract, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  return new Date(dateToProcess.valueOf() - 864E5 * daysToSubtract)
}
// subtractDays(2, "2023-03-26").toISOString() //?
// subtractDays(3, "2023-03-27").toISOString() //?
// subtractDays(9, "2023-04-02").toISOString() //?



function previousDayOfWeek(dayOfWeek, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  const diffInDaysOfWeek = dateToProcess.getUTCDay() - dayOfWeek

  const toSubtract = diffInDaysOfWeek >= 0
    ? diffInDaysOfWeek
    : 7 + diffInDaysOfWeek

  return subtractDays(toSubtract, dateToProcess)
}
//previousDayOfWeek(6,new Date('2021-05-07')) //?
//previousDayOfWeek(1,new Date('2021-03-25')) //?

function nextDayOfWeek(dayOfWeek, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  const diffInDaysOfWeek = dayOfWeek - dateToProcess.getUTCDay()

  diffInDaysOfWeek
  const toAdd = diffInDaysOfWeek >= 0
    ? diffInDaysOfWeek
    : 7 + diffInDaysOfWeek

  return addDays(toAdd, dateToProcess)
}
// nextDayOfWeek(0,new Date('2025-02-01')) //?
// nextDayOfWeek(1,new Date('2021-03-25')) //?


function dayOfWeek(dayOfWeek, date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  const diffInDaysOfWeek = 
    (dayOfWeek === 0 ? 7 : dayOfWeek) - 
    (dateToProcess.getUTCDay() === 0 ? 7 : dateToProcess.getUTCDay())

  diffInDaysOfWeek
  const toSubtract = diffInDaysOfWeek
  // diffInDaysOfWeek >= 0
  //   ? diffInDaysOfWeek
  //   : 7 + diffInDaysOfWeek

  return addDays(toSubtract, dateToProcess)
}
// dayOfWeek(0,new Date('2025-02-06')) //?
// dayOfWeek(6,new Date('2025-02-09')) //?

function getSameDateOrPreviousFridayForWeekends(date) {
  const dateToProcess = toDate(date)

  if (isDate(dateToProcess) === false) return dateToProcess

  const dayOfWeek = dateToProcess.getUTCDay()

  if (dayOfWeek > 0 && dayOfWeek < 6) return dateToProcess

  //Sunday
  if (dayOfWeek === 0) return subtractDays(2, dateToProcess)

  //Saturday (dayOfWeek === 6)
  return subtractDays(1, dateToProcess)
}
// getSameDateOrPreviousFridayForWeekends() //?
// //2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-15')).toISOString() //?
// ////2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-16')).toISOString() //?

function isDateMidnight(date) {
  return date?.toISOString?.()?.substring(10, 24) === 'T00:00:00.000Z'
}

function setDateToMidnight(date) {

  if (typeof date === 'string' && date.match(/\d{4}\D\d{2}\D\d{2}/)) return new Date(`${date.substring(0, 10)} UTC`)
  if (typeof date === 'string') return new Date(`${date} UTC`)
  
  const dateToProcess = (
    // biome-ignore lint/style/noArguments: <explanation>
    arguments.length === 0
      ? new Date()
      : new Date(date)
  )

  if ( Number.isNaN(+dateToProcess)) return dateToProcess

  if (isDateMidnight(dateToProcess)) return dateToProcess

  return new Date(`${dateToProcess.toISOString().substring(0, 10)} UTC`)
}

const {
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus
} = (() => {
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
    `${colors[color]}${message}${colors.reset}`

  const colorMessageByStatus = (_message, status) => {

    return (status >= 200) & (status < 300)
        ? colors.green
        : (status >= 300) & (status < 400)
          ? colors.cyan
          : (status >= 400) & (status < 500)
            ? colors.yellow
            : colors.red
  }

  const colorByStatus = status => {

    return (status >= 200) & (status < 300)
        ? colors.green
        : (status >= 300) & (status < 400)
          ? colors.cyan
          : (status >= 400) & (status < 500)
            ? colors.yellow
            : colors.red
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

      if (obj[prop] !== null && typeof obj[prop] === 'object') {
        currentPath.push(prop)
        traverse(obj[prop])
        currentPath.pop()
      }
    }
  }
  return result
}
// {
//   findDeepKey([{a:{astra:2}},{astra:5}], 'astra') //?
// }
function deepFreeze(o) {
  for (const prop of Object.getOwnPropertyNames(o)) {
    if (
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function')
    ) {
      deepFreeze(o[prop])
    }
  }

  Object.freeze(o)

  return o
}

function getAt(obj, valuePath) {
  if (obj === undefined || obj === null || valuePath === undefined || valuePath === null) {
    return
  }

  if (valuePath === '') return obj

  let result = obj

  const valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath

  for (const o of valuePathArray) {
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


// getAt(undefined, '') //?
// getAt(5, '') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'arr.$last.b') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?


function setAt(obj, valuePath, value) {
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
    throw { name: 'setAtParamsException', msg: `obj: ${obj}, valuePath: ${valuePath}, value: ${value}` }
  }

  try {
    valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath
    for (let i = 0, j = valuePathArray.length; i < j; i++) {

      const field = nameToIndex(result, valuePathArray[i])

      if (i === (valuePathArray.length - 1)) {
        if (result?.[valuePathArray[i]] !== undefined) {
          if (valueReturn !== CREATED) valueReturn = MODIFIED
        } else {
          if (valueReturn !== CREATED) valueReturn = ADDED
        }

        result[field] = value
      } else {
        if (typeof result[field] !== 'object') {
          if (Number.isNaN(Number(valuePathArray[i + 1]))) result[field] = {}
          else result[field] = []

          valueReturn = CREATED
        }

        result = result[field]
      }
    }
    if (valueReturn === FAILED) {
      throw { name: 'setAtException', msg: `obj: ${obj}, valuePath: ${valuePath}, value: ${value}` }
    }
  }
  catch (e) {
    console.log(`${e} Warning: There was an exception in setAt(obj, valuePath, value)... obj: ${obj} valuePath: ${valuePath} value: ${value}`)
    valueReturn = FAILED
    return valueReturn
  }
  return valueReturn

  function nameToIndex(obj, field) {
    if (Array.isArray(obj) && field === '$last') {
      return obj.length - 1
    }

    if (Array.isArray(obj) && field === '$push') {
      return obj.length
    }

    if (Array.isArray(obj) && Number.parseInt(field) < 0) {
      return obj.length + Number.parseInt(valuePathArray[i])
    }

    return field
  }
}
// {
  // let obj = {}
  // setAt(obj, 'a', '8') //?
  // obj //?
  // let obj2 = {a:3,b:{c:1}}
  // setAt(obj2, 'b', '8') //?
  // setAt(obj2, 'a.b', '8') //?
  // setAt(obj2, 'd.e', 'a') //?
  // obj2 //?
  // setAt(obj2, 'd.f', 'b') //?
  // setAt(obj2, 'd.e', 'aa') //?
  // setAt(obj2, 'e.g', 'c') //?
  // setAt(obj2, 'a.b.0.0.c', 'c') //?
  // obj2 //?
  // let obj3 = [1,2,3,4,5]
  // setAt(obj3,'-2',8) //?
  // obj3 //?
  // let obj4 = [1,2,3,4,5]
  // setAt(obj4,'$last',8) //?
  // obj4 //?
  // let obj5 = [1,2,3,4,5]
  // setAt(obj5,'$push',8) //?
  // obj5 //?
  // let obj6 = {
  //   items: [ 
  //     {}, 
  //     { ar: [1, 2] }
  //   ]
  // }
  // setAt(obj6,'items.$last.ar.$push',8) //?
  // obj6 //?
// }

const defaultValue = (value, defaultVal) => {
  if (value === undefined || value === null || Number.isNaN(value)) return defaultVal

  return value
}

const sorterByPaths = (paths, isAsc = true) => {
  let great = 1
  let less = -1
  let nullishValues = Number.POSITIVE_INFINITY // In ascending we put nullish values at the end

  if (isAsc === false) {
    great = -1
    less = 1
    nullishValues = Number.NEGATIVE_INFINITY // In descending we put nullish values at the beginning
  }

  let pathArr
  if (typeof paths === 'string') pathArr = [paths]
  else pathArr = [...paths]

  return (objA, objB) => {

    for (const currentPath of pathArr) {
      if (defaultValue(getAt(objA, currentPath), nullishValues) > defaultValue(getAt(objB, currentPath), nullishValues)) return great
      if (defaultValue(getAt(objA, currentPath), nullishValues) < defaultValue(getAt(objB, currentPath), nullishValues)) return less
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
//   [{a:3},{a:4},{a:undefined},{a:2},{a:1},{a:undefined},{a:0},{a:undefined}].sort(sorterByPaths(['a']))
// )


const sorterByFields = (paths, isAsc = true) => {
  let isAscArr = isAsc
  if (Array.isArray(isAsc) === false) {
    isAscArr = Array(paths.length).fill(isAsc)
  }

  let pathArr
  if (typeof paths === 'string') pathArr = [paths]
  else pathArr = [...paths]

  return (objA, objB) => {

    // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
    let great, less, nullishValues, currentPath
    for (let index = 0; index < pathArr.length; index++) {
      currentPath = pathArr[index]
      great = 1
      less = -1
      nullishValues = Number.POSITIVE_INFINITY // In ascending we put nullish values at the end

      if (isAscArr[index] === false) {
        great = -1
        less = 1
        nullishValues = Number.NEGATIVE_INFINITY // In descending we put nullish values at the beginning
      }

      if (defaultValue(getAt(objA, currentPath), nullishValues) > defaultValue(getAt(objB, currentPath), nullishValues)) return great
      if (defaultValue(getAt(objA, currentPath), nullishValues) < defaultValue(getAt(objB, currentPath), nullishValues)) return less
    }
    return 0
  }
}
// console.log(
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByFields('a.b')),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByFields('a.b', true)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByFields('a.b', false)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByFields(['a.b'], false)),
//   [{a:{b:3,c:2}}, {a:{b:3,c:1}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByFields(['a.b','a.c'], true)),
//   [{a:3},{a:4},{a:undefined},{a:2},{a:1},{a:undefined},{a:0},{a:undefined}].sort(sorterByFields(['a']))
// )

// [
//   {a:3,b:2},
//   {a:4,b:1},
//   {a:undefined,b:3},
//   {a:2,b:NaN},
//   {a:3,b:NaN},
//   {a:undefined,b:6},
//   {a:0,b:7},
//   {a:undefined,b:null}].sort(sorterByFields(['a','b'],[true,false])) //?

function findIndexInSortedArray(arr, item) {
  if(arr?.length === undefined || arr?.length === 0) return -1

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  let l = 0,
  r = arr.length - 1;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    const guess = arr[mid];

    if (guess > item) { 
      r = (mid - 1)
    } else if(guess < item) {
      l = mid + 1
    }else return mid;
  }

  return -1;
};
// findIndexInSortedArray([new Date('2025-01-31'), new Date('2025-02-03')], new Date('2025-02-05')) //?

function findIndexOrPreviousInSortedArray(arr, val) {

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    if (midVal < val) {
      left = mid + 1;
    } else if (midVal > val) {
      right = mid - 1;
    }else
      return mid;
  }

  return right
}
// findIndexOrPreviousInSortedArray([1,2], 0) //?

function findIndexOrNextInSortedArray(arr, val) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    if (midVal < val) {
      left = mid + 1;
    } else if (midVal > val){
      right = mid - 1;
    }else return mid;
  }

  if(left === arr.length) return -1
  return left;
}

function filterFlatMap(mapWithUndefinedFilterFun, data) {
  const result = []
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
  const clonedValue = clone(value)
  return new Promise(resolve =>
    setTimeout(() => resolve(clonedValue), ms)
  )
}

function sleepWithFunction(ms, func, ...params) {
  const clonedParams = clone(params)
  return new Promise(resolve =>
    setTimeout(() => resolve(func(...clonedParams)), ms)
  )
}

async function retryWithSleep(times, updateSleepTimeFun, funToRun, funToRunParams, shouldStopRetrying, logString) {
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
      console.log(`Called to shouldStopFun failed with params: ${currentSleepTime}, ${index}`)
      console.log(`Log from caller to retryFunction: ${logString}`)
      console.log('Throwing exception...')
      throw e
    }

    const extractError = result?.message ?? result?.error ?? result?.code ?? result?.status ?? result?.status ?? result?.name
    console.log(`Iteration: ${index + 1} sleepTime: ${currentSleepTime} Error: ${extractError}`)
    console.log(`Log from caller to retryFunction: ${logString}`)

    try {
      currentSleepTime = updateSleepTimeFun(currentSleepTime, index)
    } catch (e) {
      console.log(`Calling updateSleepTimeFun failed with params: ${currentSleepTime}, ${index}`)
      console.log(`Log from caller to retryFunction: ${logString}`)
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

    return indexes.reduce((acum, current, index) => `${acum}-${index}-${row[current]}`, '')
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


// biome-ignore lint/style/useDefaultParameterLast: <explanation>
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

    return indexes.reduce((acum, current, index) => `${acum}-${index}-${row[current]}`, '')
  }

}
// pushUniqueKeyOrChange(
//   [1,3],
//   [[1,2],[2,3],[1,3]],
//   [0],
//   (newRow, existingRow) => [newRow[0] + existingRow[0], newRow[1] + existingRow[1]]
// ) //?

function pushAt(pos, value, arr) {
  if (Array.isArray(arr) === false) throw new CustomError('PUSHAT_LAST_PARAMETER_MUST_BE_ARRAY')

  // if(pos >= arr.length) {
  //   arr[pos] = value 
  //   return arr
  // }

  const length = arr.length
  repeat(arr.length - pos).times(index => {
    arr[length - index] = arr[length - index - 1];
  });
  arr[pos] = value
  return arr

}
// pushAt(0,2,[]) //?
// pushAt(0,2,[1,2,3]) //?
// pushAt(5,2,[1,2,3]) //?

function memoize() {
  const resultsMap = new Map()

  function memoizeMap(func, ...params) {
    const key = JSON.stringify(params)
    let result = resultsMap.get(key)

    if (result === undefined && resultsMap.has(key) === false) {
      result = func(...params)
      resultsMap.set(key, result)
    }

    return result
  }

  function memoizeWithHashFun(func, hashFunc, ...params) {
    const key = JSON.stringify(hashFunc(params))
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
  const result = []

  const isWhileTruthFun =
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

function numberToFixedString(num, intLength, decLength) {
  return num.toFixed(decLength).padStart(intLength + decLength + 1, '0')

}
// console.log(
//   numberToFixedString(12.345, 5, 2) //?
// )

// can be called with list of parameters or with array.
//console.log(replaceAll('I like red flowers and red houses', {from:'red',to:'yellow'},{from:'e',to:'E'}))
//console.log(replaceAll('I like red flowers and red houses', [{from:'red',to:'yellow'},{from:'e',to:'E'}]))
function replaceAll(str, ...fromTo) {
  let simpleFrom = fromTo
  if (fromTo[0][0].from !== undefined) simpleFrom = fromTo[0]

  return simpleFrom.reduce(
    (acum, current) =>
      acum.split(current.from).join(current.to)
    , str
  )
}

function cleanString(str) {
  return str.replace(/([^a-z0-9 .,]+)/gi, '').replace(/ +/g, ' ').trim()
}
//cleanString('  Only let%ters,%% numbers 1,2,3 d@ot &*&an(((d co[mma. Text is trimmed   ')  ===  
//  'Only letters, numbers 1,2,3 dot and comma. Text is trimmed' //?

function repeat(numberOfTimes) {
  const toReturn = []
  let forceExit = false
  function times(funToRepeat) {
    for (let index = 0; index < numberOfTimes && forceExit === false; index++) {
      toReturn[index] = funToRepeat(index)
    }

    return toReturn
  }

  async function awaitTimes(funToRepeat) {
    for (let index = 0; index < numberOfTimes && forceExit === false; index++) {
      toReturn[index] = await funToRepeat(index)
    }

    return toReturn
  }

  function value(value) {
    return Array(numberOfTimes).fill(value)
  }

  function breakNextIteration() {
      forceExit = true
  }

  return { times, awaitTimes, value, breakNextIteration }
}
// const {breakNextIteration, times } = repeat(8)
// times((index) => {
//   if(index === 3) breakNextIteration()
//   console.log(index)
// })

// repeat(8).value(0) //?

function oneIn(period, callAtTheBeggining = true) {

  let countdown = callAtTheBeggining ? 0 : period - 1

  function call(runFunc) {

    function toExecute(...args) {
      if (countdown === 0) {
        countdown = period - 1
        return runFunc(...args)
      }
      countdown--;
    }

    toExecute.reset = (callAtTheBegginingParam = true) => {
      countdown = callAtTheBegginingParam ? 0 : period - 1
    }
    toExecute.stop = () => {
      countdown = Number.POSITIVE_INFINITY;
    }
    return toExecute
  }

  return { call }
}

// const myRunEvery = oneIn(3, false).call((txt1, txt2, txt3)=>{console.log(txt1, txt2, txt3);return 3})
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery.reset(true)
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery.stop()
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery.reset(true)
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
  } catch (e) {
    console.log(e)
  }
}

const jsUtils = {
  logWithPrefix,
  firstCapital,
  varSubsDoubleBracket,
  queryObjToStr,
  summarizeError,
  CustomError,
  createCustomErrorClass,
  isBasicType,
  urlCompose,
  urlDecompose,
  indexOfNthMatch,
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus,
  findDeepKey,
  deepFreeze,
  getAt,
  setAt,
  sorterByPaths,
  sorterByFields,
  findIndexInSortedArray,
  findIndexOrPreviousInSortedArray,
  findIndexOrNextInSortedArray,
  defaultValue,
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
  project,
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
  numberToFixedString,
  isDate,
  isEmpty,
  isStringADate,
  formatDate,
  DAYS,
  MONTHS,
  dateFormatter,
  YYYY_MM_DD_hh_mm_ss_ToUtcDate,
  dateToObj,
  diffInDaysYYYY_MM_DD,
  subtractDays,
  addDays,
  previousDayOfWeek,
  nextDayOfWeek,
  dayOfWeek,
  getSameDateOrPreviousFridayForWeekends,
  isDateMidnight,
  setDateToMidnight,
  replaceAll,
  cleanString,
  repeat,
  oneIn,
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
  summarizeError,
  CustomError,
  createCustomErrorClass,
  isBasicType,
  urlCompose,
  urlDecompose,
  indexOfNthMatch,
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus,
  findDeepKey,
  deepFreeze,
  getAt,
  setAt,
  sorterByPaths,
  sorterByFields,
  findIndexInSortedArray,
  findIndexOrPreviousInSortedArray,
  findIndexOrNextInSortedArray,
  defaultValue,
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
  project,
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
  numberToFixedString,
  isDate,
  isEmpty,
  isStringADate,
  formatDate,
  DAYS,
  MONTHS,
  dateFormatter,
  YYYY_MM_DD_hh_mm_ss_ToUtcDate,
  dateToObj,
  diffInDaysYYYY_MM_DD,
  subtractDays,
  addDays,
  previousDayOfWeek,
  nextDayOfWeek,
  dayOfWeek,
  getSameDateOrPreviousFridayForWeekends,
  isDateMidnight,
  setDateToMidnight,
  replaceAll,
  cleanString,
  repeat,
  oneIn,
  loopIndexGenerator,
  retryWithSleep,
  processExit
}