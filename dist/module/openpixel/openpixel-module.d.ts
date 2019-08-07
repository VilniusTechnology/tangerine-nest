import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
export declare class OpenpixelModule extends ModuleBase {
    private config;
    logger: Logger;
    constructor(logger: Logger, container: any);
    getRoutesForRegistration(): any;
}
