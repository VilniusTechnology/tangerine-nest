import { Colors } from './model/colors';
import * as _ from 'lodash';
import { Logger } from 'log4js';
import { PwmDriverEmulator } from 'tangerine-nest-local-light-driver';
import { PwmDriverPca9685 } from './pwm-driver-pca9685';

export class Pca9685RgbCctDriverManager {
    private logger: Logger;
    private config: any;
    private pwm;

    public colors: Colors;
    public driver: any;
    public mode: string;

    constructor(config: any, logger: Logger) {
        this.colors = new Colors();
        this.logger = logger;
        this.config = config.ledDriver;
    }

    public setup() {
        return new Promise( (resolve, reject) => {

            const config = this.config.driver;
            const driver_type = this.config.driver_type
            
            if (driver_type == 'local') {
                this.logger.info('pwmManager will launch in local (emulated mode).'); 
                this.colors.red.value = 1;
                this.colors.green.value = 2;
                this.colors.blue.value = 3;

                this.logger.warn('Further PWM driver Emulator configuration and bootstraping will commence after first client is connected !!!');
                this.logger.warn('USE UI: Login go tu EMULATOR and emulator shouold start !!!');

                this.pwm = new PwmDriverEmulator(this.config, 7777, this.logger);
                this.pwm.onClientConnect()
                    .then( (connected) => {
                        this.logger.info(`Local (websockets) LED driver ready!`);
                        this.logger.info(`First client IP: ${connected}`);
                    });
                // this.logger.error(0, this.pwm);
                resolve(true);
            }

            if (driver_type == 'i2c') {
                this.logger.info('pwmManager will launch in i2c.', config); 

                this.pwm = new PwmDriverPca9685(config, this.logger);
                this.pwm.init()
                .then( (data: any) =>{
                    this.logger.info('PCA9685 PWM driver ready! ');
                    resolve(data);
                    
                })
                .catch((data: any) =>{
                    this.logger.error(`PCA9685 PWM driver error 001! : ${data} `);
                    this.logger.error(config);
                    reject({deep: data, config: config});
                });
            }
        });
    }

    public setColor(colorName: string, value: number) {
        if(value > 255) {
            this.logger.warn('Wants to set too much');
            return;
        }

        if(value < 0) {
            this.logger.warn('Wants to set few');
            return;
        }

        let prepared_value = this.getRgbValueInPercents(value);
        let colourPin = this.config.contours.main[colorName];

        // this.logger.debug(`Color ${colorName} resolved to PIN: ${colourPin}.`);

        this.pwm.setDutyCycle(colourPin, prepared_value, colorName);

        this.colors[colorName] = {'value': value, 'vp': prepared_value};
    };

    public getRgbValueInPercents(raw: number) {
        let value_in_precents = raw / 255;
        return Math.round(Number.parseFloat(value_in_precents.toString()) * 100) / 100;
    };

    public setLedState(newState: number) {
        this.colors.ledState = newState;
        // this.logger.debug(`setLedState::this.colors.ledState: ${this.colors.ledState}.`);
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

    public getFullState() {
        return {colors: this.colors, mode: this.getLedMode()};
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
