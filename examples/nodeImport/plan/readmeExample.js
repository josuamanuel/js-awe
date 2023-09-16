import { plan } from 'js-awe'
// const { plan } = require('js-awe')
// import { plan } from 'js-awe'


const result = plan().build([
  (val1, val2) => 
    val2 !==0
      ? Promise.resolve(val1 / val2)
      : Promise.reject(new Error('Zero division')),
  val3 => {
    const result = Math.sqrt(val3 - 5)
    return Number.isNaN(result)
      ? new Error('Root of negative')
      : result
  } 
])

const handlingErrors = e => {
  if(e.message === 'Zero division') console.log('ooops divison by zero')
  if(e.message === 'Root of negative') console.log('ooops root of a negative value')
  if(e.message !== 'Zero division' && e.message !== 'Root of negative') console.log(e)
}

result(3, 0)
  .then(result => console.log(`result: ${result}`))
  // Error handling managed in one place
  .catch(handlingErrors)

result(4,2)
  .then(result => console.log(`result: ${result}`))
  .catch(handlingErrors)