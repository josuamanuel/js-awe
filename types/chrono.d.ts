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
  time(eventNames: string | string[]): void

  /**
   * Stop the timer for the envent/s.
   * @param eventNames name of the event or array with events
   */
  timeEnd(eventNames: string | string[]): void

  /**
   * console.log the following report below:
   * ```
   * chronoCreation :  2023-11-05T11:50:54.798Z
   * report :  2023-11-05T11:50:56.119Z
   * 
   * Timeline of events:
   * ┌────────┬───────────────────────────────────────────────────────────────────────────────────────┐
   * │ Events │ ms 0                                     656                             1198  1300   │
   * ├────────┼───────────────────────────────────────────────────────────────────────────────────────┤
   * │ step1  │    |--------------------------------------|                                        || │
   * │ step2  │                                             |------------------------------------|    │
   * │ step3  │                                              |-----------------------------|          │
   * └────────┴───────────────────────────────────────────────────────────────────────────────────────┘
   * 
   * Total elapse Time of each event: 
   * ┌───────┬────────┬────────────┐
   * │ name  │ elapse │ percentage │
   * ├───────┼────────┼────────────┤
   * │ step1 │ 655    │ 36.85      │
   * │ step2 │ 620    │ 34.86      │
   * │ step3 │ 503    │ 28.29      │
   * └───────┴────────┴────────────┘
   * 
   * Coinciding Events timeline: 
   * ┌───────────────┬──────────┬────────────┐
   * │ runningEvents │ elapseMs │ percentage │
   * ├───────────────┼──────────┼────────────┤
   * │ step1         │ 655      │ 51.39      │
   * │ step2         │ 116      │ 9.16       │
   * │ step2,step3   │ 503      │ 39.45      │
   * └───────────────┴──────────┴────────────┘
   * ```
   */
  report(): void

  /**
   * This is an implementation of Chrono().time() to use in pipeline of functions. Prepaire the time event function that will be
   * triggered in the execution of the pipeline. As this is for logging purposes data is passed to the next function. This function
   * takes the input and passes it to the next function without modifications.
   */
  setTime: (event: string | string[]) => <T>(data: T) => T;

  /**
   * This is an implementation of Chrono().timeEnd() to use in pipeline of functions. Prepaire the timeEnd event function that will be
   * triggered in the execution of the pipeline. As this is for logging purposes data is passed to the next function. This function
   * takes the input and passes it to the next function without modifications.
   */
  setTimeEnd: (event: string | string[]) => <T>(data: T) => T;

  /**
   * This is an implementation of Chrono().report() to use in pipeline of functions. Its execution will log the event reports as in
   * Chrono().report() and returns the same data received as input.
   */
  logReport: <T>(data: T) => T;

  getChronoState: () => {};
  setChronoStateUsingPerformanceAPIFormat: (performanceGetEntriesByTypeOjb: any) => void;
  getChronoStateUsingPerformanceAPIFormat: () => any[];
  average: () => void;
}
export declare function Chrono(): Chrono
//# sourceMappingURL=chrono.d.ts.map