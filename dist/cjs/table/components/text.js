"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const tableUtils_js_1 = require("../tableUtils.js");
function Text({ HEADING_IDENTATION, ROW_IDENTATION } = { HEADING_IDENTATION: tableUtils_js_1.center, ROW_IDENTATION: tableUtils_js_1.left }) {
    let size;
    let id;
    let title;
    let data;
    return {
        loadParams: paramId => paramTitle => {
            id = paramId;
            title = paramTitle;
            return {
                id,
                load: columnData => {
                    data = columnData;
                    size = data.reduce((acum, current) => {
                        let currentCellLength = ('' + (current !== null && current !== void 0 ? current : '')).length;
                        if (acum < currentCellLength)
                            return currentCellLength;
                        else
                            return acum;
                    }, title.length);
                },
                getSize: () => size,
                heading: {
                    nextValue: function* () {
                        yield HEADING_IDENTATION(title, size);
                    }
                },
                row: {
                    nextValue: function* () {
                        for (let el of data)
                            yield ROW_IDENTATION('' + (el !== null && el !== void 0 ? el : ''), size);
                    }
                }
            };
        }
    };
}
exports.Text = Text;
