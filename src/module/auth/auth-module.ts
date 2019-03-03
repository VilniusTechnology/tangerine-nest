import { Logger } from 'log4js';
import { Routes } from './routes';

const config = require('../../../dist/server/config-loader');

export class AuthModule {

    private db;
    private config;
    private logger: Logger;

    constructor(logger: Logger) {
        this.config = config.config;
        this.logger = logger;
        this.logger.debug('AuthModule was constructed.');
    }

    getRoutesForRegistration() {
        return new Routes(this.logger).listRoutes();
    }
};
