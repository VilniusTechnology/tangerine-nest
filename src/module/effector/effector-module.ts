import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {Container} from "../container";

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

    init(container: Container) {
        this.logger.info('Will init Effector Module!');
        return new Promise((resolve, reject) => {
            container.add('EffectorModule', this);

            this.container = container;

            resolve({'module': 'EffectorModule', container: this});
        });
    }
    
    getRoutesForRegistration() {
        return new Routes(this.logger, this.container.get('LedModule')).listRoutes();
    }
}
