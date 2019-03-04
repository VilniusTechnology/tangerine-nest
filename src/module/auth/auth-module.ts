import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';

const config = require('../../../dist/server/config-loader');

export class AuthModule extends ModuleBase {

    private config;
    public logger: Logger;

    constructor(logger: Logger, container) {
        super(logger, container);

        this.config = config.config;
        this.logger = logger;

        this.logger.debug('AuthModule was constructed.');
    }

    init() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.logger.debug('\x1b[42m \x1b[40m AuthModule was loaded. \x1b[0m');
                resolve({'module': 'AuthModule', container: this});
            }, 1); 
        })
    }

    getRoutesForRegistration() {
        return new Routes(this.logger).listRoutes();
    }
};
