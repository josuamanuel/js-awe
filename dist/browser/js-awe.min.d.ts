import * as F from 'fluture';
export { F };
import * as ramda from 'ramda';
export { ramda as R };

// anonymize.js
/**
 * Change each number, uppercase letter and lowercase letter
 * for a random number, uppercase letter and lowercase letter.
 * Rest of characters are kept equal, resulting in a same length
 * string. The algorithm returns string filled with * in cases that
 * changes were less than half of the characters.
 * @param toAnonymise The string to change.
 * @returns the randomized string.
 */
 declare function anonymize(toAnonymise: string): string

declare function cloneCopy(to: any, from: any, firstCleanTo: any, shallow: any): any;
declare function wildcardToRegExp(pathSearch: any, flagsString: any, separator?: string): RegExp;
declare function promiseAll(obj: any): any;

/**
 * Create events by calling time(eventNames) and finish them by calling 
 * timeEnd(eventNames). You can print the result in console by calling
 * report()
 */
declare interface Chrono {
  /**
   * Create event/s and start the timer.
   * @param eventNames name of the event or array with events
   */
  time(eventNames: string | string[]): void
  /**
   * Stop the timer for the envent/s.
   * @param eventNames name of the event or array with events
   */
  timeEnd(eventNames: string | string[]): void
  /**
   * console.log the status of the events at time of the call.
   */
  report(): void
  setTime: (event: any) => (data: any) => any;
  setTimeEnd: (event: any) => (data: any) => any;
  logReport: (data: any) => any;
  getChronoState: () => {};
  setChronoStateUsingPerformanceAPIFormat: (performanceGetEntriesByTypeOjb: any) => void;
  getChronoStateUsingPerformanceAPIFormat: () => any[];
  average: () => void;
}
declare function Chrono(): Chrono

declare function fetchImproved(...args: any[]): Promise<{
    status: number;
    body: unknown;
}>;
//# sourceMappingURL=fetchImproved.d.ts.map

declare function fletch({ url, options }?: {
    url: any;
    options: any;
}): F.FutureInstance<any, {
    status: number;
    body: unknown;
}>;
declare function promiseFunToFutureFun(futurizePromFun: any): (...input: any[]) => F.FutureInstance<any, any>;
declare function ffletchMaker(fetchsDef: any, delay: any): (input: any) => F.FutureInstance<any, any>;

declare function logWithPrefix(title: any, displayFunc: any): (message: any) => any;
declare function firstCapital(str: any): any;
declare function varSubsDoubleBracket(strToResolveVars: any, state: any, mode: any): any;
declare function queryObjToStr(query: any): string;
declare class CustomError extends Error {
  constructor(name?: string, message?: string, data?: {
    status: number;
  });
  data: {
    status: number;
  };
}
declare function createCustomErrorClass(errorName: string): {
  new (name?: string, message?: string, data?: { status: number}): {
      name: string;
      data: {
          status: number;
      };
      map(func: Function): any;
      chain(func: Function): any;
      message: string;
      stack?: string;
  };
  of: typeof CustomError;
  captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  prepareStackTrace?: (err: Error, stackTraces: NodeJS.CallSite[]) => any;
  stackTraceLimit: number;
};
declare function urlCompose(gatewayUrl: any, serviceName: any, servicePath: any): {
  gatewayUrl: any;
  serviceName: any;
  servicePath: any;
  url: any;
};
declare function urlDecompose(url: any, listOfServiceNames: any): any;
declare function indexOfNthMatch(string: any, toMatch: any, nth: any): any;
declare namespace colors {
  const red: string;
  const green: string;
  const yellow: string;
  const cyan: string;
  const blue: string;
  const reset: string;
  const reverse: string;
  const fgBlack: string;
  const fgRed: string;
  const fgGreen: string;
  const fgYellow: string;
  const fgBlue: string;
  const fgMagenta: string;
  const fgCyan: string;
  const fgWhite: string;
  const bgBlack: string;
  const bgRed: string;
  const bgGreen: string;
  const bgYellow: string;
  const bgBlue: string;
  const bgMagenta: string;
  const bgCyan: string;
  const bgWhite: string;
  const bright: string;
  const dim: string;
  const underscore: string;
  const blink: string;
  const hidden: string;
}
declare function colorMessage(message: any, color: any): string;
declare function colorMessageByStatus(message: any, status: any): string;
declare function colorByStatus(status: any): string;
declare function findDeepKey(objIni: any, keyToFind: any): any[];
declare function deepFreeze(o: any): any;
declare function getAt(obj: any, valuePath: any): any;
declare function setAt(obj: any, valuePath: any, value: any): string;


