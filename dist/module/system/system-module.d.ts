import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
export declare class SystemModule extends ModuleBase {
    config: any;
    logger: Logger;
    container: any;
    constructor(config: any, logger: Logger, container: any);
    init(): Promise<{}>;
    getRoutesForRegistration(): any;
}
