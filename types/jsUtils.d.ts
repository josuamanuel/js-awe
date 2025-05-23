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
 * @param {string} title - The prefix for the log message.
 * @param {(message: T) => string} displayFunc - The function to display the log message.
 * @returns {(message: T) => string} - The log function.
 */
export function logWithPrefix<T>(title: string, displayFunc: (message: T) => string): (message: T) => string;

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export function firstCapital(str: string): string;

/**
 * String template functionality. Given a string with "text {{var1}} text2 {{var2}}"
 * and a state object {var1: 'foo', var2: 'bar'}, it returns a string substituting
 * the template variables for their values. "text foo text2 bar"
 * The state can be a string, an object, or an array.
 * For mode=url, a state array is converted into a list of values separated by commas.
 * For mode=url, a state object is converted into query field=value separated by '&'.
 * If mode is different from 'url', the state is stringified.
 * @param {string} strToResolveVars - The string with variables to be substituted. The string can represent a JSON or URL.
 * @param {Record<string, string>} state - The state with the values to substitute the template variables.
 * @param {string} [mode] - The mode for converting the state. 'url' for converting state arrays into comma-separated field=value1,value2
 * and objects into field=value & field2=value2. If mode is not specified, the state is stringified.
 * @returns {string} - The string after substituting the template variables for their corresponding values from the state object.
 */
export function varSubsDoubleBracket(strToResolveVars: string, state: Record<string, string>, mode?: 'url'): string;

/**
 * Converts a query object to a string representation.
 * @param {Record<string, string>} query - The query object to convert.
 * @returns {string} - The string representation of the query object.
 */
export function queryObjToStr(query: Record<string, string>): string;

/**
 * Converts an Error object to a brief string with stacktrace.
 * @param {Error} error - The Error instance to summarize.
 * @param {number} [maxStackTraces] - The maximum number of stack traces to include in the summary.
 * @returns {string} - A brief string summarizing the error.
 */
export function summarizeError(error: Error, maxStackTraces?: number): string;

/**
 * Custom error class that extends the Error class.
 * @class CustomError
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
  summarizeError(error: CustomError): string;
}

/**
 * Creates a custom error class with the given error name.
 * @param {string} errorName - The name of the custom error class.
 * @returns {typeof CustomError} - The custom error class.
 */
export function createCustomErrorClass(errorName: string): {
  new (name?: string, message?: string, data?: { status: number }): {
    name: string;
    data: { status: number };
    map(func: (value: any) => any): any;
    chain(func: (value: any) => any): any;
    message: string;
    stack?: string;
  };
  of: typeof CustomError;
  captureStackTrace(targetObject: object, constructorOpt?: (...args: any[]) => any): void;
  prepareStackTrace?: (err: Error, stackTraces: NodeJS.CallSite[]) => any;
  stackTraceLimit: number;
};

/**
 * Checks if a type is a basic type primitive: string, number, boolean, symbol, bigint.
 * @param {unknown} variableToCheck - The variable to check.
 * @returns {boolean} - true if the type is a basic type primitive, false otherwise.
 */
export function isBasicType(variableToCheck: unknown): boolean;

/**
 * Composes a URL from the gateway URL, service name, and service path.
 * @param {string} gatewayUrl - The gateway URL.
 * @param {string} serviceName - The service name.
 * @param {string} servicePath - The service path.
 * @returns {object} - The composed URL object.
 */
export function urlCompose(gatewayUrl: string, serviceName: string, servicePath: string): {
  gatewayUrl: string;
  serviceName: string;
  servicePath: string;
  url: string;
};

/**
 * Decomposes a URL into the gateway URL, service name, and service path.
 * @param {string} url - The URL to decompose.
 * @param {string[]} listOfServiceNames - The list of service names.
 * @returns {Array<{ gatewayUrl: string, serviceName: string, servicePath: string }>} - The decomposed URL object.
 */
