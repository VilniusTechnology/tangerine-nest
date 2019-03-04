import { LedModuleManager } from '../module/led/led/led-module-manager';
export declare class RequestProcessor {
    private wereLightsRevived;
    private ledModuleManager;
    private logger;
    private timerOfLightAdaptor;
    constructor(ledModuleManager: LedModuleManager, logger: any);
    getLedModule(): LedModuleManager;
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
