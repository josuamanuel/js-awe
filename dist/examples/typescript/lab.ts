
import { oneIn } from "../../src/jsUtils"


const sumOfThree = oneIn(3).call((a:number, b:number, c:number)=>{return a + b + c})

sumOfThree
console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
console.log(sumOfThree(1, 2, 3))