export function urlDecompose(url: string, listOfServiceNames: string[]): Array<{ gatewayUrl: string, serviceName: string, servicePath: string }>;

/**
 * Returns the index of the nth match of a substring toMatch in the stringToInspect.
 * Returns -1 if the nth match is not found.
 * @param {string} stringToInspect - The string to inspect in.
 * @param {string} toMatch - The substring to match.
 * @param {number} nth - The nth number match to find.
 * @returns {number} - The index of the nth match.
 */
export function indexOfNthMatch(stringToInspect: string, toMatch: string, nth: number): number;



/**
 * Colors a message with the specified color.
 * @param {string} message - The message to color.
 * @param {string} color - The color to apply.
 * @returns {string} - The colored message.
 */
export function colorMessage(message: string, color: string): string;

/**
 * Colors a message based on the status.
 * @param {string} message - The message to color.
 * @param {number} status - The status to determine the color.
 * @returns {string} - The colored message.
 */
export function colorMessageByStatus(message: string, status: number): string;

/**
 * Gets the color based on the status.
 * @param {number} status - The status to determine the color.
 * @returns {string} - The color.
 */
export function colorByStatus(status: number): string;

/**
 * Finds the deep key in an object.
 * @param {object} objIni - The initial object.
 * @param {string} keyToFind - The key to find.
 * @returns {Array<[string[], any]>} - The array of found keys and their values.
 */
export function findDeepKey(objIni: object, keyToFind: string): Array<[string[], any]>;

/**
 * Freezes an object deeply.
 * @param {object} o - The object to freeze.
 * @returns {object} - The frozen object.
 */
export function deepFreeze<T>(o: T): T;

/**
 * Gets the value at the specified path in an object.
 * @param {object} obj - The object to get the value from.
 * @param {string | string[]} valuePath - The path to the value.
 * @returns {any} - The value at the specified path.
 */
export function getAt(obj: object, valuePath: string | string[]): any;

/**
 * Sets the value at the specified path in an object.
 * @param {object} obj - The object to set the value in.
 * @param {string | string[]} valuePath - The path to the value.
 * @param {any} value - The value to set.
 * @returns {string} - The result of setting the value.
 */
export function setAt(obj: object, valuePath: string | string[], value: any): string;

/**
 * Replaces array indices in a path string with asterisks.
 * For example, converts 'users.0.profiles.0.name' to 'users.*.profiles.*.name'.
 * @param {string} path - The path string to process.
 * @returns {string} - The path with array indices replaced by asterisks.
 */
export function pathReplacingArrayIndexWithAsterisk(path: string): string;

/**
 * Remove if exists the '$.' indicating the root of the path.
 * For example, converts '$.users.0.profiles.0.name' to 'users.0.profiles.0.name'.
 * @param {string} path - The path string to process.
 * @returns {string} - The path with array indices replaced by asterisks.
 */
export function stripDollarRoot(path: string): string

/**
 * Creates a sorter function to use as a parameter in array.prototype.sort(sorter).
 * It can order by several fields. If fields are equal, it will uneven using subsequent fields.
 * @param {string | string[]} paths - List of paths to sort by. One path for each field to order by. Route path is of the shape 'person.details.age'. If it is only one field, it can be a string.
 * @param {boolean} [isAsc=true] - Optional. Default: true. true: to order ascending. false: to order descending.
 * @returns {Function} - A sorter function to include in array.prototype.sort(sorter).
 */
export function sorterByPaths(paths: string | string[], isAsc?: boolean): (objA: object, objB: object) => number;

/**
 * Creates a sorter function to use as a parameter in array.prototype.sort(sorter).
 * It can order by several fields and specifying an order by each field.
 * @param {string | string[]} paths - List of paths to sort by. One path for each field to order by. Route path is of the shape 'person.details.age'. If it is only one field, it can be a string.
 * @param {boolean | boolean[]} [isAsc=true] - Optional. Default: true. true: to order ascending. false: to order descending. You can specify an array [true, false] to order by each field.  
 * @returns {Function} - A sorter function to include in array.prototype.sort(sorter).
 */
