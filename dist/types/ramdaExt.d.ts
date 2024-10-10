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
  export { partialAtPos };
  export { pipeWithChain };
  export { pipe };
  export { pipeWhile };
  export { parallel };
  export { runFutureFunctionsInParallel };
  export { runFunctionsSyncOrParallel };
  export { pickPaths };
  export { mergeArrayOfObjectsRenamingProps };
  export { RLog };
  export { findSolution };
  export { something };
  export { uncurry };
}


/**
* Calculate the new value for the acum and current of the match.
* @param acum first value always start with undefined. then it
* will have the accumulation. Use (acum??0) for safety.
* @param current value of the field to merge.
*/
declare function mergeFields(acum?:any,current?:any, acumRow?:any, currentRow?:any):any

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

declare function injectLeftData(leftData:any[]):typeof injectRightDataD

/**
* Right join using condition and merge function by keys.
* Response will be for each record in the right will be match with 1..N records in the left.
* Left record that dont match will not be present in the response.
* Each record will be composed of the sum of fields from right and left.
* If there are coincident field names. the update function will be called to resolve the value.
* If update is not present, the default behaviour will be to choose the value from right.
* last chain function call is to introduce right Data.
* @param leftRightMatching matchinf function
* @param update update function
* @param leftData leftData
* @return a function ready to receive rightData
*/
declare function innerRightJoinWith(
  leftRightMatching:typeof leftRightMatchingD,
  update:undefined | typeof updateD,
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

/**
* Add input rows which hash is not present in the target
* duplicates in the target will be deleted keeping the last row.
* @param isAsc undefined: does not order. true: return result in asc order. false: in desc order
* @param hashAddNoDups hash function for the input data
* @param addNoDupsToTheEnd input data
* @param hashMaster hash function for the target data
* @param master target data
*/
export function unionWithHashKeysUnc<T,P>(
  isAsc: boolean|undefined,
  hashAddNoDups: (elem: T) => string,
  addNoDupsToTheEnd: T[],
  hashMaster: (elem: P) => string,
  master: P[]
): (T|P)[];


/**
* Add input rows which hash is not present in the target
* duplicates in the target will be deleted keeping the last row.
* @param isAsc undefined: does not order. true: return result in asc order. false: in desc order
* @param hashAddNoDups hash function for the input data
* @param addNoDupsToTheEnd input data
* @param hashMaster hash function for the target data
* @return a function ready to receive the target data
*/
export function unionWithHashKeys<T,P>(
  isAsc: boolean|undefined,
  hashAddNoDups: (elem: T) => string,
  addNoDupsToTheEnd: T[],
  hashMaster: (elem: T) => string,
):(master: P[]) => (T|P)[];

/**
* Given the input records will replace the target matched records. To match the records
* specific hash functions for each data set are provided and executed. 
* @param isAsc undefined: does not order. true: return result in asc order. false: in desc order
* @param getHashNewRecords hash function for the input data
* @param newRecords input data
* @param getHashOldRecords hash function for the target data
* @return a function ready to receive the target data
*/
export function updateWithHashKeys<T, U, V, W, X>(
  isAsc: boolean | undefined,
  getHashNewRecords: (elem: T) => U,
  newRecords: T[],
  getHashOldRecords: (elem: W) => V
  
): (oldRecords: W[]) => X[]


export const between: any;
export const matchByPropId: any;
export const splitCond: any;
export function filterMap<T>(filterFun:(el:T, index:number, data:T[])=>boolean, mapFun:(el:T,index:number, data:T[])=>T, data:T[]): T[];
export const mapWithNext: any;
export const mapWithPrevious: any;
/**
* Exclude elements of the subject Array that matches
* the valuesToRemove.
* You can specify the field in both Arrays for the match.
* a field with value undefined will math using the value instead
* of the values of the property indicated by the field
*/
export function exclude<T>(fieldToRemove:string|undefined, valuesToRemove: any[], fieldSubject:string|undefined, subjectArray:T[]):T[];
export function pipeWithChain(...func: any[]): (...params: any[]) => any;
export function pipe(...func: any[]): (...params: any[]) => any;
export function pipeWhile(funCond: any, ini: any): (...funcs: any[]) => (...inputs: any[]) => any;
export function parallel(numberOfthreads?: number): (futuresOrValues: any) => import("fluture").FutureInstance<any, any[]>;
export function runFutureFunctionsInParallel(numberOfThreads?: number): (functionsToRunInParallel: any) => (data: any) => import("fluture").FutureInstance<any, any[]>;
export function runFunctionsSyncOrParallel(numberOfThreads?: number): (functionsToRun: any) => (data: any) => any;
export function RLog(prefix: any): (...obj: any[]) => any;
export function findSolution(solutionToFind: any, solutions: any): any;
export function something(lib: any): (...args: any[]) => any;
export const pickPaths: any;
export const mergeArrayOfObjectsRenamingProps: any;
export function uncurry(withLog?: boolean): (funcParam: any) => (...args: any[]) => any;
export function partialAtPos(fun: any, pos: any): (...paramValues: any[]) => any;
import * as R from 'ramda';
export { R };
//# sourceMappingURL=ramdaExt.d.ts.map