import { Logger } from 'log4js';
export declare class TimedLightRegulator {
    private pwmDriver;
    private timer;
    private dbPath;
    private logger;
    constructor(config: any, pwmDriver: any, logger: Logger);
    clearTimersIntervals(): void;
    checkIntervalsAndAjustLightSetting(): void;
    performCheck(): void;
    checkIntervals(intervals: any): void;
    isTimeInCurrentRange(from: any, to: any): boolean;
    getTimeModesIntervals(): Promise<{}>;
    setColors(colors: any): void;
}
