'use strict'
import clone from 'just-clone'
import jsUtils from './jsUtils.js'


function cloneCopy(to, from, firstCleanTo, shallow) {


  if (firstCleanTo) {
    Object.setPrototypeOf(to, Object.getPrototypeOf(from))

    for (let prop in to) {
      if (to.hasOwnProperty(prop)) {
        delete to[prop]
      }
    }
  }


  if (shallow) {
    for (let prop in from) {
      if (from.hasOwnProperty(prop)) {
        to[prop] = from[prop]
      }
    }
  } else {
    for (let prop in from) {
      if (from.hasOwnProperty(prop)) {
        to[prop] = clone(from[prop]) //, reviverPromiseForCloneDeep)
      }
    }
  }

  return to
}

function wildcardToRegExp(pathSearch, flagsString, separator = '.',matchFromStart = true, matchToEnd = true) {

  let escSeparator = escapeRegExp(separator)

  let result = pathSearch.split(separator).join(`${escSeparator}`)
  result = result.split('*').join(`[^${escSeparator}]*`)
  result = result.split(`[^${escSeparator}]*[^${escSeparator}]*`).join('.*')
  result = `${matchFromStart?'^':''}${result}${matchToEnd?'$':''}`
  let regExToReturn = new RegExp(result, flagsString)

  return regExToReturn
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


function promiseAll(obj) {
  let objRoot = { root: obj }

  let toReturn = promiseAllRec(objRoot)

  if (jsUtils.isPromise(toReturn) === false) {
    toReturn = Promise.resolve(toReturn)
  }

  return toReturn.then(objRoot => objRoot.root)

  function promiseAllRec(objRoot) {
    const arrayOfPromises = []
    const arrayOfRefToPromises = []

    jsUtils.traverse(objRoot, (ref, _undefined, parent, son) => {
      if (jsUtils.isPromise(ref)) {
        arrayOfPromises.push(ref)
        arrayOfRefToPromises.push({ parent, son })
      }
    }, false)

    if (arrayOfPromises.length > 0) {
      return Promise.all(arrayOfPromises)
        .then((arrayOfResolutions) => {
          arrayOfResolutions.map((resolution, index) => {
            arrayOfRefToPromises[index].parent[arrayOfRefToPromises[index].son] = resolution
          })
          return promiseAllRec(objRoot)
        })
    } else return objRoot
  }

}

export { cloneCopy, wildcardToRegExp, promiseAll }