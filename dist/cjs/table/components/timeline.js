"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
const jsUtils_js_1 = require("../../jsUtils.js");
const tableUtils_js_1 = require("../tableUtils.js");
const LENGTH_IN_CHARS_OF_INI_END_TIMELINE = 80;
const START_OF_INTERVAL_CHAR = '|';
const END_OF_INTERVAL_CHAR = '|';
const INTERVAL_UNIT_CHAR = '-';
const LAST_SCALE_VALUE_MARGIN = 2;
//if from the oldest start to the newest end the difference in ms < the limit value then scale will be represented
// in this unit.
// The limit is calculated by applying:
//15% of miliseconds of two units above. ex: ms limit is 15% of one minute
const timelineScales = [
    //1000*60*(15/100) 15% of 1 minute
    { limit: 9000, label: 'ms', valueInUnits: start => time => time - start },
    //1000*60*60*(15/100) 15% of 1 hour
    { limit: 540000, label: 'sec', valueInUnits: start => time => Math.floor((time - start) / 1000).toString() },
    //1000*60*60*24*(15/100)
    { limit: 12960000, label: 'min', valueInUnits: start => time => Math.floor((time - start) / 60000).toString() },
    //1000*60*60*24*365*(15/100)
    { limit: 4730400000, label: 'hr', valueInUnits: start => time => Math.floor((time - start) / 3600000).toString() },
    //1000*60*60*24*365*100*(15/100)
    { limit: 473040000000, label: 'day', valueInUnits: start => time => Math.floor((time - start) / 86400000).toString() },
    //1000*60*60*24*365*100*10*(15/100)
    { limit: 4730400000000, label: 'year', valueInUnits: start => time => Math.floor((time - start) / 31536000000).toString() },
    { limit: Infinity, label: 'cen', valueInUnits: start => time => Math.floor((time - start) / 3153600000000).toString() },
];
function drawInterval(line, startInterval, endInterval) {
    let value = START_OF_INTERVAL_CHAR +
        ''.padEnd(endInterval - startInterval - 1, INTERVAL_UNIT_CHAR) +
        END_OF_INTERVAL_CHAR;
    return (0, tableUtils_js_1.putValueAtPos)(line, value, startInterval);
}
function Timeline() {
    let size;
    let id;
    let title;
    let data;
    let scalePoints;
    let resolution;
    let timelineScale;
    function convertToResolution(point) {
        return Math.floor((point - scalePoints[0]) / resolution);
    }
    return {
        loadParams: paramId => paramTitle => {
            id = paramId;
            title = paramTitle;
            return {
                id,
                load: columnData => {
                    data = columnData.map(intervals => intervals.map(interval => {
                        const start = new Date(interval.start).valueOf();
                        const end = new Date(interval.end).valueOf();
                        return {
                            start,
                            end
                        };
                    }));
                    scalePoints =
                        [...new Set(data.flatMap(el => el).reduce((scalePoints, point) => [...scalePoints, point.start, point.end], []).sort((0, jsUtils_js_1.arraySorter)()))];
                    resolution = (scalePoints[scalePoints.length - 1] - scalePoints[0]) / LENGTH_IN_CHARS_OF_INI_END_TIMELINE;
                    let timelineScaleIndex = timelineScales.findIndex(el => (scalePoints[scalePoints.length - 1] - scalePoints[0]) < el.limit);
                    timelineScale = timelineScales[timelineScaleIndex];
                    size = timelineScale.label.length + 1 + LENGTH_IN_CHARS_OF_INI_END_TIMELINE + LAST_SCALE_VALUE_MARGIN;
                },
                getSize: () => size,
                heading: {
                    nextValue: function* () {
                        yield scalePoints.reduce((line, scalePoint) => {
                            return (0, tableUtils_js_1.putCenteredValueAtPosIfFit)(line, timelineScale.valueInUnits(scalePoints[0])(scalePoint), convertToResolution(scalePoint) + 3, 1);
                        }, timelineScale.label + ' ' + ''.padEnd(LENGTH_IN_CHARS_OF_INI_END_TIMELINE + LAST_SCALE_VALUE_MARGIN));
                    }
                },
                row: {
                    nextValue: function* () {
                        for (let intervals of data) {
                            yield intervals.reduce((line, interval) => drawInterval(line, convertToResolution(interval.start) + timelineScale.label.length + 1, convertToResolution(interval.end) + timelineScale.label.length + 1), ''.padEnd(size));
                        }
                    }
                }
            };
        }
    };
}
exports.Timeline = Timeline;
