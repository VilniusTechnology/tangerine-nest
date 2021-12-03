import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';

export class SystemModule extends ModuleBase {

    public config;
    public logger: Logger;
    public container;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;

        this.logger.debug('SystemModule was constructed.');
    }

    init(container) {
        this.logger.info('Will init System Module!');
        return new Promise((resolve, reject) => {
            container.add('SystemModule', this);
            this.container = container;

            resolve({'module': 'SystemModule', container: this});
        });
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container, this.config).listRoutes();
    }
}