export function sorterByFields(paths: string | string[], isAsc?: boolean | boolean[]): (objA: object, objB: object) => number;

/**
 * Finds the index of a value in a sorted array.
 * If value is not found, it returns -1
 * @param {Array<string | number | Date>} arr - The sorted array to search in.
 * @param {string | number | Date} val - The value to find in the array.
 * @returns {number} - The index of the value in the array, or -1 if the value is not found.
 */
export function findIndexInSortedArray(arr: Array<string | number | Date>, val: string | number | Date): number;

/**
 * Finds the index of the specified value in a sorted array or the index of the previous value if the specified value is not found.
 * If the value to search for is less than the first value in the array, it returns -1.
 * @param {Array<string | number | Date>} arr - The sorted array to search in.
 * @param {string | number | Date} val - The value to search for.
 * @returns {number} - The index of the specified value in the array, or the index of the previous value if the specified value is not found.
 */
export function findIndexOrPreviousInSortedArray(arr: Array<string | number | Date>, val: string | number | Date): number;

/**
 * Finds the index of the specified value in the sorted array or the next available index if the value is not found.
 * If the value to search for is greater than the last value in the array, it returns the length of the array.
 * @param {Array<string | number | Date>} arr - The sorted array to search in.
 * @param {string | number | Date} val - The value to search for in the array.
 * @returns {number} - The index of the value in the array, or the next available index if the value is not found.
 */
export function findIndexOrNextInSortedArray(arr: Array<string | number | Date>, val: string | number | Date): number;

/**
 * Returns the value if it is not undefined, null or NaN. Otherwise, it returns the default value.
 * @param {any} value - The value to check.
 * @param {any} defaultValue - The default value to return if the value is undefined, null or NaN.
 * @returns {any} - The value or the default value.
 */
export function defaultValue<T>(value: T | undefined | null | number, defaultValue: T): T;

/**
 * Filters and maps an array.
 * @param {(value: any, index: number, array: any[]) => any} mapWithUndefinedFilterFun - The function to map and filter the array.
 * @param {any[]} data - The data to filter and map.
 * @returns {any[]} - The filtered and mapped array.
 */
export function filterFlatMap(mapWithUndefinedFilterFun: (value: any, index: number, array: any[]) => any, data: any[]): any[];

/**
 * Sorts an array in ascending or descending order.
 * @param {boolean} [isAsc=true] - Optional. Default: true. true: to order ascending. false: to order descending.
 * @returns {(a: any, b: any) => number} - A sorter function to use with array.prototype.sort(sorter).
 */
export function arraySorter(isAsc?: boolean): (a: any, b: any) => number;

/**
 * Checks if an object is a Promise.
 * @param {any} obj - The object to check.
 * @returns {boolean} - true if the object is a Promise, false otherwise.
 */
export function isPromise(obj: any): boolean;

/**
 * Sleeps for the specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} - A Promise that resolves after the specified number of milliseconds.
 */
export function sleep(ms: number): Promise<void>;

/**
 * Sleeps for the specified number of milliseconds and resolves with the specified value.
 * @param {number} ms - The number of milliseconds to sleep.
 * @param {T} value - The value to resolve with.
 * @returns {Promise<T>} - A Promise that resolves after the specified number of milliseconds with the specified value.
 */
export function sleepWithValue<T>(ms: number, value: T): Promise<T>;

/**
 * Sleeps for the specified number of milliseconds and executes the specified function with the specified parameters.
 * @param {number} ms - The number of milliseconds to sleep.
 * @param {Function} func - The function to execute.
 * @param {...any} params - The parameters to pass to the function.
 * @returns {Promise<any>} - A Promise that resolves after the specified number of milliseconds with the result of the function.
 */
