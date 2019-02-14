import { FaderAdvancedUp } from './fader-advanced-up';
import { FaderAdvancedDown } from './fader-advanced-down';
import { PwmDriverFacade } from 'tangerine-nest-local-light-driver';

export class FaderAdvanced {
    private faderUp: FaderAdvancedUp;
    private faderDown: FaderAdvancedDown;
    private pwmDriver: PwmDriverFacade;

    constructor(pwmDriver: PwmDriverFacade) {
        this.pwmDriver = pwmDriver;

        this.faderUp = new FaderAdvancedUp(this.pwmDriver);
        this.faderDown = new FaderAdvancedDown(this.pwmDriver);
    }

    public fadeUp(from: number, to: number, channel: number ,timeout: number, step: number = 1) {
        return new Promise((resolve, reject) => {
            this.faderUp.fadeUp(from, to, channel, timeout, step)
            .then( (data) => {
                resolve(data);
            })
            .catch( (data) => {
                reject(data);
            });
        });
    }

    public fadeDown(from: number, to: number, channel: number, timeout: number, step: number = 1) {
        return new Promise((resolve, reject) => {
            this.faderDown.fadeDown(from, to, channel, timeout, step)
            .then( (data) => {
                resolve(data);
            })
            .catch( (data) => {
                reject(data);
            });
        });
    }

    public fullOn(channel: number) {
        this.pwmDriver.setDutyCycle(channel, 1);
    }

    public fullOff(channel: number) {
        this.pwmDriver.setDutyCycle(channel, 0);
    }
}
