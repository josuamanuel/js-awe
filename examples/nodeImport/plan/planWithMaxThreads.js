import { plan } from 'js-awe'

function processItems(items, process) {

  const processDealWithError = item => process(item).then(el => el).catch(error => error)
  const processes = items.map(el => [processDealWithError.bind(undefined, el)])
  return plan({numberOfThreads:25}).build(processes)()
}

///// The below is just for testing demostration
import { sleepWithFunction } from 'js-awe'
const process = (item) => sleepWithFunction(
  1000,
  () => {
    if(item === 3 || item === 30) { 
      console.log(`KO: Failure: ${item+1}: ${new Date()}`) 
      return Promise.reject('KO: Failure') 
    }

    console.log(`OK: ${item+1}: ${new Date()}`) 
    return `OK: ${item}`
  }
)

const items = Array.from({ length: 50 }, (_, index) => index);
processItems(items, process).then(result => console.log(result))
