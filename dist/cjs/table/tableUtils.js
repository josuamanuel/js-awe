"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putValueAtPos = exports.putCenteredValueAtPosIfFit = exports.right = exports.left = exports.center = void 0;
function center(text, size) {
    let sizeInt = parseInt(size, 10);
    if (typeof text !== 'string' || isNaN(sizeInt))
        return text;
    const trimText = text.trim();
    if (trimText.length >= sizeInt)
        return trimText;
    const leftPadding = Math.floor((sizeInt - trimText.length) / 2);
    const rightPadding = sizeInt - trimText.length - leftPadding;
    return ''.padEnd(leftPadding) + trimText + ''.padEnd(rightPadding);
}
exports.center = center;
function left(text, size) {
    let sizeInt = parseInt(size, 10);
    if (typeof text !== 'string' || isNaN(sizeInt))
        return text;
    const trimText = text.trim();
    if (trimText.length >= sizeInt)
        return trimText;
    return trimText.padEnd(sizeInt);
}
exports.left = left;
function right(text, size) {
    let sizeInt = parseInt(size, 10);
    if (typeof text !== 'string' || isNaN(sizeInt))
        return text;
    const trimText = text.trim();
    if (trimText.length >= sizeInt)
        return trimText;
    return trimText.padStart(sizeInt);
}
exports.right = right;
function putCenteredValueAtPosIfFit(line, value, pos, margins) {
    let valueStr = '' + value;
    let rightHalf = Math.floor((valueStr.length - 1) / 2);
    let leftHalf = valueStr.length - 1 - rightHalf;
    if (line.length < pos + rightHalf + margins ||
        line
            .substring(pos - leftHalf - margins, pos + rightHalf + margins)
            .split('')
            .some((el) => el !== ' '))
        return line;
    else {
        return line.substring(0, pos - leftHalf) + valueStr + line.substring(pos + rightHalf + 1);
    }
}
exports.putCenteredValueAtPosIfFit = putCenteredValueAtPosIfFit;
//let asas =               'ms 0 2300  112  ' //?
//putInLineScaleValueAtPos('ms 0 2300       ', 112, 12, 2) //?
function putValueAtPos(line, value, pos) {
    return line.substring(0, pos) + value + line.substring(pos + value.length);
}
exports.putValueAtPos = putValueAtPos;
