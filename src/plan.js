import { resolve } from 'fluture'
import {  R, pipe, pipeWhile, runFunctionsSyncOrParallel } from './ramdaExt.js'
import _ from 'lodash'
import { repeat, traverse } from './jsUtils.js'


const convertPathToStackPath = 
  path => 
    path.map(
      (el, index) => {
        if( index === 0 ) return 0

        return parseInt(el,10)
      }
    )

function generateStack(plan)
{
  let stack = []

  const reviver = 
    (nodeRef, currentPath, parent) => {
     if(typeof nodeRef === 'function')
        stack.push({value: nodeRef, path:  convertPathToStackPath(currentPath)})
    
      return undefined
    }

  traverse(
    plan,
    reviver,
  )

  stack.push({value:R.identity, path:[1]})

  return stack
}

        
const isAncestorOf = 
  son => 
    parent => 
      son?.length > parent?.length && _.isEqual(parent, son.slice(0, parent.length))


const isSiblingOf = 
  sibling1 => 
    sibling2 => 
      _.isEqual(
        sibling1?.slice(0,-1),
        sibling2?.slice(0,-1)
      )


function hasAnyDescendant(stack)
{ 
  return path => 
    stack.some(
      el => 
        path.length < el.path.length &&
        _.isEqual(
          el.path.slice(0, path.length),
          path
        )
    )
}

function getDescendants(stack)
{ 
  return path => 
    stack.filter(
      el => 
        path.length < el.path.length &&
        _.isEqual(
          el.path.slice(0, path.length),
          path
        )
    )
}
      
const stackSiblingsReducer = 
  (acum, el, index) => {
    if(
      isSiblingOf(R.last(acum)?.path)(el.path)
    ) 
    { 
      acum[acum.length - 1].value = pipe(R.last(acum).value, el.value)
    }else
    {
      acum.push(el)
    }

    return acum
  }

function acumSiblings(stack)
{
  return stack.reduce( 
    stackSiblingsReducer,
    []
  )
}

const stackParallelReducer = function(numberOfThreads){
  let accruingParallel = false
  let funsToParallelize = []

  return (acum, el, index, stack) => {
    const elParent = el.path.slice(0,-1)
    const nextElParent = stack[index+1]?.path?.slice(0,-1)

    let isElToAccrue = 
      _.isEqual(elParent?.slice(0,-1), nextElParent?.slice(0, -1)) && 
      R.last(elParent) + 1 === R.last(nextElParent) &&
      // el is the only child of parent
      _.isEqual(getDescendants(stack)(elParent), [el])

    if(isElToAccrue)
    {
      accruingParallel = true
      funsToParallelize.push(el.value)
    }
    
    if(isElToAccrue === false && accruingParallel === true) {
      funsToParallelize.push(el.value)
      acum.push(
        {
          value: runFunctionsSyncOrParallel(numberOfThreads)(funsToParallelize),
          path: el.path.slice(0,-1)
        }
      )
    }
    
    if(isElToAccrue === false &&  accruingParallel === false)
    {
      acum.push(el)
    }

    if(isElToAccrue === false)
    {
      accruingParallel = false
      funsToParallelize = []
    }

    return acum
  }
}

const acumParallel = numberOfThreads => stack =>
{
  return stack.reduce( 
    stackParallelReducer(numberOfThreads),
    []
  )
}


const reduceNesting = (stack)=> 
{
  let biggerLengthIndex
  let biggerLengthValue = -1

  repeat(stack.length).times(
    index => {
      if(stack[index]?.path?.length > stack[index+1]?.path?.length)
      {
        if(biggerLengthValue < stack[index]?.path?.length)
        {
          biggerLengthValue = stack[index]?.path?.length
          biggerLengthIndex = index
        }
      }
    }
  )

  let newStack = stack

  if(biggerLengthIndex !== undefined)
  {
    newStack = [...stack]
    newStack[biggerLengthIndex] =         
      {
        value: newStack[biggerLengthIndex].value,
        path: newStack[biggerLengthIndex].path.slice(0,-1)
      }
  }

  return newStack
}


const extractFinalValue = x => x[0]?.value ?? x?.value


const lengthStackPrevLessThanCurr = function ()
{
  let prevStack
  
  return [
    function funCond(stack) {
      const result = (stack?.length < prevStack?.length) || prevStack === undefined
      prevStack = stack
      return result
    },
    function ini(){
      prevStack = undefined
    }
  ]
}

function changeFunWithMockupsObj(mockupsObj)
{
  return stack => {
    if (!mockupsObj) return stack

    return stack.map(
      ({path, value}) => {
        if(mockupsObj?.[value.name] !== undefined)
        {
          if(typeof mockupsObj[value.name] === 'function') {
            return {
              value:mockupsObj[value.name],
              path
            }
          }

          return {
            value: () =>  mockupsObj[value.name],
            path
          }      
        }

        return {value:value, path}
      }
    )
  }
}

function plan(plan, {numberOfThreads, mockupsObj} = {numberOfThreads: Infinity, mockupsObj: {}})
{

  return pipe(
    generateStack,
    changeFunWithMockupsObj(mockupsObj),
    pipeWhile(stack => stack.length > 1)(
      pipeWhile(...lengthStackPrevLessThanCurr())
      (
        acumSiblings,
        acumParallel(numberOfThreads),
      ),
      reduceNesting,
    ),
    extractFinalValue,
  )(plan)
}



export { plan }