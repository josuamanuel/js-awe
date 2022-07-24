
import _ from 'lodash'
import { anonymize } from './anonymize.js'
import { CustomError } from './jsUtils.js'
import { log } from './logLevelExtension.js'

const lengthSanitizer = (_, value) => '*length=' + value.length + '*'
const bearerSanitizer = (_, bearerToken) => bearerToken.substring(0, 7) + lengthSanitizer(undefined, bearerToken.substring(7))


const sanitizedGroups = {
  ibmApis: [
    { value: /^Bearer .*$/i, replacer: bearerSanitizer },
    { field: /^client_secret$/i, replacer: lengthSanitizer },
    { field: /^x-ibm-client-secret$/i, replacer: lengthSanitizer },
    { field: /.*token$/i, replacer: lengthSanitizer },
    { field: /^jwt$/i, replacer: lengthSanitizer },
    { field: /^authorization$/i, replacer: lengthSanitizer },
    { field: /^deviceId$/i, replacer: lengthSanitizer },
  ],

  pushNotification: [
    { field: /^body$/i, type: 'string', replacer: lengthSanitizer },
    { field: /^title$/i, replacer: lengthSanitizer },
    {
      sanitizer: (key, value) => {
        return key?.toLowerCase() === 'customer'
          ? 'F' + lengthSanitizer(undefined, value.substring(1))
          : value
      }
    }
  ]

}

function isRegExp(obj) {
  if (typeof obj === 'object' && obj.constructor.name === 'RegExp') return true

  return false
}

function validateDefinition(sanitizer) {

  const validateOneDef = elem => {

    let options = { rule: undefined, ops: 0, name: undefined }

    if (elem.sanitizer !== undefined) {
      options.ops = options.ops + 1
      options.rule = elem.sanitizer
      options.name = 'sanitizer'
    }

    if (elem.field !== undefined) {
      options.ops = options.ops + 2
      options.rule = elem.field
      options.name = 'field'
    }

    if (elem.value !== undefined) {
      options.ops = options.ops + 4
      options.rule = elem.value
      options.name = 'value'
    }

    if (options.name === undefined)
      throw new CustomError('SANITIZER_DEF_ERROR', 'Expected at least one filled property of: value, field or sanitizer.', elem)

    if (options.name === 'field' && typeof options.rule !== 'string' && isRegExp(options.rule) === false)
      throw new CustomError('SANITIZER_DEF_ERROR', 'field property must be of string type', elem)

    if (elem.type !== undefined && ['string', 'object', 'number', 'boolean'].indexOf(elem.type) === -1)
      throw new CustomError('SANITIZER_DEF_ERROR', 'type property must be of a valid type: string, object, number or boolean', elem)

    if (options.name === 'sanitizer' && typeof options.rule !== 'function')
      throw new CustomError('SANITIZER_DEF_ERROR', 'sanitizer property must be a function.', elem)

    if ([3, 5, 6, 7].indexOf(options.ops) !== -1)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `${options > 6 ? 3 : 2} properties informed and only one allowed between: sanitizer, value or field.`,
        elem
      )

    if (elem.replacer === undefined && elem.sanitizer === undefined)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `Replacer OR sanitizer property must be defined.`,
        elem
      )

    if (elem.replacer !== undefined && elem.sanitizer !== undefined)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `Replacer AND sanitizer cannot be used together`,
        elem
      )
  }

  sanitizer.forEach(validateOneDef)
}

function consolidateGroups(sanitizers) {
  return sanitizers.flatMap(
    sanitizer => {

      let toReturn
      if (typeof sanitizer === 'string') toReturn = sanitizedGroups[sanitizer]
      else toReturn = sanitizer

      validateDefinition(toReturn)
      return toReturn
    })
}

function sanitize(obj, sanitizers = ['ibmApis'], noSanitzedUptoLogLevel) {


  const indexLevel = log.levelNumber(noSanitzedUptoLogLevel)

  if (indexLevel !== undefined && log.getLevel() <= indexLevel) return obj;

  const allGroupsConsolidated = consolidateGroups(sanitizers)

  return _.cloneDeepWith(obj, customizer)

  function isToReplace(fieldOrValue, key, val, keyOrVal) {
    if (typeof fieldOrValue === 'function')
      return fieldOrValue(key, val)

    if (isRegExp(fieldOrValue) && typeof keyOrVal === 'string')
      return keyOrVal?.match(fieldOrValue)

    return _.isEqual(fieldOrValue, keyOrVal)
  }

  function toReplace(replacer, key, val) {
    if (typeof replacer === 'function') return replacer(key, val)
    else return replacer
  }

  function typeMet(value, type) {
    if (type === undefined || typeof value === type) return true
    else return false
  }

  function customizer(obj, parentKey, parentObj) {
    if (obj === null || obj === undefined || obj === {}) return undefined

    for (let { field, value, type, sanitizer, replacer } of allGroupsConsolidated) {
      if (typeMet(obj, type) === false) return undefined
      if (sanitizer !== undefined) return sanitizer(parentKey, obj)
      if (field !== undefined && isToReplace(field, parentKey, obj, parentKey)) return toReplace(replacer, parentKey, obj)
      if (value !== undefined && isToReplace(value, parentKey, obj, obj)) return toReplace(replacer, parentKey, obj)
    }

  }

}

export { sanitize, lengthSanitizer, bearerSanitizer, anonymize }
