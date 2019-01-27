import { RgbController } from './../controller/rgb-controller';
export declare class RequestProcessor {
    private wereLightsRevived;
    private rgbController;
    private logger;
    private timerOfLightAdaptor;
    constructor(rgbController: RgbController, logger: any);
    getRgbController(): RgbController;
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
