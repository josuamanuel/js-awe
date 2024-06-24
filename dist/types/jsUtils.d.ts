/**
 * @fileoverview TypeScript declarations for jsUtils module.
 * @module jsUtils
 */

/**
 * Utility functions for JavaScript.
 * @namespace jsUtils
 */

/**
 * Logs a message with a prefix.
 * @param {any} title - The prefix for the log message.
 * @param {any} displayFunc - The function to display the log message.
 * @returns {Function} - The log function.
 */
export function logWithPrefix(title: any, displayFunc: any): (message: any) => any;

/**
 * Capitalizes the first letter of a string.
 * @param {any} str - The string to capitalize.
 * @returns {any} - The capitalized string.
 */
export function firstCapital(str: any): any;

/**
 * String template functionality. Given a string with "text {{var1}} text2 {{var2}}"
 * and a state object {var1: 'foo', var2: 'bar'}, it returns a string substituting
 * the template variables for their values. "text foo text2 bar"
 * The state can be a string, an object, or an array.
 * For mode=url, a state array is converted into a list of values separated by commas.
 * For mode=url, a state object is converted into query field=value separated by '&'.
 * If mode is different from 'url', the state is stringified.
 * @param {string} strToResolveVars - The string with variables to be substituted. The string can represent a JSON or URL.
 * @param {any} state - The state with the values to substitute the template variables.
 * @param {string} [mode] - The mode for converting the state. 'url' for converting state arrays into comma-separated field=value1,value2
 * and objects into field=value & field2=value2. If mode is not specified, the state is stringified.
 * @returns {string} - The string after substituting the template variables for their corresponding values from the state object.
 */
export function varSubsDoubleBracket(strToResolveVars: string, state: any, mode?: 'url'): string;

/**
 * Converts a query object to a string representation.
 * @param {any} query - The query object to convert.
 * @returns {string} - The string representation of the query object.
 */
export function queryObjToStr(query: any): string;

/**
 * Custom error class that extends the Error class.
 * @extends Error
 */
export class CustomError extends Error {
  /**
   * Creates an instance of CustomError.
   * @param {string} [name='GENERIC'] - The name of the error.
   * @param {string} message - The message of the error.
   * @param {object} [data={ status: 500 }] - Additional data about the error.
   */
  constructor(name?: string, message?: string, data?: { status: number });
  data: { status: number };
}

/**
 * Creates a custom error class with the given error name.
 * @param {string} errorName - The name of the custom error class.
 * @returns {object} - The custom error class.
 */
