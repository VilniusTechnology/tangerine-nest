import { Logger } from 'log4js';
import { JsonEffectFactory } from './json-effect-factory';
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';


export class JsonEffectExecutor {
    private logger: Logger;
    private factory: JsonEffectFactory;
    private pwmManager: Pca9685RgbCctDriverManager;

    constructor(config: any, logger: Logger) {
        this.logger = logger;
        this.factory = new JsonEffectFactory(config, this.logger);
        this.pwmManager = new Pca9685RgbCctDriverManager(config, logger); 
        this.pwmManager.setup();
    }

    public performJson(json) {
        let effectChain = this.factory.convert(json);
        const pwmManager = this.pwmManager;
        const logger = this.logger;
        this.logger.debug('FINAL built effect: ', JSON.stringify(effectChain, null, 4));
        eval(`${effectChain}`);
    }
}