export function sleepWithFunction(ms: number, func: (...args: any[]) => any, ...params: any[]): Promise<any>;

/**
 * Negates a function.
 * @param {Function} funct - The function to negate.
 * @returns {Function} - The negated function.
 */
export function notTo(funct: (...params: any[]) => boolean): (...params: any[]) => boolean;

/**
 * Converts an array to an object using the specified default value function.
 * @param {any[]} arr - The array to convert.
 * @param {(current: any, index: number) => any} defaultValueFunction - The function to generate the default value.
 * @returns {object} - The converted object.
 */
export function arrayToObject(arr: any[], defaultValueFunction: (current: any, index: number) => any): object;

/**
 * Converts an array of objects to an object.
 * @param {any[]} iterable - The array of objects to convert.
 * @returns {object} - The converted object.
 */
export function arrayOfObjectsToObject(iterable: any[]): object;

/**
 * Removes duplicates from an array.
 * @param {any[]} arr - The array to remove duplicates from.
 * @returns {any[]} - The array without duplicates.
 */
export function removeDuplicates(arr: any[]): any[];

/**
 * Traverses an object and applies a reviver function to each node.
 * @param {object} objIni - The object to traverse.
 * @param {(value: any, path: string[], parent: any, prop: string) => any} reviver - The function to be called for each node.
 * @param {boolean} [pureFunction=true] - true: work with a deep clone of objIni, false: work with objIni passed as a parameter.
 * @returns {object} - The object after applying the reviver actions.
 */
export function traverse(objIni: object, reviver: (value: any, path: string[], parent: any, prop: string) => any, pureFunction?: boolean): object;

/**
 * Takes vertical slices of a two-nested array and calls a function with each slice.
 * @param {(verticalSlice: object[], runIndex: number) => any} functionToRun - The function to run with each vertical slice.
 * @param {string[]} verFields - The fields inside each item of the traverse array that contains the second nested arrays to iterate vertically.
 * @param {object[]} toTraverse - The array to traverse.
 * @returns {void}
 */
export function traverseVertically(functionToRun: (verticalSlice: object[], runIndex: number) => any, verFields: string[], toTraverse: object[]): void;

/**
 * Projects a subset of a JSON object based on specified paths, optionally removing properties marked for deletion.
 * 
 * @param {string[]} paths - An array of strings representing the paths to the properties in the JSON object that should be included in the output.
 * @param {object} json - The JSON object from which the properties specified by paths will be extracted.
 * @param {boolean} [removeWithDelete=true] - A boolean indicating whether properties in the JSON object marked with a specific delete flag should be removed from the output. Defaults to true, meaning properties marked for deletion will be removed.
 * 
 * @returns {object} - A new JSON object containing only the properties specified by the paths array. If removeWithDelete is true, any properties marked for deletion will not be included in the returned object.
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

type BasicType = string | number | boolean | symbol | bigint 
export class EnumMap {
  /**
   * Emulates Enums in JavaScript. 
   * @param {string[] | [BasicType, any][] | {[key: BasicType]: any}[] | Map<BasicType, any>} values - The values to initialize the EnumMap with.
   * @example
   * ```
   * const DAYS = new EnumMap(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
   * DAYS.SUNDAY //? 0
   * DAYS.SATURDAY //? 6
   * const NUM_TO_DAY = DAYS.invert()
   * NUM_TO_DAY[0] //? 'SUNDAY'
   * ```
   */
  constructor(values: any | Map<any, any> | [string, any][] | {[key: string]: any}[]);
  /**
   * Inverts the EnumMap. values are the key, and the keys are the values.
   * @returns {EnumMap} The active enum value.
   * @example
   * ```
   * const DAYS = new EnumMap(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
   * const NUM_TO_DAY = DAYS.invert()
   * NUM_TO_DAY[0] //? 'SUNDAY'
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

/**
  * Number to string with fixed integer and decimals
  * @param num - The number to convert.
  * @param intLength - The length of the integer part.
  * @param decLength - The length of the decimal part.
  * @returns The number as a string with fixed integer and decimal parts.
  * @example
  * ```
  * numberToFixedString(123.456, 5, 2) //?
  * ```
  * This will produce
  * ```
  * '00123.46'
 */
