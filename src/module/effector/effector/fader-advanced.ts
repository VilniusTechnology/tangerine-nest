import { FaderAdvancedUp } from './fader-advanced-up';
import { FaderAdvancedDown } from './fader-advanced-down';
import { PwmDriverFacade } from 'tangerine-nest-local-light-driver';
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';
import { Logger } from 'log4js';

export class FaderAdvanced {
    private faderUp: FaderAdvancedUp;
    private faderDown: FaderAdvancedDown;
    private pwmDriver: Pca9685RgbCctDriverManager;
    private logger: Logger;

    constructor(pwmDriver: Pca9685RgbCctDriverManager, logger: Logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger;

        this.faderUp = new FaderAdvancedUp(this.pwmDriver, logger);
        this.faderDown = new FaderAdvancedDown(this.pwmDriver, logger);
    }

    public fadeUp(from: number, to: number, channel: string ,timeout: number, step: number = 1) {
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

    public fadeDown(from: number, to: number, channel: string, timeout: number, step: number = 1) {
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

    public fullOn(channel: string) {
        this.pwmDriver.setColor(channel, 1);
    }

    public fullOff(channel: string) {
        this.pwmDriver.setColor(channel, 0);
    }

    public getPwmDriverManager() {
        return this.pwmDriver;
    }

    public getLogger() {
        return this.logger;
    }

    public performBootDemo() {
        this.logger.error('This is only MOCK :( !!!');
    }
}
