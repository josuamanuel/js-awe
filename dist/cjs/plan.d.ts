export function plan({ numberOfThreads, mockupsObj }?: {
    numberOfThreads?: number;
    mockupsObj?: {};
}): {
    build: (planDef: any) => any;
    map: (fun: any, mapThreads?: number) => (data: any) => any;
};