export function createCustomErrorClass(errorName: string): {
  new (name?: string, message?: string, data?: { status: number }): {
    name: string;
    data: { status: number };
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

/**
 * Composes a URL from the gateway URL, service name, and service path.
 * @param {any} gatewayUrl - The gateway URL.
 * @param {any} serviceName - The service name.
 * @param {any} servicePath - The service path.
 * @returns {object} - The composed URL object.
 */
export function urlCompose(gatewayUrl: any, serviceName: any, servicePath: any): {
  gatewayUrl: any;
  serviceName: any;
  servicePath: any;
  url: any;
};

/**
 * Decomposes a URL into the gateway URL, service name, and service path.
 * @param {any} url - The URL to decompose.
 * @param {any} listOfServiceNames - The list of service names.
 * @returns {any} - The decomposed URL object.
 */
export function urlDecompose(url: any, listOfServiceNames: any): any;

/**
 * Returns the index of the nth match of a substring in a string.
 * @param {any} string - The string to search in.
 * @param {any} toMatch - The substring to match.
 * @param {any} nth - The nth match to find.
 * @returns {any} - The index of the nth match.
 */
export function indexOfNthMatch(string: any, toMatch: any, nth: any): any;

/**
 * Namespace for color constants.
 * @namespace colors
 */
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

/**
 * Colors a message with the specified color.
 * @param {any} message - The message to color.
 * @param {any} color - The color to apply.
 * @returns {string} - The colored message.
 */
export function colorMessage(message: any, color: any): string;

/**
 * Colors a message based on the status.
 * @param {any} message - The message to color.
 * @param {any} status - The status to determine the color.
 * @returns {string} - The colored message.
 */
export function colorMessageByStatus(message: any, status: any): string;

/**
 * Gets the color based on the status.
 * @param {any} status - The status to determine the color.
 * @returns {string} - The color.
 */
export function colorByStatus(status: any): string;

/**
 * Finds the deep key in an object.
 * @param {any} objIni - The initial object.
 * @param {any} keyToFind - The key to find.
 * @returns {any[]} - The array of found keys.
 */
export function findDeepKey(objIni: any, keyToFind: any): any[];

/**
 * Freezes an object deeply.
 * @param {any} o - The object to freeze.
 * @returns {any} - The frozen object.
 */
export function deepFreeze(o: any): any;

/**
 * Gets the value at the specified path in an object.
 * @param {any} obj - The object to get the value from.
 * @param {any} valuePath - The path to the value.
 * @returns {any} - The value at the specified path.
 */
export function getAt(obj: any, valuePath: any): any;

/**
 * Sets the value at the specified path in an object.
 * @param {any} obj - The object to set the value in.
 * @param {any} valuePath - The path to the value.
 * @param {any} value - The value to set.
 * @returns {string} - The result of setting the value.
 */
export function setAt(obj: any, valuePath: any, value: any): string;

/**
 * Creates a sorter function to use as a parameter in array.prototype.sort(sorter).
 * It can order by several fields. If fields are equal, it will uneven using subsequent fields.
 * @param {any} paths - List of paths to sort by. One path for each field to order by. Route path is of the shape 'person.details.age'. If it is only one field, it can be a string.
 * @param {boolean} [isAsc=true] - Optional. Default: true. true: to order ascending. false: to order descending.
 * @returns {Function} - A sorter function to include in array.prototype.sort(sorter).
 */
export function sorterByPaths(paths: any, isAsc?: boolean): (objA: any, objB: any) => number;

/**
 * Filters and maps an array.
 * @param {any} mapWithUndefinedFilterFun - The array to filter and map.
 * @param {any} data - The data to filter and map.
 * @returns {any[]} - The filtered and mapped array.
 */
export function filterFlatMap(mapWithUndefinedFilterFun: any, data: any): any[];

/**
 * Sorts an array in ascending or descending order.
 * @param {boolean} [isAsc=true] - Optional. Default: true. true: to order ascending. false: to order descending.
 * @returns {Function} - A sorter function to use with array.prototype.sort(sorter).
 */
export function arraySorter(isAsc?: boolean): (a: any, b: any) => 1 | -1 | 0;

/**
 * Checks if an object is a Promise.
 * @param {any} obj - The object to check.
 * @returns {boolean} - true if the object is a Promise, false otherwise.
 */
export function isPromise(obj: any): boolean;

/**
 * Sleeps for the specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<any>} - A Promise that resolves after the specified number of milliseconds.
 */
export function sleep(ms: number): Promise<any>;

/**
 * Sleeps for the specified number of milliseconds and resolves with the specified value.
 * @param {number} ms - The number of milliseconds to sleep.
 * @param {any} value - The value to resolve with.
 * @returns {Promise<any>} - A Promise that resolves after the specified number of milliseconds with the specified value.
 */
export function sleepWithValue(ms: number, value: any): Promise<any>;

/**
 * Sleeps for the specified number of milliseconds and executes the specified function with the specified parameters.
 * @param {number} ms - The number of milliseconds to sleep.
 * @param {Function} func - The function to execute.
 * @param {...any} params - The parameters to pass to the function.
 * @returns {Promise<any>} - A Promise that resolves after the specified number of milliseconds with the result of the function.
 */
export function sleepWithFunction(ms: number, func: Function, ...params: any[]): Promise<any>;

/**
 * Negates a function.
 * @param {Function} funct - The function to negate.
 * @returns {Function} - The negated function.
 */
export function notTo(funct: Function): (...params: any[]) => boolean;

/**
 * Converts an array to an object using the specified default value function.
 * @param {any} arr - The array to convert.
 * @param {Function} defaultValueFunction - The function to generate the default value.
 * @returns {any} - The converted object.
 */
export function arrayToObject(arr: any, defaultValueFunction: Function): any;

/**
 * Converts an array of objects to an object.
 * @param {any} iterable - The array of objects to convert.
 * @returns {any} - The converted object.
 */
export function arrayOfObjectsToObject(iterable: any): any;

/**
 * Removes duplicates from an array.
 * @param {any} arr - The array to remove duplicates from.
 * @returns {any[]} - The array without duplicates.
 */
export function removeDuplicates(arr: any): any[];

/**
 * Traverses an object and applies a reviver function to each node.
 * @param {any} objIni - The object to traverse.
 * @param {Function} reviver - The function to be called for each node.
 * @param {boolean} [pureFunction] - true: work with a deep clone of objIni, false: work with objIni passed as a parameter.
 * @returns {any} - The object after applying the reviver actions.
 */
export function traverse(objIni: any, reviver: (value: any, path: string[], parent: any, prop: string) => any, pureFunction?: boolean): any;

/**
 * Symbol to skip traversing a subtree.
 * @type {symbol}
 */
export const skip: symbol;

/**
 * Symbol to stop traversing the object.
 * @type {symbol}
 */
export const stop: symbol;

/**
 * Symbol to delete the current node.
 * @type {symbol}
 */
export const _delete: symbol;

/**
 * Takes vertical slices of a two-nested array and calls a function with each slice.
 * @param {Function} functionToRun - The function to run with each vertical slice.
 * @param {string[]} verFields - The fields inside each item of the traverse array that contains the second nested arrays to iterate vertically.
 * @param {any[]} toTraverse - The array to traverse.
 * @returns {void}
 */
export function traverseVertically(functionToRun: (verticalSlice: object, runIndex: number) => any, verFields: string[], toTraverse: any[]): void;


/**
 * Projects a subset of a JSON object based on specified paths, optionally removing properties marked for deletion.
 * 
 * @param {string[]} paths - An array of strings representing the paths to the properties in the JSON object that should be included in the output.
 * @param {Object} json - The JSON object from which the properties specified by paths will be extracted.
 * @param {boolean} [removeWithDelete=true] - A boolean indicating whether properties in the JSON object marked with a specific delete flag should be removed from the output. Defaults to true, meaning properties marked for deletion will be removed.
 * 
 * @returns {Object} A new JSON object containing only the properties specified by the paths array. If removeWithDelete is true, any properties marked for deletion will not be included in the returned object.
 * 
 * @example
 * // Assuming a JSON object `data` as follows:
 * // {
 * //   user: {
 * //     name: "John Doe",
 * //     age: 30,
 * //     email: "johndoe@example.com",
 * //     _delete: { email: true }
 * //   }
 * // }
 * // And calling the function with paths to include the user's name and email:
 * project(['user.name', 'user.email'], data);
 * // Returns: { user: { name: "John Doe" } }
 * // Note: The email property is not included in the output because it's marked for deletion.
 */
export function project(paths: string[], json: any): any

/**
 *  Given  objDest and shouldUpdateOnlyEmptyFields generates function that expect inputObj to copy all properties from inputObj to objDest.
 * 
 * @param {Object} objDest Destination object for the copy.
 * @param {boolean} shouldUpdateOnlyEmptyFields? true: does not replace destination fields with values.
 * @example
 * // returns {isin:123456, name:'test'}
 * copyPropsWithValue({isin:123456}, true)({isin:123, name:'test'});
 * // returns {isin:123, name:'test'}
 * copyPropsWithValue({isin:123456}, false)({isin:123, name:'test'});
 * @returns {Function} A function that takes an input object for props to be copied in objDest.
 */
export function copyPropsWithValue(objDest: any, shouldUpdateOnlyEmptyFields?: boolean): (inputObj: any) => any;

/**
 *  Given  objDest, copyRules and shouldUpdateOnlyEmptyFields generates function that expect input object to copy only properties indicated by copyRules from inputObj to objDest.
 *
 * @param {Object} objDest - The destination object to copy properties into.
 * @param {Array<string|Object>} copyRules - An array of rules specifying which properties to copy.
 *   Each rule can be either a string (for same-named properties) or an object with 'from' and 'to' keys.
 * @param {boolean} [shouldUpdateOnlyEmptyFields=false] - If true, only update fields in the destination object that are empty.
 * @returns {Function} A function that takes an input object for props to be copied in objDest.
 *
 * @example
 * let objTo = {a:{b:2},c:3};
 * let objFrom = {a:{b:4},c:8,d:{e:{f:12}}};
 * copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d'}])(objFrom);
 * // objTo is now {a:{b:2},c:4,d:12}
 *
 * @example
 * let objTo = {a:{b:2},c:3};
 * let objFrom = {a:{b:4},c:8,d:{e:{f:12}}};
 * copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d.f'}, {from:'d.e.g', to:'d.g'}], true)(objFrom);
 * // objTo is now {a:{b:2},c:3,d:{f:12}}
 */
export function copyPropsWithValueUsingRules(objDest: any, copyRules: any, shouldUpdateOnlyEmptyFields?: boolean): (inputObj: any) => any;
export class EnumMap {
  /**
   * Creates an instance of EnumMap.
   * @param {object} values - The values of the enum.
   */
  constructor(values: any);
  /**
   * A Proxy handler method for getting a property value.
   */
  get(target: any, prop: any): any;
  /**
   * A Proxy handler method for setting a property value.
   */
  set(_undefined: any, prop: any): void;
  /**
   * Gets the current active value of the enum.
   * @returns {string} The active enum value.
   */
  invert(): EnumMap;
}
export class Enum {
  /**
   * Creates an instance of Enum.
   * @param {Array<string>} values - The values of the enum.
   * @param {object} rules - The rules defining valid transitions between enum values.
   */
  constructor(values: Array<string>, rules: object);
  /**
   * A Proxy handler method for getting a property value.
   */
  get: (_target: any, prop: any) => any;
  /**
   * A Proxy handler method for setting a property value.
   */
  set: (_undefined: any, prop: any, value: any) => boolean;
  /**
   * Gets the current active value of the enum.
   * @returns {string} The active enum value.
   */
  getValue: () => string;
}

/**
 * Creates a state machine transition function.
 * @param {object} states - The states of the state machine.
 * @param {object} events - The events of the state machine.
 * @param {object} transitions - The transitions of the state machine.
 * @returns {Function} A function that transitions the state machine.
 */
export function transition(states: any, events: any, transitions: any): {
  (event: any): any;
  valueOf(): any;
};

/**
 * Pushes a unique key into a table.
 * @param row 
 * @param table 
 * @param indexes 
 * @returns
 * @example
 * ```
 * pushUniqueKey({id: 1, name: 'John'}, [{id: 1, name: 'John'}], [0]) //?
 * ```
 * This will produce
 * ```
 * [{id: 1, name: 'John'}]
 * ```
 */
export function pushUniqueKey(row: any, table: any[], indexes?: number[]): any;

/**
 * Pushes a unique key into a table or changes the existing row.
 * @param newRow 
 * @param table 
 * @param indexes 
 * @param mergeFun 
 * @returns
 * @example
 * ```
 * pushUniqueKeyOrChange({id: 1, name: 'John'}, [{id: 1, name: 'John'}], [0], (oldRow, newRow) => ({...oldRow, ...newRow})) //?
 * ```
 * This will produce
 * ```
 * [{id: 1, name: 'John'}]
 * ```
 */
export function pushUniqueKeyOrChange(newRow: any, table: any, indexes: number[], mergeFun: any): any;

/**
 * Pushes a value at a given position in an array.
 * @param pos 
 * @param value 
 * @param arr 
 * @returns
 * @example
 * ```
 * pushAt(1, 'a', ['b', 'c']) //?
 * ```
 * This will produce
 * ```
 * ['b', 'a', 'c']
 * ```
 */
export function pushAt(pos: any, value: any, arr: any): any;

/**
 * Memoizes a function.
 * @returns
 * @example
 * ```
 * const memoizeMap = memoize().memoizeMap;
 * const memoizeWithHashFun = memoize().memoizeWithHashFun;
 * ```
 */
export function memoize(): {
  memoizeMap: (func: any, ...params: any[]) => any;
  memoizeWithHashFun: (func: any, hashFunc: any, ...params: any[]) => any;
};

/**
 * Fills an array with a given value.
 * @param mapper 
 * @param lenOrWhileTruthFun 
 * @returns
 * @example
 * ```
 * fillWith('a', 3) //?
 * ```
 * This will produce
 * ```
 * ['a', 'a', 'a']
 * ```
 */
export function fillWith(mapper: any, lenOrWhileTruthFun: any): any[];

type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
type Separator = '/' | '-'
type StringDate = `${number}${Separator}${Month}${Separator}${Day}${string}`;


export function isDate(d: any): boolean;


/**
 * Checks if a value is empty: undefined, null, '', 0, NaN, [], {}
 * empty is bigger than falsy as we have added [] and {} that are truthy
 * @param value - The value to check.
 * @returns Returns `true` if the value is empty, `false` otherwise.
 */
export function isEmpty(value: any): boolean;

/**
 * Checks if a value is a string and a date.
 * @param stringDate - The string to check.
 * @returns Returns `true` if the string is a date, `false` otherwise.
 */
export function isStringADate(stringDate: string): boolean;

/**
 * Formats a date.
 * @param format - The format of the date.
 * @param date - The date to format.
 * @returns The formatted date.
 */
export function formatDate(format: any, date?: Date | StringDate): string | undefined;

/**
 * Formats a date.
 * @param format - The format of the date.
 * @returns A function that formats a date.
 */
export function dateFormatter(format: string): (date: Date | StringDate) => string | undefined;

/**
 * Converts a date string to a date object.
 * @param date - The date string to convert.
 * @returns The date object.
 */
export function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss: string): number;

/**
 * Converts a date object to an object.
 * @param date - The date object to convert.
 * @returns The date object.
 */
export function dateToObj(date: Date | StringDate): {
  YYYY: number;
  MM: number;
  DD: number;
  hh: number;
  mm: number;
  ss: number;
  mil: number;
} | undefined;

/**
 * Converts a date object to a string.
 * @param date - The date object to convert.
 * @returns The date string.
 */
export function diffInDaysYYYY_MM_DD(iniDate: Date | StringDate, endDate: Date | StringDate): number;

/**
 * Adds days to a date.
 * @param daysToSubtract - The number of days to add.
 * @param date - The date to add days to.
 * @returns The date with the added days.
 */
export function addDays(daysToSubtract: number, date: Date | StringDate): Date;

/**
 * Subtracts days from a date.
 * @param daysToSubtract - The number of days to subtract.
 * @param date - The date to subtract days from.
 * @returns The date with the subtracted days.
 */
export function subtractDays(daysToSubtract: number, date: Date | StringDate): Date;

/**
 * Gets the day of the week.
 * @param date - The date to get the day of the week.
 * @returns The day of the week.
 */
export function previousDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, date: Date | StringDate): Date;