export function numberToFixedString(num:number, intLength:number, decLength:number): string;

type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
type Separator = '/' | '-'
type StringDate = `${number}${Separator}${Month}${Separator}${Day}${string}`;

/**
 * Checks if a value is a valid Date: instance of Date and not NaN.
 * @param value - The value to check.
 * @returns Returns `true` if it is valid date, `false` otherwise.
 */
export function isDate(d: any): boolean;

/**
 * Checks if a value is empty: undefined, null, '', 0, 0n, NaN, [], {}
 * Empty differs from falsy as we have added: [] and {} that are truthy And removed: false 
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
export function formatDate(format: any, date?: Date | StringDate | number): string | undefined;

/**
 * Formats a date.
 * @param format - The format of the date.
 * @returns A function that formats a date.
 */
export function dateFormatter(format: string): (date: Date | StringDate | number) => string | undefined;

/**
 * Represents the days of the week.
 * @type {EnumMap}
 * @example
 * ```
 * DAYS.SUNDAY //? 0
 * DAYS.SATURDAY //? 6
 * DAYS.next(DAYS.SATURDAY) //? 0
 * const NUM_TO_DAY = DAYS.invert()
 * NUM_TO_DAY[0] //? 'SUNDAY'
 * NUM_TO_DAY[6] //? 'SATURDAY'
 * ```
 */
declare const DAYS: EnumMap;
export { DAYS };

/**
 * Convert a string without timezone as UTC time returning the number representing the date in ms
 * @param date - The date string to convert.
 * @returns a number representing the date in ms.
 */
export function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss: string): number;

/**
 * Converts a date object to an object.
 * @param date - The date object to convert.
 * @returns An object literal with numeric properties representing the date.
 */
export function dateToObj(date: Date | StringDate | number): {
  YYYY: number;
  MM: number;
  DD: number;
  hh: number;
  mm: number;
  ss: number;
  mil: number;
} | undefined;

/**
 * Day difference between to dates.
 * @param date - The date object to convert.
 * @returns A number with the difference in days between endDate and iniDate.
 */
export function diffInDaysYYYY_MM_DD(iniDate: Date | StringDate | number, endDate: Date | StringDate | number): number;

/**
 * Adds days to a date.
 * @param daysToSubtract - The number of days to add.
 * @param date - The date to add days to.
 * @returns The date with the added days.
 */
export function addDays(daysToSubtract: number, date: Date | StringDate | number): Date;

/**
 * Subtracts days from a date.
 * @param daysToSubtract - The number of days to subtract.
 * @param date - The date to subtract days from.
 * @returns The date with the subtracted days.
 */
export function subtractDays(daysToSubtract: number, date: Date | StringDate | number): Date;

/**
 * Returns the closest to param date that could be equal or less and that is of a specific dayOfWeek: 0:monday to 6:Sunday.
 * @param dayOfWeek - The day of the week. 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday.
 * @param date - The date subject to calculation. If the date requested correspond to the dayOfWeek, the same input date is returned.
 * @returns The calculated date.
 */
export function previousDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, date: Date | StringDate | number): Date;

/**
 * Returns the closest to param date that could be equal or great and that is of a specific dayOfWeek: 0:monday to 6:Sunday.
 * @param dayOfWeek - The day of the week. 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday.
 * @param date - The date subject to calculation. If the date requested correspond to the dayOfWeek, the same input date is returned.
 * @returns The calculated date.
 */
export function nextDayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, date: Date | StringDate | number): Date;

