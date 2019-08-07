import { Logger } from 'log4js';
export declare class JsonEffectExecutor {
    private logger;
    private factory;
    private pwmManager;
    constructor(config: any, logger: Logger);
    performJson(json: any): void;
}