/**
 * Gets the same date or the previous Friday for weekends.
 * @param date - The date to get the same date or the previous Friday.
 * @returns The same date or the previous Friday.
 */
export function getSameDateOrPreviousFridayForWeekends(date: Date | StringDate): Date;

/**
 * Checks if a date is midnight.
 * @param date - The date to check.
 * @returns Returns `true` if the date is midnight, `false` otherwise.
 */
export function isDateMidnight(date: Date):boolean | undefined;

/**
 * Sets a date to midnight.
 * @param date - The date to set to midnight.
 * @returns The date set to midnight.
 */
export function setDateToMidnight(date: Date | StringDate): Date;

/**
 * Gets the date of the previous month.
 * @param date - The date to get the previous month.
 * @returns The date of the previous month.
 */
export function replaceAll(str: any, ...fromTo: any[]): any;

/**
 * Replaces all occurrences of a substring in a string.
 * @param str - The string to replace the substring in.
 * @param fromTo - The substring to replace and the new substring.
 * @returns The string with the replaced substring.
 */
export function cleanString(str: any): any;

/**
 * Cleans a string by removing all non-alphanumeric characters.
 * @param str - The string to clean.
 * @returns The cleaned string.
 */
export function repeat(numberOfTimes: any): {
  times: (funToRepeat: any) => any[];
  awaitTimes: (funToRepeat: any) => Promise<any[]>;
  value: (value: any) => any[];
};

