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
    export { getAt };
    export { setAt };
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
    export { traverseVertically };
    export { project };
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
    export { addDays };
    export { previousDayOfWeek };
    export { getSameDateOrPreviousFridayForWeekends };
    export { isDateMidnight };
    export { setDateToMidnight };
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
    static of: typeof CustomError;
    constructor(name?: string, message?: string, data?: {
        status: number;
    });
    data: {
        status: number;
    };
    map(func: any): this;
    chain(func: any): this;
}
export function createCustomErrorClass(errorName: any): {
    new (name: any, message: any, data: any): {
        name: any;
        data: {
            status: number;
        };
        map(func: any): any;
        chain(func: any): any;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    of: typeof CustomError;
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export function urlCompose(gatewayUrl: any, serviceName: any, servicePath: any): {
    gatewayUrl: any;
    serviceName: any;
    servicePath: any;
    url: any;
};
export function urlDecompose(url: any, listOfServiceNames: any): any;
export function indexOfNthMatch(string: any, toMatch: any, nth: any): any;
export namespace colors {
    let red: string;
    let green: string;
    let yellow: string;
    let cyan: string;
    let blue: string;
    let reset: string;
    let reverse: string;
    let fgBlack: string;
    let fgRed: string;
    let fgGreen: string;
    let fgYellow: string;
    let fgBlue: string;
    let fgMagenta: string;
    let fgCyan: string;
    let fgWhite: string;
    let bgBlack: string;
    let bgRed: string;
    let bgGreen: string;
    let bgYellow: string;
    let bgBlue: string;
    let bgMagenta: string;
    let bgCyan: string;
    let bgWhite: string;
    let bright: string;
    let dim: string;
    let underscore: string;
    let blink: string;
    let hidden: string;
}
export function colorMessage(message: any, color: any): string;
export function colorMessageByStatus(message: any, status: any): string;
export function colorByStatus(status: any): string;
export function findDeepKey(objIni: any, keyToFind: any): any[];
export function deepFreeze(o: any): any;
export function getAt(obj: any, valuePath: any): any;
export function setAt(obj: any, valuePath: any, value: any): string;
export function sorterByPaths(paths: any, isAsc?: boolean): (objA: any, objB: any) => number;
export function filterFlatMap(mapWithUndefinedFilterFun: any, data: any): any[];
export function arraySorter(isAsc?: boolean): (a: any, b: any) => 0 | 1 | -1;
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
    export let skip: symbol;
    export let stop: symbol;
    let _delete: symbol;
    export { _delete as delete };
    export function matchPath(pathStringQuery: any, reviverPath: any): any;
}
export function traverseVertically(functionToRun: any, verFields: any, toTraverse: any): void;
export function project(paths: any, json: any, removeWithDelete?: boolean): any;
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
export function pushUniqueKeyOrChange(newRow: any, table: any, indexes: number[] | undefined, mergeFun: any): any;
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
} | undefined;
export function diffInDaysYYYY_MM_DD(iniDate: any, endDate: any): number;
export function subtractDays(daysToSubtract: any, date: any): Date;
export function addDays(daysToAdd: any, date: any): Date;
export function previousDayOfWeek(dayOfWeek: any, date: any): Date;
export function getSameDateOrPreviousFridayForWeekends(date: any): Date;
export function isDateMidnight(date: any): boolean;
export function setDateToMidnight(date: any): Date;
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
