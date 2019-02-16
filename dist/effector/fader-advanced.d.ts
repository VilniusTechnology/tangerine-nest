import { Pca9685RgbCctDriverManager } from '../driver/pca9685-rgb-cct-driver-manager';
export declare class FaderAdvanced {
    private faderUp;
    private faderDown;
    private pwmDriver;
    private logger;
    constructor(pwmDriver: Pca9685RgbCctDriverManager, logger: any);
    fadeUp(from: number, to: number, channel: string, timeout: number, step?: number): Promise<{}>;
    fadeDown(from: number, to: number, channel: string, timeout: number, step?: number): Promise<{}>;
    fullOn(channel: string): void;
    fullOff(channel: string): void;
}
