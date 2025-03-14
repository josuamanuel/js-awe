type PlanOptions = {
  numberOfThreads?: number;
  mockupsObj?: object;
};

type Plan = {
  /**
   * ```plainText
   *        |-> fun2A -> fun3-|
   * fun1 --|                 |-> fun5
   *        |-> fun2B -> fun4-|
   *              
   * ```
   *
   * ```javascript
   * const myCalc = plan().build([
   *   fun1,                      
   *   [fun2A, fun3],
   *   [fun2B, fun4],
   *   fun5                  
   * ])
   * ```
   */
  build: (planDef: any[]) => (...args: any[]) => any;
  /**
   * plan utility function to wrap a function to use in a plan pipeline. The tipical scenario for using this is:
   * ```javascript
   * plan().build(
   *  [
   *     queryAllCustomersWithBalanceGreatThan2000,
   *     map(fetchAddres, 5) // mapThreads = 5
   *  ]
   * )
   * ```
   * As queryAllCustomersWithBalanceGreatThan2000 could return 50k customers. We could be banned for the fetchAddress API.
   * so we need to call in batch of 5 calls. This does not affect the the default value numberOfThreads=Infinity for the 
   * rest of the pipeline.
   * @param fun function to apply to every element of the input.
   * @param mapThreads The functions will be run in batchs of size mapThreads.
   * @returns a function that can be included in the pipeline.
   */
  map: (fun: (data: any ) => any, mapThreads?: number) => (data: any) => any[];
  identity: <T>(param: T) => T;
};

/**
 * ```plainText
 *        |-> fun2A -> fun3-|
 * fun1 --|                 |-> fun5
 *        |-> fun2B -> fun4-|
 *              
 * ```
 * ```javascript
 * const myCalc = plan().build([
 *   fun1,                      
 *   [fun2A, fun3],
 *   [fun2B, fun4],
 *   fun5                  
 * ])
 *
 * myCalc(3).then(result => console.log(result))
 * ```
 * 
 * @param options: { numberOfThreads: 3 (default Infinity) 
 * , mockupsObj {fun1:3,fun5:Promise.resolve(4)}} (substitute the function for a value) } 
 * @return An object with two method functions: build, plan
 */
export function plan(options?: PlanOptions): Plan;


//# sourceMappingURL=plan.d.ts.map