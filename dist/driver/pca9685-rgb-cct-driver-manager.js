"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tangerine_nest_local_light_driver_1 = require("tangerine-nest-local-light-driver");
const pwm_driver_pca9685_1 = require("./pwm-driver-pca9685");
const colors_1 = require("tangerine-nest-local-light-driver/dist/model/color/colors");
class Pca9685RgbCctDriverManager {
    constructor(config, logger) {
        this.colors = new colors_1.Colors();
        this.logger = logger;
        this.config = config.ledDriver;
    }
    setup() {
        return new Promise((resolve, reject) => {
            const config = this.config.driver;
            const driver_type = this.config.driver_type;
            if (driver_type == 'local') {
                this.logger.info('pwmManager will launch in local (emulated mode).');
                this.colors.red.value = 1;
                this.colors.green.value = 2;
                this.colors.blue.value = 3;
                this.logger.info('Further configuration and bootstraping will commence after first client is connected !!!');
                this.pwm = new tangerine_nest_local_light_driver_1.PwmDriverEmulator(config, 7777, this.logger);
                this.pwm.onClientConnect()
                    .then((connected) => {
                    this.logger.info(`Local (websockets) LED driver ready!`);
                    this.logger.info(`First client IP: ${connected}`);
                    resolve(true);
                });
            }
            if (driver_type == 'i2c') {
                this.logger.info('pwmManager will launch in i2c.');
                this.pwm = new pwm_driver_pca9685_1.PwmDriverPca9685(config, this.logger);
                this.pwm.init()
                    .then((data) => {
                    this.logger.info('PCA9685 PWM driver ready! ');
                    resolve(data);
                })
                    .catch((data) => {
                    this.logger.error(`PCA9685 PWM driver error! : ${data} `);
                    this.logger.error(`Config : ${config} `);
                    reject({ deep: data, config: config });
                });
            }
        });
    }
    setColor(colorName, value) {
        if (value > 255) {
            this.logger.info('Wants to set too much');
            return;
        }
        if (value < 0) {
            this.logger.info('Wants to set few');
            return;
        }
        let prepared_value = this.getRgbValueInPercents(value);
        let colourPin = this.config.contours.main[colorName];
        this.logger.debug(`Color ${colorName} resolved to PIN: ${colourPin}.`);
        this.pwm.setDutyCycle(colourPin, prepared_value);
        this.colors[colorName] = { 'value': value, 'vp': prepared_value };
    }
    ;
    getRgbValueInPercents(raw) {
        let value_in_precents = raw / 255;
        return Math.round(Number.parseFloat(value_in_precents.toString()) * 100) / 100;
    }
    ;
    setLedState(newState) {
        this.colors.ledState = newState;
    }
    ;
    setLedMode(mode) {
        this.mode = mode;
    }
    ;
    getLedMode() {
        return this.mode;
    }
    ;
    getState() {
        return this.colors;
    }
    ;
    getPwmDriver() {
        return this.pwm;
    }
    terminate() {
        this.pwm.terminate();
    }
    getColors() {
        return this.colors;
    }
}
exports.Pca9685RgbCctDriverManager = Pca9685RgbCctDriverManager;
;
//# sourceMappingURL=pca9685-rgb-cct-driver-manager.js.map