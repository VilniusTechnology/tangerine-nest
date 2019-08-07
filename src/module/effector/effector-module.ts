import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';

const config = require('../../../dist/server/config-loader');

export class EffectorModule extends ModuleBase {

    public config;
    public logger: Logger;

    constructor(logger: Logger, container) {
        super(logger, container);

        this.config = config.config;
        this.logger = logger;

        this.logger.debug('EffectorModule was constructed.');
    }
    
    getRoutesForRegistration() {
        return new Routes(this.logger, this.getModule('LedModule')).listRoutes();
    }
};
