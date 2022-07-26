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
export declare function anonymize(toAnonymise: string): string

// lodashExt.js

// chrono.js

/**
 * Create events by calling time(eventNames) and finish them by calling 
 * timeEnd(eventNames). You can print the result in console by calling
 * report()
 */
export declare interface Chrono {
  /**
   * Create event/s and start the timer.
   * @param eventNames name of the event or array with events
   */
  time(eventNames: string | string[]):void
  /**
   * Stop the timer for the envent/s.
   * @param eventNames name of the event or array with events
   */
  timeEnd(eventNames: string | string[]):void
  /**
   * console.log the status of the events at time of the call.
   */
  report():void
}
export declare function Chrono(): Chrono

// fetchImproved.js
export default fetchImproved;
export { fetch };
declare function fetchImproved(...args: any[]): Promise<{
    status: number;
    body: unknown;
}>;
import fetch from "node-fetch";

// flutureExt.js
import * as F from "fluture";
export function fletch({ url, options }?: {
    url: any;
    options: any;
}): F.FutureInstance<any, {
    status: number;
    body: unknown;
}>;
export function promiseFunToFutureFun(futurizePromFun: any): (...input: any[]) => F.FutureInstance<any, any>;
export function ffletchMaker(fetchsDef: any, delay: any): (input: any) => F.FutureInstance<any, any>;
export { F };