/**
 * Create a sorter function to use as a parameter in array.prototype.sort(sorter):
 * It can order by several fields. If fields are equal it will uneven using
 * subsequent fields.
 * @param paths List of paths to sort by. One path for each field to order by. Route path is
 * of the shape. ex: 'person.details.age'. If it is only one field it can be a string.
 * @param isAsc Optional. Default: true. true: to order ascending. false: to order descending
 * @returns Return a sorter function to include in array.prototype.sort(sorter)
 */
declare function sorterByPaths(paths: any, isAsc?: boolean): (objA: any, objB: any) => number;
declare function filterFlatMap(mapWithUndefinedFilterFun: any, data: any): any[];
declare function arraySorter(isAsc?: boolean): (a: any, b: any) => 1 | -1 | 0;
declare function isPromise(obj: any): boolean;
declare function sleep(ms: any): Promise<any>;
declare function sleepWithValue(ms: any, value: any): Promise<any>;
declare function sleepWithFunction(ms: any, func: any, ...params: any[]): Promise<any>;
declare function notTo(funct: any): (...params: any[]) => boolean;
declare function arrayToObject(arr: any, defaultValueFunction: any): any;
declare function arrayOfObjectsToObject(iterable: any): any;
declare function removeDuplicates(arr: any): any[];


/**
 * Access each node of the object calling the reviver function. Reviver can return:
 * undefined: no change
 * traverse.skip: stop accessing subtrees
 * traverse.stop: stop completly the object traverse
 * traverse.delete: delete the current node
 * traverse.match(stringQuery, reviverPath) return true if reviverPath match query string
 * 
 * @param objIni The object to traverse.
 * @param reviver The function to be called for each node
 * @pureFunction true: work with a deepClone of objIni, false: work with objIni passed as a parameter.
 * @returns Return the object after applying reviver actions
 */
declare function traverse(objIni: any, reviver: (value: any, path: string[], parent: any, prop: string) => any, pureFunction?: boolean): any
declare namespace traverse {
  export const skip: symbol;
  export const stop: symbol;
  const _delete: symbol;
  export { _delete as delete };
}
/**
 * Takes vertifical slices of a two nested array and calls functionToRun with each slice
 * @example
 * ```
 * traverseVertically (
 *  functionToRun
 *  ['marathonResults'], // List of fields for the second level nested array
 *  [{name:'Jose',marathonResults:[12,35]},{name:'Ana',marathonResults:[1]}]
 * )
 * ```
 * This will produce folllowing calls
 * ```
 * functionToRun([{name:'Jose', marathonResults:12}, {name:'Ana',marathonResults:1}])
 * functionToRun([{name:'Jose', marathonResults:35}, {name:'Ana',marathonResults:undefined}])
 * ```
 * 
 * @param functionToRun This function will be called for each vertical slice.
 * @param verFields Fields inside each item of the traverse array that contains the second nested arrays to iterate vertically.
 * @param toTraverse: Array to be traverse
 * @returns void
 */
declare function traverseVertically(functionToRun: (verticalSlice: object, runIndex: number) => any, verFields: string[], toTraverse: any[]): void

/**
 * Totally recreate a new object with the selected values using jsonpath-plus format for queries.
 * 
 * @param paths Array with the queries for the projection. First char must be + to include or - to remove
 * @param json Subject object to project.
 * @example
 * // returns {a:{b:{c:3,e:9}}}
 * project(['+$.a.b','-$.a.b.d'], {a:{b:{c:3,d:5,e:9}}});
 * @returns any
 */
declare function project(paths:string[], json:any):any
declare function copyPropsWithValue(objDest: any, shouldUpdateOnlyEmptyFields?: boolean): (input: any) => any;
declare function copyPropsWithValueUsingRules(objDest: any, copyRules: any, shouldUpdateOnlyEmptyFields?: boolean): (inputObj: any) => any;
declare class EnumMap {
  constructor(values: any);
  get(target: any, prop: any): any;
  set(_undefined: any, prop: any): void;
  invert(): EnumMap;
}
declare class Enum {
  constructor(values: any, rules: any);
  get: (_target: any, prop: any) => any;
  set: (_undefined: any, prop: any, value: any) => boolean;
  getValue: () => any;
}
declare function transition(states: any, events: any, transitions: any): {
  (event: any): any;
  valueOf(): any;
};
declare function pushUniqueKey(row: any, table: any, indexes?: number[]): any;
declare function pushUniqueKeyOrChange(newRow: any, table: any, indexes: number[], mergeFun: any): any;
declare function pushAt(pos: any, value: any, arr: any): any;
declare function memoize(): {
  memoizeMap: (func: any, ...params: any[]) => any;
  memoizeWithHashFun: (func: any, hashFunc: any, ...params: any[]) => any;
};
declare function fillWith(mapper: any, lenOrWhileTruthFun: any): any[];

