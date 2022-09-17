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
  setTime: (event: any) => (data: any) => any;
  setTimeEnd: (event: any) => (data: any) => any;
  logReport: (data: any) => any;
  getChronoState: () => {};
  setChronoStateUsingPerformanceAPIFormat: (performanceGetEntriesByTypeOjb: any) => void;
  getChronoStateUsingPerformanceAPIFormat: () => any[];
  avarageEvents: () => void;
}
export declare function Chrono(): Chrono
//# sourceMappingURL=chrono.d.ts.map