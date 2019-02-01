"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("./entities/colors");
const mandarin_nest_local_light_driver_1 = require("mandarin-nest-local-light-driver");
const pwm_driver_pca9685_1 = require("./pwm-driver-pca9685");
class Pca9685RgbCctDriverManager {
    constructor(config, logger) {
        this.colors = new colors_1.Colors();
        this.logger = logger;
        this.config = config;
        if (config.ledDriver.driver_type == 'local') {
            this.pwm = new mandarin_nest_local_light_driver_1.PwmDriverEmulator(this.config, 7777, this.logger);
            this.colors.red.value = 1;
            this.colors.green.value = 2;
            this.colors.blue.value = 3;
            this.logger.info('Local (websockets) LED driver ready! ');
        }
        if (config.ledDriver.driver_type == 'i2c') {
            this.pwm = new pwm_driver_pca9685_1.PwmDriverPca9685(this.config);
            this.logger.info('PCA9685 PWM driver ready! ');
        }
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