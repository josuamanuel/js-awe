export function Timeline(): {
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
//# sourceMappingURL=timeline.d.ts.map