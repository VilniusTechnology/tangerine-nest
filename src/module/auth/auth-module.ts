import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import { Authorizer } from './authorizer';

const config = require('../../../dist/server/config-loader');

export class AuthModule extends ModuleBase {
    private config;
    public logger: Logger;
    private authorizer: Authorizer;

    constructor(logger: Logger, container) {
        super(logger, container);

        this.config = config.config;
        this.logger = logger;

        this.logger.debug('AuthModule was constructed.');
        this.authorizer = new Authorizer(this.logger)
    }

    init(container) {
        this.logger.info('Will init Auth Module!');
        return new Promise((resolve, reject) => {
            container.add('AuthModule', this);

            resolve({'module': 'AuthModule', container: this});
        });
    }

    public getAuthorizer() {
        return this.authorizer;
    }

    public getRoutesForRegistration() {
        return new Routes(this.logger, this.authorizer).listRoutes();
    }
};
