import { Logger } from 'log4js';

export class ModuleBase {

    public container: any;
    public logger: Logger;

    constructor(logger: Logger, container) {
        this.logger = logger;
        this.container = container();
    }

    init() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const moduleClassName = this.constructor.name
                this.logger.debug(`\x1b[42m \x1b[40m ${moduleClassName} was loaded. \x1b[0m`);
                resolve({'module': moduleClassName, container: this});
            }, 1); 
        })
    }

    getModule(moduleName: string) {
        return this.container[moduleName];
    }
};
