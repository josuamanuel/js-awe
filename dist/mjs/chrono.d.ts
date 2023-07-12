export function Chrono(): {
    time: (eventNames: any) => void;
    timeEnd: (eventNames: any) => void;
    report: () => void;
    setTime: (event: any) => (data: any) => any;
    setTimeEnd: (event: any) => (data: any) => any;
    logReport: (data: any) => any;
    timelineLines: () => string;
    getChronoState: () => {};
    setChronoStateUsingPerformanceAPIFormat: (performanceGetEntriesByTypeOjb: any) => void;
    getChronoStateUsingPerformanceAPIFormat: () => never[];
    average: () => void;
    reset: () => void;
};
