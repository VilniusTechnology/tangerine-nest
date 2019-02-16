import { Pca9685RgbCctDriverManager } from "../driver/pca9685-rgb-cct-driver-manager";
export declare class FaderAdvancedDown {
    private resolve;
    private reject;
    private pwmDriver;
    private logger;
    constructor(pwmDriver: Pca9685RgbCctDriverManager, logger: any);
    fadeDown(from: number, to: number, channel: string, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeDown;
    private getPossibleDecrease;
}
