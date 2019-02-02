import { PwmDriverFacade } from 'mandarin-nest-local-light-driver';
import { Logger } from 'log4js';
export declare class PwmDriverPca9685 extends PwmDriverFacade {
    private driver;
    config: any;
    constructor(config: any, logger: Logger);
    setDutyCycle(colourPin: any, prepared_value: any): void;
}
