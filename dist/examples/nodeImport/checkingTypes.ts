
import { filterMap} from 'js-awe'

const result = filterMap((el, index)=> el % index, (el,index)=> ({a:index}), [0,1,7,3,4,5,9])

result

/*
Hovering in result gives type:

const result: {
    a: number;
}[]

*/