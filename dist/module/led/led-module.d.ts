import { ModuleBase } from './../module-base';
import { TimedLightRegulator } from '../../controller/regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../../driver/pca9685-rgb-cct-driver-manager";
import { Logger } from "log4js";
import { FaderAdvanced } from '../effector/effector/fader-advanced';
import { LedModuleManager } from './led/led-module-manager';
export declare class LedModule extends ModuleBase {
    static readonly AUTO_MODE_CODE = 0;
    static readonly MANUAL_MODE_CODE = 1;
    static readonly TIMED_MODE_CODE = 2;
    static readonly CHECK_MODE_CODE = 3;
    fader: FaderAdvanced;
    logger: Logger;
    ledModuleManager: LedModuleManager;
    protected pwmManager: Pca9685RgbCctDriverManager;
    protected colors: any;
    protected lightSource: any;
    protected timedRegulator: TimedLightRegulator;
    protected lightRegulator: any;
    constructor(config: any, logger: Logger, container: any);
    init(): Promise<{}>;
    getFader(): FaderAdvanced;
    getRoutesForRegistration(): any;
    getRgbCctLedDriver(): void;
}
