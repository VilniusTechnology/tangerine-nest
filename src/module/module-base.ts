import { Logger } from 'log4js';

export class ModuleBase {

    public container: any;
    public logger: Logger;

    constructor(logger: Logger, container) {
        this.logger = logger;
        this.container = container();
    }

    getModule(moduleName: string) {
        return this.container[moduleName];
    }
};