type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
type Separator = '/' | '-'
type StringDate = `${number}${Separator}${Month}${Separator}${Day}${string}`;

declare function isDate(d: any): boolean;
declare function isEmpty(value: any): boolean;
declare function isStringADate(stringDate: string): boolean;
declare function formatDate(format: any, date?: Date | StringDate): string | undefined;
declare function dateFormatter(format: string): (date: Date | StringDate) => string | undefined;
declare function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss: string): number;
declare function dateToObj(date: Date | StringDate): {
  YYYY: number;
  MM: number;
  DD: number;
  hh: number;
  mm: number;
  ss: number;
  mil: number;
} | undefined;
declare function diffInDaysYYYY_MM_DD(iniDate: Date | StringDate, endDate: Date | StringDate): number;
declare function addDays(daysToSubtract: number, date: Date | StringDate): Date;
declare function subtractDays(daysToSubtract: number, date: Date | StringDate): Date;
declare function previousDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, date: Date | StringDate): Date;
declare function getSameDateOrPreviousFridayForWeekends(date: Date | StringDate): Date;
declare function isDateMidnight(date: Date):boolean | undefined;
declare function setDateToMidnight(date: Date | StringDate): Date;
declare function replaceAll(str: any, ...fromTo: any[]): any;
declare function cleanString(str: any): any;
declare function repeat(numberOfTimes: any): {
  times: (funToRepeat: any) => any[];
  awaitTimes: (funToRepeat: any) => Promise<any[]>;
  value: (value: any) => any[];
};
declare function runEvery(period: any): {
  calls: (runFunc: any) => {
    (...args: any[]): any;
    reset(): number;
  };
};
declare function loopIndexGenerator(initValue: any, iterations: any): Generator<any, void, unknown>;
declare function retryWithSleep<T>(times: number, updateSleepTimeFun: (currentSleepTime?:number, index?:number)=>number, funToRun: (...params:T[])=>any, funToRunParams: T[]|undefined, shouldStopRetrying?: (result?:any)=>boolean): Promise<any>;
declare function processExit(error: any): void;

declare const log: any;

