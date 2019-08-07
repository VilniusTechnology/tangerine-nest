import { Logger } from 'log4js';
export declare class JsonEffectFactory {
    private logger;
    constructor(config: any, logger: Logger);
    convert(json: string): string;
    transpile(object: any): any[];
    private isEffectDataValid;
    private validateColorName;
    private isNumeric;
    buildEffect(effectData: any): any;
}
