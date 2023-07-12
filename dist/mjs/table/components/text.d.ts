export function Text({ HEADING_IDENTATION, ROW_IDENTATION }?: {
    HEADING_IDENTATION: typeof center;
    ROW_IDENTATION: typeof left;
}): {
    loadParams: (paramId: any) => (paramTitle: any) => {
        id: any;
        load: (columnData: any) => void;
        getSize: () => any;
        heading: {
            nextValue: () => Generator<any, void, unknown>;
        };
        row: {
            nextValue: () => Generator<any, void, unknown>;
        };
    };
};
import { center } from '../tableUtils.js';
import { left } from '../tableUtils.js';
