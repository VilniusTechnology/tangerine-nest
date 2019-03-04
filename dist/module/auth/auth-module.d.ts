import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
export declare class AuthModule extends ModuleBase {
    private config;
    logger: Logger;
    constructor(logger: Logger, container: any);
    init(): Promise<{}>;
    getRoutesForRegistration(): any;
}
