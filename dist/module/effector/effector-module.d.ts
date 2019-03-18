import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
export declare class EffectorModule extends ModuleBase {
    config: any;
    logger: Logger;
    constructor(logger: Logger, container: any);
    getRoutesForRegistration(): any;
}
