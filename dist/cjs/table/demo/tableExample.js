"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_js_1 = require("../table.js");
const text_js_1 = require("../components/text.js");
const timeline_js_1 = require("../components/timeline.js");
const timelineData = [
    {
        event: 'getHoldings',
        intervals: [
            {
                start: new Date('2020-02-03T14:00:12.012Z'),
                end: new Date('2020-02-03T14:00:12.215Z'),
                //end: new Date("2020-02-03T14:00:13.215Z"),
            },
            {
                start: new Date('2020-02-03T14:00:13.000Z'),
                end: new Date('2020-02-03T14:00:13.215Z'),
            },
        ],
    },
    {
        event: 'getAccounts',
        intervals: [
            {
                start: new Date('2020-02-03T14:00:12.290Z'),
                end: new Date('2020-02-03T14:00:12.800'),
            },
        ],
    },
    {
        event: 'getCards',
        intervals: [
            {
                start: new Date('2020-02-03T14:00:12.288Z'),
                end: new Date('2020-02-03T14:00:13.100Z'),
            },
        ],
    },
];
const timeline = (0, table_js_1.Table)(timelineData);
// Columns will be painted in the same order that there were added with addColumn
console.log(timeline
    .addColumn({ type: (0, text_js_1.Text)(), id: 'event', title: 'Events' })
    .addColumn({ type: (0, timeline_js_1.Timeline)(), id: 'intervals' })
    .addColumn({ type: (0, text_js_1.Text)(), id: 'event', title: 'Events2' })
    .draw());
console.log((0, table_js_1.Table)({
    '2022-01-01': { a: 1, beespot: 2 },
    '2022-01-02': { a: 3, beespot: 4 },
    '2022-01-03': { a: 5, beespot: 6 },
})
    .addColumn({ type: (0, text_js_1.Text)(), id: table_js_1.Index, title: 'The date that is the index' })
    .addColumn({ type: (0, text_js_1.Text)(), id: 'a', title: 'This is a' })
    .addColumn({ type: (0, text_js_1.Text)(), id: 'beespot', title: 'b' })
    .draw());
console.log((0, table_js_1.Table)([
    { a: 1, b: 2 },
    { a: 3, b: 443 },
    { a: 5, b: 6 },
])
    .auto()
    .draw());
console.log((0, table_js_1.Table)(timelineData).auto().draw());
let semaforoAlcistaExample = [
    {
        symbol: 'DTY.L',
        RIC: undefined,
        name: 'Dignity PLC',
        refIndex: 'T5700P',
        refIndexDesc: 'EU Travel & Leisure',
        close: '550.00',
        stopLoss: '500.26',
    },
    {
        symbol: 'PTEC.L',
        RIC: 'PTEC.L',
        name: 'Playtech',
        refIndex: 'T5700P',
        refIndexDesc: 'EU Travel & Leisure',
        close: '573.50',
        stopLoss: '541.65',
    },
    {
        symbol: 'FPE.DE',
        RIC: 'FPEG.DE',
        name: 'Fuchs Petrolub AG',
        refIndex: 'SX4P',
        refIndexDesc: 'EU 600 Chemicals',
        close: '32.35',
        stopLoss: '29.75',
    },
];
console.log((0, table_js_1.Table)(semaforoAlcistaExample).auto().draw());
console.log((0, table_js_1.Table)([]).auto().draw());
console.log((0, table_js_1.Table)([{}]).auto().draw());
console.log((0, table_js_1.Table)([undefined, { a: 2 }, { b: undefined }])
    .auto()
    .draw());
