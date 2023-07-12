export function Table(data: any): {
    addColumn: ({ type, id, title }: {
        type: any;
        id: any;
        title: any;
    }) => {
        addColumn: any;
        draw: () => string;
    };
    auto: () => {
        draw: () => string;
    };
    draw: () => string;
};
export const Index: unique symbol;
export function consoleTable(toLog: any): void;
export function consoleTableExtended(toLog: any): void;
