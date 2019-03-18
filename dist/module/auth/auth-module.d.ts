import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
import { Authorizer } from './authorizer';
export declare class AuthModule extends ModuleBase {
    private config;
    logger: Logger;
    private authorizer;
    constructor(logger: Logger, container: any);
    getAuthorizer(): Authorizer;
    getRoutesForRegistration(): any;
}
