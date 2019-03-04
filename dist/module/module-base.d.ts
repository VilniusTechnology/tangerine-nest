import { Logger } from 'log4js';
export declare class ModuleBase {
    container: any;
    logger: Logger;
    constructor(logger: Logger, container: any);
    getModule(moduleName: string): any;
}
