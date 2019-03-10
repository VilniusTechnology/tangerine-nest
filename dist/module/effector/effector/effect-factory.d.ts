import { Logger } from 'log4js';
export declare class EffectFactory {
    private logger;
    constructor(config: any, logger: Logger);
    convert(json: string): string;
    transpile(object: any): any[];
    buildEffect(effectData: any): any;
}