// jsUtils.js
export default jsUtils;
declare namespace jsUtils {
    export { logWithPrefix };
    export { firstCapital };
    export { varSubsDoubleBracket };
    export { queryObjToStr };
    export { CustomError };
    export { urlCompose };
    export { urlDecompose };
    export { indexOfNthMatch };
    export { colors };
    export { colorMessage };
    export { colorMessageByStatus };
    export { colorByStatus };
    export { findDeepKey };
    export { deepFreeze };
    export { getValueAtPath };
    export { setValueAtPath };
    export { sorterByPaths };
    export { filterFlatMap };
    export { arraySorter };
    export { isPromise };
    export { sleep };
    export { sleepWithValue };
    export { sleepWithFunction };
    export { notTo };
    export { arrayToObject };
    export { arrayOfObjectsToObject };
    export { removeDuplicates };
    export { traverse };
    export { copyPropsWithValue };
    export { copyPropsWithValueUsingRules };
    export { EnumMap };
    export { Enum };
    export { pushUniqueKey };
    export { pushUniqueKeyOrChange };
    export { memoize };
    export { fillWith };
    export { isDate };
    export { isEmpty };
    export { isStringADate };
    export { formatDate };
    export { dateFormatter };
    export { YYYY_MM_DD_hh_mm_ss_ToUtcDate };
    export { dateToObj };
    export { diffInDaysYYYY_MM_DD };
    export { subtractDays };
    export { previousDayOfWeek };
    export { getSameDateOrPreviousFridayForWeekends };
    export { replaceAll };
    export { cleanString };
    export { repeat };
    export { runEvery };
    export { loopIndexGenerator };
    export { retryWithSleep };
    export { processExit };
}
export function logWithPrefix(title: any, displayFunc: any): (message: any) => any;
export function firstCapital(str: any): any;
export function varSubsDoubleBracket(strToResolveVars: any, state: any, mode: any): any;
export function queryObjToStr(query: any): string;
export class CustomError extends Error {
    constructor(name?: string, message?: string, data?: {
        status: number;
    });
    data: {
        status: number;
    };
}
export function urlCompose(gatewayUrl: any, serviceName: any, servicePath: any): {
    gatewayUrl: any;
    serviceName: any;
    servicePath: any;
    url: any;
};
export function urlDecompose(url: any, listOfServiceNames: any): any;
export function indexOfNthMatch(string: any, toMatch: any, nth: any): any;
export namespace colors {
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
export function colorMessage(message: any, color: any): string;
export function colorMessageByStatus(message: any, status: any): string;
export function colorByStatus(status: any): string;
export function findDeepKey(objIni: any, keyToFind: any): any[];
export function deepFreeze(o: any): any;
export function getValueAtPath(obj: any, valuePath: any): any;
export function setValueAtPath(obj: any, valuePath: any, value: any): string;
export function sorterByPaths(paths: any, isAsc?: boolean): (objA: any, objB: any) => number;
export function filterFlatMap(mapWithUndefinedFilterFun: any, data: any): any[];
export function arraySorter(isAsc?: boolean): (a: any, b: any) => 1 | -1 | 0;
export function isPromise(obj: any): boolean;
export function sleep(ms: any): Promise<any>;
export function sleepWithValue(ms: any, value: any): Promise<any>;
export function sleepWithFunction(ms: any, func: any, ...params: any[]): Promise<any>;
export function notTo(funct: any): (...params: any[]) => boolean;
export function arrayToObject(arr: any, defaultValueFunction: any): any;
export function arrayOfObjectsToObject(iterable: any): any;
export function removeDuplicates(arr: any): any[];
export function traverse(objIni: any, reviver: any, pureFunction?: boolean): any;
export namespace traverse {
    export const skip: symbol;
    export const stop: symbol;
    const _delete: symbol;
    export { _delete as delete };
}
export function copyPropsWithValue(objDest: any, shouldUpdateOnlyEmptyFields?: boolean): (input: any) => any;
export function copyPropsWithValueUsingRules(objDest: any, copyRules: any, shouldUpdateOnlyEmptyFields?: boolean): (inputObj: any) => any;
export class EnumMap {
    constructor(values: any);
    get(target: any, prop: any): any;
    set(_undefined: any, prop: any): void;
    invert(): EnumMap;
}
export class Enum {
    constructor(values: any, rules: any);
    get: (_target: any, prop: any) => any;
    set: (_undefined: any, prop: any, value: any) => boolean;
    getValue: () => any;
}
export function pushUniqueKey(row: any, table: any, indexes?: number[]): any;
export function pushUniqueKeyOrChange(newRow: any, table: any, indexes: number[], mergeFun: any): any;
export function memoize(): {
    memoizeMap: (func: any, ...params: any[]) => any;
    memoizeWithHashFun: (func: any, hashFunc: any, ...params: any[]) => any;
};
export function fillWith(mapper: any, lenOrWhileTruthFun: any): any[];
export function isDate(d: any): boolean;
export function isEmpty(value: any): boolean;
export function isStringADate(stringDate: any): boolean;
export function formatDate(format: any, date: any): any;
export function dateFormatter(format: any): (date: any) => any;
export function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss: any): number;
export function dateToObj(date: any): {
    YYYY: number;
    MM: number;
    DD: number;
    hh: number;
    mm: number;
    ss: number;
    mil: number;
};
export function diffInDaysYYYY_MM_DD(iniDate: any, endDate: any): number;
export function subtractDays(daysToSubtract: any, date: any): any;
export function previousDayOfWeek(dayOfWeek: any, date: any): any;
export function getSameDateOrPreviousFridayForWeekends(date: any): any;
export function replaceAll(str: any, ...fromTo: any[]): any;
export function cleanString(str: any): any;
export function repeat(numberOfTimes: any): {
    times: (funToRepeat: any) => any[];
    awaitTimes: (funToRepeat: any) => Promise<any[]>;
    value: (value: any) => any[];
};
export function runEvery(period: any): {
    calls: (runFunc: any) => {
        (...args: any[]): any;
        reset(): number;
    };
};
export function loopIndexGenerator(initValue: any, iterations: any): Generator<any, void, unknown>;
export function retryWithSleep(times: any, updateSleepTimeFun: any, funToRun: any, funToRunParams: any, shouldStopRetrying: any): Promise<any>;
export function processExit(error: any): void;

// logLevelExtension.js
export const log: any;

// ramdaExt.js
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
  export { log };
  export { findSolution };
  export { something };
  export { uncurry };
}
export const groupByWithCalc: any;
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
export function log(prefix: any): (...obj: any[]) => any;
export function findSolution(solutionToFind: any, solutions: any): any;
export function something(lib: any): (...args: any[]) => any;
export const pickPaths: any;
export const mergeArrayOfObjectsRenamingProps: any;
export function uncurry(withLog?: boolean): (funcParam: any) => (...args: any[]) => any;
export { R };

// sanitizer.js
export function sanitize(obj: any, sanitizers: string[], noSanitzedUptoLogLevel: any): any;
export function lengthSanitizer(_: any, value: any): string;
export function bearerSanitizer(_: any, bearerToken: any): string;
import { anonymize } from "./anonymize.js";
export { anonymize };

// streamUtils.js
export const pipeline: any;
export function mapStream(mapFunc: any): import("stream-transform").Transformer;
export function filterStream(filterFunc: any): import("stream-transform").Transformer;
export function filterMapStream(filterFunc: any, mapFunc: any): import("stream-transform").Transformer;
export const fsWriteFilePromise: any;