import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
export declare class OpenpixelModule extends ModuleBase {
    private config;
    logger: Logger;
    constructor(logger: Logger, container: any);
    init(container: any): Promise<{}>;
    getRoutesForRegistration(): any;
}
