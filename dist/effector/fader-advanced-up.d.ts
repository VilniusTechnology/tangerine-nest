import { Pca9685RgbCctDriverManager } from "../driver/pca9685-rgb-cct-driver-manager";
export declare class FaderAdvancedUp {
    private resolve;
    private reject;
    private pwmDriver;
    private logger;
    constructor(pwmDriver: Pca9685RgbCctDriverManager, logger: any);
    fadeUp(from: number, to: number, channel: string, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeUp;
    private getPossibleIncrease;
}
