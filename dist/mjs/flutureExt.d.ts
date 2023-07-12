import * as F from 'fluture';
export function fletch({ url, options }?: {
    url: any;
    options: any;
}): F.FutureInstance<any, {
    status: any;
    body: any;
}>;
export function promiseFunToFutureFun(futurizePromFun: any): (...input: any[]) => F.FutureInstance<any, any>;
export function ffletchMaker(fetchsDef: any, delay: any): (input: any) => F.FutureInstance<any, any>;
export { F };
