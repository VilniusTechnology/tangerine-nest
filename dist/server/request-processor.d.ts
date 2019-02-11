import { LedModule } from '../module/led/led-module';
export declare class RequestProcessor {
    private wereLightsRevived;
    private ledModule;
    private logger;
    private timerOfLightAdaptor;
    constructor(LedModule: LedModule, logger: any);
    getLedModule(): LedModule;
    resolveLedMode(query: any): {
        ledMode: number;
    };
    manageModes(query: any): void;
    clearTimersIntervals(): void;
    handleTimedMode(query: any): void;
    handleManualMode(query: any): void;
    returnState(query: any): any;
    prepareResponse(res: any, data: any): void;
}