/**
 * Repeats a function a specified number of times.
 * @param numberOfTimes - The number of times to repeat the function.
 * @returns An object with functions to repeat the function.
 */
export function oneIn(period: any): {
  calls: (runFunc: any) => {
    (...args: any[]): any;
    reset(): number;
  };
};

/**
 * Calls a function one in a specified period.
 * @param period - The period to call the function.
 * @returns An object with functions to call the function.
 */
export function loopIndexGenerator(initValue: any, iterations: any): Generator<any, void, unknown>;

/**
 * Retries a function with a sleep time between each retry.
 * @template T The type of the parameters for the function to run.
 * @param times The number of times to retry the function.
 * @param updateSleepTimeFun A function that updates the sleep time between retries.
 * @param funToRun The function to run.
 * @param funToRunParams The parameters for the function to run.
 * @param shouldStopRetrying A function that determines whether to stop retrying based on the result of the function.
 * @returns A Promise that resolves with the result of the function.
 */
export function retryWithSleep<T>(times: number, updateSleepTimeFun: (currentSleepTime?:number, index?:number)=>number, funToRun: (...params:T[])=>any, funToRunParams: T[]|undefined, shouldStopRetrying?: (result?:any)=>boolean): Promise<any>;


/**
 * Processes the exit with the given error.
 * @param error - The error object.
 */
export function processExit(error: any): void;
//# sourceMappingURL=jsUtils.d.ts.map