declare namespace RE {
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
* Left record that dont mat will not be present in the response.
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


/**
* Add input rows which hash is not present in the target
*/
declare const unionWithHashKeys: any;
/**
* Update target with input for rows with same hash
* Add to target the new rows from input with new hash.
*/
declare const updateWithHashKeys: any;
declare const between: any;
declare const matchByPropId: any;
declare const splitCond: any;
declare function filterMap<T>(filterFun:(el:T)=>boolean, mapFun:(el:T)=>T, data:T[]): T[];
declare const mapWithNext: any;
declare const mapWithPrevious: any;
/**
* Exclude elements of the subject Array that matches
* the valuesToRemove.
* You can specify the field in both Arrays for the match.
* a field with value undefined will math using the value instead
* of the values of the property indicated by the field
*/
declare function exclude<T>(fieldToRemove:string|undefined, valuesToRemove: any[], fieldSubject:string|undefined, subjectArray:T[]):T[];
declare function pipeWithChain(...func: any[]): (...params: any[]) => any;
declare function pipe(...func: any[]): (...params: any[]) => any;
declare function pipeWhile(funCond: any, ini: any): (...funcs: any[]) => (...inputs: any[]) => any;
declare function parallel(numberOfthreads?: number): (futuresOrValues: any) => F.FutureInstance<any, any[]>;
declare function runFutureFunctionsInParallel(numberOfThreads?: number): (functionsToRunInParallel: any) => (data: any) => F.FutureInstance<any, any[]>;
declare function runFunctionsSyncOrParallel(numberOfThreads?: number): (functionsToRun: any) => (data: any) => any;
declare function RLog(prefix: any): (...obj: any[]) => any;
declare function findSolution(solutionToFind: any, solutions: any): any;
declare function something(lib: any): (...args: any[]) => any;
declare const pickPaths: any;
declare const mergeArrayOfObjectsRenamingProps: any;
declare function uncurry(withLog?: boolean): (funcParam: any) => (...args: any[]) => any;
declare function partialAtPos(fun: any, pos: any): (...paramValues: any[]) => any;

declare function plan(plan: any, { numberOfThreads, mockupsObj }?: {
  numberOfThreads: number;
  mockupsObj: {};
}): any;

declare function sanitize(obj: any, sanitizers: string[], noSanitzedUptoLogLevel: any): any;
declare function lengthSanitizer(_: any, value: any): string;
declare function bearerSanitizer(_: any, bearerToken: any): string;

type AddColumn = ({ type, id, title }: { type: any; id: any; title: any }) => AddColumnReturn

type AddColumnReturn = {
  addColumn: AddColumn
  draw: Draw
}

type Draw = () => string

type TableReturn = {
  addColumn: AddColumn
  auto: () => { draw: Draw }
}

/**
 * stringify data in a tabular format so you can log it with:
 * console.log(Table(data).auto().draw())
 * You can use two modes. Using auto as above gives a log
 * similar to console.table(data).
 * Using addColumns you select the fields and specify the format
 * console.log(Table(data).
 *  .addColumn({ type: Text(), id: 'event', title: 'Events' })
 *  .addColumn({ type: Timeline(), id: 'intervals' }).draw())
 *  .draw())
 * @param data The data to draw in the console.
 * @returns .
 */
declare function Table(data: any): TableReturn

declare function center(text: any, size: any): any;
declare function left(text: any, size: any): any;

declare function Text({ HEADING_IDENTATION, ROW_IDENTATION }?: {
    HEADING_IDENTATION: typeof center;
    ROW_IDENTATION: typeof left;
}): {
    loadParams: (paramId: any) => (paramTitle: any) => {
        id: any;
        load: (columnData: any) => void;
        getSize: () => any;
        heading: {
            nextValue: () => Generator<any, void, unknown>;
        };
        row: {
            nextValue: () => Generator<any, void, unknown>;
        };
    };
};

declare function Timeline(): {
    loadParams: (paramId: any) => (paramTitle: any) => {
        id: any;
        load: (columnData: any) => void;
        getSize: () => any;
        heading: {
            nextValue: () => Generator<any, void, unknown>;
        };
        row: {
            nextValue: () => Generator<any, void, unknown>;
        };
    };
};

export { Chrono, CustomError, Enum, EnumMap, RE, RLog, Table, Text, Timeline, YYYY_MM_DD_hh_mm_ss_ToUtcDate, addDays, anonymize, arrayOfObjectsToObject, arraySorter, arrayToObject, bearerSanitizer, between, cleanString, cloneCopy, colorByStatus, colorMessage, colorMessageByStatus, colors, copyPropsWithValue, copyPropsWithValueUsingRules, createCustomErrorClass, dateFormatter, dateToObj, deepFreeze, diffInDaysYYYY_MM_DD, exclude, fetchImproved, ffletchMaker, fillWith, filterFlatMap, filterMap, findDeepKey, findSolution, firstCapital, fletch, formatDate, getAt, getSameDateOrPreviousFridayForWeekends, groupByWithCalc, indexOfNthMatch, innerRightJoinWith, isDate, isDateMidnight, isEmpty, isPromise, isStringADate, lengthSanitizer, log, logWithPrefix, loopIndexGenerator, mapWithNext, mapWithPrevious, matchByPropId, memoize, mergeArrayOfObjectsRenamingProps, notTo, parallel, partialAtPos, pickPaths, pipe, pipeWhile, pipeWithChain, plan, previousDayOfWeek, processExit, project, promiseAll, promiseFunToFutureFun, pushAt, pushUniqueKey, pushUniqueKeyOrChange, queryObjToStr, removeDuplicates, repeat, replaceAll, retryWithSleep, runEvery, runFunctionsSyncOrParallel, runFutureFunctionsInParallel, sanitize, setAt, setDateToMidnight, sleep, sleepWithFunction, sleepWithValue, something, sorterByPaths, splitCond, subtractDays, transition, traverse, traverseVertically, uncurry, unionWithHashKeys, updateWithHashKeys, urlCompose, urlDecompose, varSubsDoubleBracket, wildcardToRegExp };
