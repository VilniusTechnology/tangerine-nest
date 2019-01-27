import { PwmDriverFacade } from 'mandarin-nest-local-light-driver/dist/server';
export declare class PwmDriverPca9685 extends PwmDriverFacade {
    private driver;
    config: any;
    constructor();
    setDutyCycle(colourPin: any, prepared_value: any): void;
}
