import { PwmDriverFacade } from 'tangerine-nest-local-light-driver';
import { Logger } from 'log4js';
export declare class PwmDriverPca9685 extends PwmDriverFacade {
    private driver;
    private logger;
    config: any;
    constructor(config: any, logger: Logger);
    init(): Promise<{}>;
    setDutyCycle(colourPin: any, prepared_value: any): void;
}
