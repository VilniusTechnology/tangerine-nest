import { Logger } from 'log4js';
import { Pca9685RgbCctDriverManager } from '../../driver/pca9685-rgb-cct-driver-manager';
export declare class EffectorModule {
    private config;
    private logger;
    private pwmManager;
    constructor(logger: Logger, pwmManager: Pca9685RgbCctDriverManager);
    getRoutesForRegistration(): any;
}
