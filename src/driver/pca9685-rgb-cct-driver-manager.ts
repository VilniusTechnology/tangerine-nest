import * as _ from 'lodash';
import {Colors} from './entities/colors';
import { Logger } from 'log4js';
import { PwmDriverFacade, PwmDriverEmulator } from 'mandarin-nest-local-light-driver';
import { LedServerConfig } from '../server/model/config-model';
import { PwmDriverPca9685 } from './pwm-driver-pca9685';

export class Pca9685RgbCctDriverManager {
    private logger: Logger;
    private config: any;
    private pwm: PwmDriverFacade;

    public colors: Colors;
    public driver: any;
    public mode: string;

    constructor(config: any, logger: Logger) {
        this.colors = new Colors();
        this.logger = logger;
        this.config = config;
    }

    public setup() {
        if (this.config.ledDriver.driver_type == 'local') {
            this.pwm = new PwmDriverEmulator(this.config, 7777, this.logger);
            this.colors.red.value = 1;
            this.colors.green.value = 2;
            this.colors.blue.value = 3;
            this.logger.info('Local (websockets) LED driver ready! ');
        }

        if (this.config.ledDriver.driver_type == 'i2c') {
            this.pwm = new PwmDriverPca9685(this.config);
            this.logger.info('PCA9685 PWM driver ready! ');
        }
    }

    public setColor(colorName: string, value: number) {
        if(value > 255) {
            this.logger.info('Wants to set too much');
            return;
        }

        if(value < 0) {
            this.logger.info('Wants to set few');
            return;
        }

        let prepared_value = this.getRgbValueInPercents(value);
        let colourPin = this.config.contours.main[colorName];

        this.logger.debug(`Color ${colorName} resolved to PIN: ${colourPin}.`);

        this.pwm.setDutyCycle(colourPin, prepared_value);

        this.colors[colorName] = {'value': value, 'vp': prepared_value};
    };

    public getRgbValueInPercents(raw: number) {
        let value_in_precents = raw / 255;
        return Math.round(Number.parseFloat(value_in_precents.toString()) * 100) / 100;
    };

    public setLedState(newState: number) {
        this.colors.ledState = newState;
    };

    public setLedMode(mode: any) {
        this.mode = mode
    };

    public getLedMode(): any {
        return this.mode;
    };

    public getState(): Colors {
        return this.colors;
    };

    public getPwmDriver() {
        return this.pwm;
    }

    public terminate() {
        this.pwm.terminate();
    }

    public getColors() {
        return this.colors;
    }
};
