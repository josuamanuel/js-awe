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
function mergeFields(left?:any,right?:any):any

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
function groupByWithCalc(
groupBy:(row:any)=>any,
calc:objCalc
):([]) => []

export { groupByWithCalc }

export const innerRightJoinWith: any;
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