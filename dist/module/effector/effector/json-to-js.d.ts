import { Logger } from 'log4js';
export declare class EffectExecutor {
    private logger;
    private factory;
    private pwmManager;
    constructor(config: any, logger: Logger);
    performJson(json: any): void;
}
