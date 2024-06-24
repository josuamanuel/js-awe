/**
 * Create events by calling time(eventNames) and finish them by calling 
 * timeEnd(eventNames). You can print the result in console by calling
 * report()
 */
export declare interface Chrono {

  /**
   * Create event/s and start the timer.
   * @param eventNames Name of the event or array with event names.
   * @example
   * // Single event
   * chrono.time('step1');
   * 
   * // Multiple events
   * chrono.time(['step1', 'step2']);
   */
  time(eventNames: string | string[]): void;

  /**
   * Stop the timer for the event/s.
   * @param eventNames Name of the event or array with event names.
   * @example
   * // Single event
   * chrono.timeEnd('step1');
   * 
   * // Multiple events
   * chrono.timeEnd(['step1', 'step2']);
   */
  timeEnd(eventNames: string | string[]): void

  /**
   * Print the report of the events in the console.
   */
  report(): void

  /**
   * This is an implementation of Chrono().time() to use in a pipeline of functions. Prepare the time event function that will be
   * triggered in the execution of the pipeline. As this is for logging purposes, data is passed to the next function. This function
   * takes the input and passes it to the next function without modifications.
   * @param event Name of the event or array with event names.
   * @returns A function that takes the input data and passes it to the next function without modifications.
   * @example
   * const pipeline = [
   *   chrono.setTime('step1'),
   *   // other functions in the pipeline
   * ];
   * 
   * const result = pipeline.reduce((data, fn) => fn(data), inputData);
   */
  setTime: (event: string | string[]) => <T>(data: T) => T;

  /**
   * This is an implementation of Chrono().timeEnd() to use in a pipeline of functions. Prepare the timeEnd event function that will be
   * triggered in the execution of the pipeline. As this is for logging purposes, data is passed to the next function. This function
   * takes the input and passes it to the next function without modifications.
   * @param event Name of the event or array with event names.
   * @returns A function that takes the input data and passes it to the next function without modifications.
   * @example
   * const pipeline = [
   *   // other functions in the pipeline
   *   chrono.setTimeEnd('step1'),
   * ];
   * 
   * const result = pipeline.reduce((data, fn) => fn(data), inputData);
   */
  setTimeEnd: (event: string | string[]) => <T>(data: T) => T;

  /**
   * This is an implementation of Chrono().report() to use in a pipeline of functions. Its execution will log the event reports as in
   * Chrono().report() and returns the same data received as input.
   * @returns A function that takes the input data, logs the event reports, and returns the same data.
   * @example
   * const pipeline = [
   *   // other functions in the pipeline
   *   chrono.logReport,
   * ];
   * 
   * const result = pipeline.reduce((data, fn) => fn(data), inputData);
   */
  logReport: <T>(data: T) => T;

  /**
   * Get the current state of the Chrono timer.
   * @returns The current state of the Chrono timer.
   */
  getChronoState: () => {};

  /**
   * Set the Chrono timer state using the Performance API format.
   * @param performanceGetEntriesByTypeOjb The Performance API object returned by `performance.getEntriesByType('measure')`.
   */
  setChronoStateUsingPerformanceAPIFormat: (performanceGetEntriesByTypeOjb: any) => void;

  /**
   * Get the Chrono timer state using the Performance API format.
   * @returns The Chrono timer state in the Performance API format.
   */
  getChronoStateUsingPerformanceAPIFormat: () => any[];

  /**
   * Calculate the average time for each event.
   */
  average: () => void;
}
export declare function Chrono(): Chrono
//# sourceMappingURL=chrono.d.ts.map