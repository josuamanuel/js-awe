"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ffletchMaker = exports.promiseFunToFutureFun = exports.fletch = exports.F = void 0;
const F = __importStar(require("fluture"));
exports.F = F;
const fetchImproved_js_1 = require("./fetchImproved.js");
const { attemptP, Future } = F;
const fletch = ({ url, options } = {}) => attemptP(() => (0, fetchImproved_js_1.fetchImproved)(url, options));
exports.fletch = fletch;
const promiseFunToFutureFun = (futurizePromFun) => (...input) => attemptP(() => futurizePromFun(...input));
exports.promiseFunToFutureFun = promiseFunToFutureFun;
/*
const {  pipe, fork } = F

const ffletch = ffletchMaker([
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  },
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  }
], 50) // Last paramater is the delay to resolve the promise.

ffletch({url: 'customerRef/F3456789'}).pipe(fork(console.log)(console.log))

*/
function ffletchMaker(fetchsDef, delay) {
    //[{input:{url},output:{status,body}]
    let urlToResponse = fetchsDef.reduce((acum, { input, output }) => {
        acum[JSON.stringify(input)] = output;
        return acum;
    }, {});
    function ffletch(input) {
        const key = JSON.stringify(input);
        const ffletchResolution = (resolve, reject) => {
            if (urlToResponse[key] === undefined) {
                reject(new Error(`Fake Response not found for Request with key: ${key} in ${urlToResponse}`));
                return;
            }
            if (urlToResponse[key].status >= 600) {
                reject(new Error(JSON.stringify(urlToResponse[key].body), null, 2));
                return;
            }
            resolve({
                status: urlToResponse[key].status,
                body: urlToResponse[key].body,
            });
            return;
        };
        return Future((reject, resolve) => {
            setTimeout(() => ffletchResolution(resolve, reject), parseInt(delay, 10) || 0);
            return function onCancel() {
                // Clearing the timeout releases the resources we were holding.
                //clearTimeout (timeoutId)
            };
        });
    }
    return ffletch;
}
exports.ffletchMaker = ffletchMaker;
