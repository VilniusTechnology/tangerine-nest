import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';

export class SystemModule extends ModuleBase {

    public config;
    public logger: Logger;
    public container;

    constructor(config, logger: Logger, container) {
        super(logger, container);

        this.config = config.config;
        this.logger = logger;
        this.container = container;

        this.logger.debug('SystemModule was constructed.');
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container).listRoutes();
    }
};
