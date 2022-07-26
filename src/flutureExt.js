
import * as F from 'fluture'
import { fetchImproved } from './fetchImproved.js'

const { attemptP, Future } = F

const fletch = ({url, options} = {}) => attemptP(() => fetchImproved(url, options))

const promiseFunToFutureFun = (futurizePromFun) => (...input) => attemptP(() => futurizePromFun(...input))


/*
const {  pipe, fork } = F

const ffletch = ffletchMaker([
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  },
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  }
], 50) // Last paramater is the delay to resolve the promise.

ffletch({url: 'customerRef/F3456789'}).pipe(fork(console.log)(console.log))

*/

function ffletchMaker(fetchsDef, delay) {

  //[{input:{url},output:{status,body}]
  let urlToResponse = fetchsDef.reduce(
    (acum, {input, output}) => {
      acum[JSON.stringify(input)] = output
      return acum
    },
    {}
  )

  function ffletch(input) {

    const key = JSON.stringify(input)


    const ffletchResolution = (resolve, reject) => {
      if (urlToResponse[key] === undefined) {
        reject(new Error(`Fake Response not found for Request with key: ${key} in ${urlToResponse}`))
        return
      }
      if (urlToResponse[key].status >= 600) {
        reject(new Error(JSON.stringify(urlToResponse[key].body), null, 2))
        return
      }


      resolve({
        status: urlToResponse[key].status,
        body: urlToResponse[key].body,
      })

      return
    }

    return Future(
      (reject, resolve) => {
        setTimeout(
          () => ffletchResolution(resolve, reject),
          parseInt(delay, 10) || 0
        )

        return function onCancel () {
          // Clearing the timeout releases the resources we were holding.
          //clearTimeout (timeoutId)
        }

      }
    )


  }


  return ffletch
}

export { F, fletch, promiseFunToFutureFun, ffletchMaker }