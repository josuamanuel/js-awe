'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseAll = exports.wildcardToRegExp = exports.cloneCopy = void 0;
const just_clone_1 = __importDefault(require("just-clone"));
const jsUtils_js_1 = __importDefault(require("./jsUtils.js"));
function cloneCopy(to, from, firstCleanTo, shallow) {
    if (firstCleanTo) {
        Object.setPrototypeOf(to, Object.getPrototypeOf(from));
        for (let prop in to) {
            if (to.hasOwnProperty(prop)) {
                delete to[prop];
            }
        }
    }
    if (shallow) {
        for (let prop in from) {
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }
    }
    else {
        for (let prop in from) {
            if (from.hasOwnProperty(prop)) {
                to[prop] = (0, just_clone_1.default)(from[prop]); //, reviverPromiseForCloneDeep)
            }
        }
    }
    return to;
}
exports.cloneCopy = cloneCopy;
function wildcardToRegExp(pathSearch, flagsString, separator = '.') {
    let escSeparator = escapeRegExp(separator);
    let result = pathSearch.split(separator).join(`${escSeparator}`);
    result = result.split('*').join(`[^${escSeparator}]*`);
    result = result.split(`[^${escSeparator}]*[^${escSeparator}]*`).join('.*');
    result = '^' + result + '$';
    let regExToReturn = new RegExp(result, flagsString);
    return regExToReturn;
}
exports.wildcardToRegExp = wildcardToRegExp;
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function promiseAll(obj) {
    let objRoot = { root: obj };
    let toReturn = promiseAllRec(objRoot);
    if (jsUtils_js_1.default.isPromise(toReturn) === false) {
        toReturn = Promise.resolve(toReturn);
    }
    return toReturn.then(objRoot => objRoot.root);
    function promiseAllRec(objRoot) {
        const arrayOfPromises = [];
        const arrayOfRefToPromises = [];
        jsUtils_js_1.default.traverse(objRoot, (ref, _undefined, parent, son) => {
            if (jsUtils_js_1.default.isPromise(ref)) {
                arrayOfPromises.push(ref);
                arrayOfRefToPromises.push({ parent, son });
            }
        }, false);
        if (arrayOfPromises.length > 0) {
            return Promise.all(arrayOfPromises)
                .then((arrayOfResolutions) => {
                arrayOfResolutions.map((resolution, index) => {
                    arrayOfRefToPromises[index].parent[arrayOfRefToPromises[index].son] = resolution;
                });
                return promiseAllRec(objRoot);
            });
        }
        else
            return objRoot;
    }
}
exports.promiseAll = promiseAll;
