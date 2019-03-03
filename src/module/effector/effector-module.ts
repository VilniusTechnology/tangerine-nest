import { Logger } from 'log4js';
import { Routes } from './routes';
import { Pca9685RgbCctDriverManager } from '../../driver/pca9685-rgb-cct-driver-manager';

const config = require('../../../dist/server/config-loader');

export class EffectorModule {

    private config;
    private logger: Logger;
    private pwmManager: Pca9685RgbCctDriverManager;

    constructor(logger: Logger, pwmManager: Pca9685RgbCctDriverManager) {
        this.config = config.config;
        this.logger = logger;
        this.pwmManager = pwmManager;

        this.logger.debug('EffectorModule was constructed.');
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.pwmManager).listRoutes();
    }
};
