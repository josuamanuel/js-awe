
import { filterMap} from 'js-awe'

filterMap((el, index)=> el % index, (el,index)=> el*index, [0,1,7,3,4,5,9])