/**
 * Returns the date in the current week Monday to Sunday that is of a specific day 1:Monday...6:Saturday,0:Sunday
 * @param dayOfWeek - The day of the week. 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday.
 * @param date - The date subject to calculation. If the date requested correspond to the dayOfWeek, the same input date is returned.
 * @returns The calculated date.
 */
export function dayOfWeek(dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6, date: Date | StringDate | number): Date;


/**
 * Gets the same date or the previous Friday for weekends.
 * @param date - The date to get the same date or the previous Friday.
 * @returns The same date or the previous Friday.
 */
export function getSameDateOrPreviousFridayForWeekends(date: Date | StringDate | number): Date;

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
export function setDateToMidnight(date: Date | StringDate | number): Date;

/**
 * Replaces all occurrences of a substring in a string.
 * @param str - The string to replace the substring in.
 * @param fromTo - The substring to replace and the new substring.
 * @returns The string with the replaced substring.
 */
export function replaceAll(str: any, ...fromTo: any[]): any;

/**
 * Cleans a string by removing all non-alphanumeric characters.
 * @param str - The string to clean.
 * @returns The cleaned string.
 */
export function cleanString(str: any): any;

/**
 * Repeats a function a specified number of times.
 * @param numberOfTimes - The number of times to repeat the function.
 * @returns An object with functions to repeat the function.
 */
export function repeat(numberOfTimes: any): {
  times: (funToRepeat: (index?:number)=>any) => any[];
  awaitTimes: (funToRepeat: (index?:number)=>any) => Promise<any[]>;
  breakNextIteration: () => void;
  value: (value: any) => any[];
};


interface CallReset {
  reset: (callAtTheBegginingParam?: boolean) => void;
  stop: () => void;
}

type OneInReturnType = {
  call<T extends (...args: any[]) => any>(runFunc: T): ((...args: Parameters<T>) => ReturnType<T> | undefined) & CallReset;
};


/**
 * Calls a function one in a specified period. It allows to .reset() the counter, .stop() the counter, or to .setCount(newCount) manually
 * @param {number} period - The period in which the function can only be called once.
 * @returns {{ call: (runFunc: Function) => { (...args: any[]): any; reset: () => void; stop: () => void; setCount: (newCount: number) => void; } }}
 * 
 * @example
 * ```
 * const myTraceLog = (logPrefix) => console.log(`${logPrefix} Called`);
 * const callEvery1000 = oneIn(1000).call(myTraceLog);
 * 
 * callEvery1000('LOG: '); // Call the function
 * callEvery1000.toReset(); // Reset the counter
 * callEvery1000.toStop(); // Don't call any longer
 * callEvery1000.setCount(5); // to Call one In 5 times
 * ```
 */
export function oneIn(period: number, callAtTheBeggining?: boolean): OneInReturnType;



export function loopIndexGenerator(initValue: any, iterations: any): Generator<any, void, unknown>;

/**
 * Retries a function with a sleep time between each retry.
 * @template T The type of the parameters for the function to run.
 * @param times The number of times to retry the function.
 * @param updateSleepTimeFun A function that updates the sleep time between retries.
 * @param funToRun The function to run.
 * @param funToRunParams The parameters for the function to run.
 * @param {function} shouldStopRetrying The function that determines whether to stop retrying based on the result of the function.
 * @param {string} logString The fields that the caller to retry wants the retry to Log to show traceability.
 * @returns A Promise that resolves with the result of the function.
 */
export function retryWithSleep<T>(
  times: number,
  updateSleepTimeFun: ((currentSleepTime: number, index: number) => number) | ((currentSleepTime: number) => number) | (() => number),
  funToRun: (...params: T[]) => any,
  funToRunParams: T[] | undefined,
  shouldStopRetrying?: (result?: any) => boolean,
  logString?: string
): Promise<any>;

/**
 * Processes the exit with the given error.
 * @param error - The error object.
 */
export function processExit(error: any): void;
//# sourceMappingURL=jsUtils.d.ts.map