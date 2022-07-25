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

// flutureExt.js

// jsUtils.js

// logLevelExtension.js

// ramdaExt.js

// sanitizer.js

// streamUtils.js
