import loglevel from 'loglevel';
import { formatDate } from './jsUtils.js';
// log acts as a bridge with some ehancements to loglelvel
const log = logAsProxyOfLogLevel();
function logAsProxyOfLogLevel() {
    const formattedDate = formatDate('$YYYY-$MM-$DD $hh:$mm:$ss', new Date());
    const logBridge = {
        get: function (target, prop, receiver) {
            const addPrefix = {
                apply: function (target, thisArg, listOfArg) {
                    return target(`${formattedDate} ${listOfArg.join(' ')} `);
                }
            };
            if (typeof target[prop] === 'function' && ['trace', 'debug', 'info', 'warn', 'error', 'log'].includes(prop))
                return new Proxy(target[prop], addPrefix);
            else if (logBridge[prop] !== undefined)
                return logBridge[prop];
            else
                return target[prop];
        },
        set: function (obj, prop, value) {
            if (logBridge[prop] !== undefined)
                logBridge[prop] = value;
            else
                obj[prop] = value;
            return true;
        }
    };
    return new Proxy(loglevel, logBridge);
}
//log.LEVEL_NUMBER_TO_NAME = ['TRACE', 'DEBUG','INFO','WARN','ERROR', 'SILENT']
log.LEVEL_NUMBER_TO_NAME = Object.entries(loglevel.levels).map(elem => elem[0]);
//log.NAME_TO_LEVEL_NUMBER={ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'SILENT': 5}
log.NAME_TO_LEVEL_NUMBER = { ...loglevel.levels };
function levelName(levelNameOrLevelNumber) {
    if (typeof levelNameOrLevelNumber === 'number')
        return log.LEVEL_NUMBER_TO_NAME[levelNameOrLevelNumber];
    return levelNameOrLevelNumber;
}
function levelNumber(levelNameOrLevelNumber) {
    if (typeof levelNameOrLevelNumber === 'string')
        return log.NAME_TO_LEVEL_NUMBER[levelNameOrLevelNumber.toUpperCase()];
    return levelNameOrLevelNumber;
}
log.levelName = levelName;
log.levelNumber = levelNumber;
export { log };
