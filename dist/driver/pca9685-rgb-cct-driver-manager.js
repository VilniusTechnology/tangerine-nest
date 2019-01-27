"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const colors_1 = require("./entities/colors");
const server_1 = require("mandarin-nest-local-light-driver/dist/server");
class Pca9685RgbCctDriverManager {
    constructor(config, logger) {
        this.colors = new colors_1.Colors();
        this.logger = logger;
        this.config = config;
        this.driver = new config_1.Config().driver;
        this.pwm = new server_1.PwmDriverEmulator(this.config.contours, 7777, this.logger);
        this.colors.red.value = 1;
        this.colors.green.value = 2;
        this.colors.blue.value = 3;
        this.logger.info('PCA9685 ready');
    }
    setup() {
        return new Promise((resolve, reject) => {
            this.logger.info('Will setup PWM driver.');
            // this.pwm = new Pca9685Driver(
            //     this.driver, 
            //     (err) => {
            //         if (err) {
            //             console.error("Error initializing PCA9685");
            //             process.exit(-1);
            //             reject('fail');
            //         }
            //         let msg = "PCA9685 Initialization done";
            //         console.log(msg);
            //         resolve(this.pwm);
            //     }
            // );
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