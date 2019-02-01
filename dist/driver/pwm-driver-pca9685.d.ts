import { PwmDriverFacade } from 'mandarin-nest-local-light-driver';
export declare class PwmDriverPca9685 extends PwmDriverFacade {
    private driver;
    config: any;
    constructor(config: any);
    setDutyCycle(colourPin: any, prepared_value: any): void;
}
