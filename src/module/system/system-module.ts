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

    init() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.logger.debug('\x1b[42m \x1b[40m AuthModule was loaded. \x1b[0m');
                resolve({'module': 'SystemModule', container: this});
            }, 1); 
        })
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container).listRoutes();
    }
};
