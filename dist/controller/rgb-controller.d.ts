import { Fader } from './../effector/fader';
import { TimedLightRegulator } from './regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../driver/pca9685-rgb-cct-driver-manager";
import { Logger } from "log4js";
export declare class RgbController {
    static readonly AUTO_MODE_CODE = 0;
    static readonly MANUAL_MODE_CODE = 1;
    static readonly TIMED_MODE_CODE = 2;
    static readonly CHECK_MODE_CODE = 3;
    protected pwmManager: Pca9685RgbCctDriverManager;
    protected logger: Logger;
    protected colors: any;
    protected lightSource: any;
    protected timedRegulator: TimedLightRegulator;
    protected fader: Fader;
    protected lightRegulator: any;
    constructor(config: any, logger: Logger);
    setColours(colors: any): void;
    switchAllLedsOff(): void;
    switchAllLedsOn(): void;
    getState(): any;
    clearTimersIntervals(): void;
    setTimedSettings(): void;
    adaptLight(): Promise<void>;
    performBootDemo(): Promise<void>;
    getLedMode(): any;
    setMode(mode: any): void;
    getRgbCctLedDriver(): Pca9685RgbCctDriverManager;
}
