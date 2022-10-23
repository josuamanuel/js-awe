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
    export { transition };
    export { pushUniqueKey };
    export { pushUniqueKeyOrChange };
    export { pushAt };
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


/**
 * Access each node of the object calling the reviver function. Reviver can return:
 * undefined: no change
 * traverse.skip: stop accessing subtrees
 * traverse.stop: stop completly the object traverse
 * traverse.delete: delete the current node
 * 
 * @param objIni The object to traverse.
 * @param reviver The function to be called for each node
 * @pureFunction true: work with a deepClone of objIni, false: work with objIni passed as a parameter.
 * @returns Return the object after applying reviver actions
 */
export function traverse(objIni: any, reviver: (value:any, path:string[], parent:any, prop:string) => any, pureFunction?: boolean): any
export namespace traverse {
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
export function traverseVertically(functionToRun: (verticalSlice: object, runIndex:number) => any, verFields:string[], toTraverse:any[]):void

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
export function transition(states: any, events: any, transitions: any): {
  (event: any): any;
  valueOf(): any;
};
export function pushUniqueKey(row: any, table: any, indexes?: number[]): any;
export function pushUniqueKeyOrChange(newRow: any, table: any, indexes: number[], mergeFun: any): any;
export function pushAt(pos: any, value: any, arr: any): any;
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
//# sourceMappingURL=jsUtils.d.ts.map