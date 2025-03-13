
import { oneIn } from "js-awe"


const sumOfThree = oneIn(3).call((a:number, b:number, c:number)=>{return a + b + c})

console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
