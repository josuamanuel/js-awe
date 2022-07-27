export namespace RE {
  export { groupByWithCalc };
  export { innerRightJoinWith };
  export { unionWithHashKeys };
  export { updateWithHashKeys };
  export { between };
  export { matchByPropId };
  export { splitCond };
  export { filterMap };
  export { mapWithNext };
  export { mapWithPrevious };
  export { pipeWithChain };
  export { runFunctionsInParallel };
  export { pickPaths };
  export { mergeArrayOfObjectsRenamingProps };
  export { Rlog };
  export { findSolution };
  export { something };
  export { uncurry };
}


/**
* Calculate the new value for the left and right of the match.
* @param left first value always start with undefined. then it
* will have the accumulation. Use (left??0) for safety.
* @param right value of the field to merge.
*/
declare function mergeFields(left?:any,right?:any):any

type mergeFieldsType = typeof mergeFields

interface objCalc {
  [fieldCalc:string]: mergeFieldsType
}

/**
* Group the records that using the hash(row) as input produces
* the same key and apply fied calculations using each field of
* the calc object. 
* @param groupBy hash function of the input row
* @param mergeFieldsObject Object with fields and how to calculate the new value
*/
declare function groupByWithCalc(
  groupBy:(row:any)=>any,
  calc:objCalc
):(data:any[]) => any[]

export { groupByWithCalc }


/**
* Returns true if records need to be merged
* @param leftRow row form left data to match
* @param rightRow row from right data to match
* @return true if merge is required
*/
declare function leftRightMatchingD(leftRow?:any, rightRow?:any):boolean

/**
* update matched records
* @param key each of the fields for a match record
* @param leftValue left value of the key
* @param rightValue right value of the key
* @return the new value to be assigned to the key
*/
declare function updateD(key?:string, leftValue?:any, rightValue?:any):any

/**
* introduce the rightData to join
* @param rightData each of the fields for a match record
* @return the final result for the innerRightJoinWith
*/
declare function injectRightDataD(rightData:any[]):any[]

declare function injectLeftData(leftData:any[]):injectRightDataD

/**
* Right join using condition and merge function by keys.
* last chain function call is to introduce right Data.
* It keeps records from the right and update with
* the left data
* @param leftRightMatching matchinf function
* @param update update function
* @param leftData leftData
* @return a function ready to receive rightData
*/
declare function innerRightJoinWith(
  leftRightMatching:typeof leftRightMatchingD,
  update:typeof updateD,
  leftData:any[]
):typeof injectRightDataD

/**
* Right join using condition and merge function by keys.
* Data is introduce calling in sequence 3 times first 
* the params 2nd with left data and 3rd with right data.
* @param leftRightMatching matchinf function
* @param update update function
* @return a function ready to receive rightData that when 
* invoke returns a function ready to receive leftData. Last
* invaction with leftData will get the final result.
*/
declare function innerRightJoinWith(
  leftRightMatching:typeof leftRightMatchingD,
  update:typeof updateD
):typeof injectLeftData

export { innerRightJoinWith }

export const unionWithHashKeys: any;
export const updateWithHashKeys: any;
export const between: any;
export const matchByPropId: any;
export const splitCond: any;
export const filterMap: any;
export const mapWithNext: any;
export const mapWithPrevious: any;
export function pipeWithChain(...func: any[]): (...params: any[]) => any;
export function runFunctionsInParallel(numberOfThreads?: number): (functionsToRunInParallel: any) => (data: any) => import("fluture").FutureInstance<any, any[]>;
export function Rlog(prefix: any): (...obj: any[]) => any;
export function findSolution(solutionToFind: any, solutions: any): any;
export function something(lib: any): (...args: any[]) => any;
export const pickPaths: any;
export const mergeArrayOfObjectsRenamingProps: any;
export function uncurry(withLog?: boolean): (funcParam: any) => (...args: any[]) => any;
import * as R from 'ramda';
export { R };
//# sourceMappingURL=ramdaExt.d.ts.map