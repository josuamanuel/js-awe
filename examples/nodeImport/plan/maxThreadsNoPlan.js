var items = new Array(1000);
var tasks = (new Array(25)).map( x => Promise.resolve() );
for ( let item of items ) {
  const idx = tasks.indexOf(await Promise.race(tasks));
  tasks[idx] = process(item)
    .catch( err => registerError(err) )
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
