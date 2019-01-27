"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const light_source_1 = require("./../sensors/light-source");
const fader_1 = require("./../effector/fader");
const light_regulator_1 = require("./regulator/light-regulator");
const timed_light_regulator_1 = require("./regulator/timed-light-regulator");
const pca9685_rgb_cct_driver_manager_1 = require("../driver/pca9685-rgb-cct-driver-manager");
const _ = require("lodash");
class RgbController {
    constructor(logger) {
        let pwmDriverconfig = {
            driver_type: 'local',
            // driver_type: 'i2c',
            driver: {
                i2c: null,
                // i2c: i2cBus.openSync(0),
                address: 0x40,
                frequency: 4800,
                debug: false,
            },
            contours: {
                main: {
                    red: 0,
                    green: 1,
                    blue: 2,
                    coldWhite: 3,
                    warmWhite: 4,
                }
            }
        };
        this.pwmDriver = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(pwmDriverconfig, logger);
        this.pwmDriver.setup().then((response) => {
            console.log('response', response);
        });
        this.logger = logger;
        this.colors = this.pwmDriver.getState();
        this.lightSource = new light_source_1.LightSource();
        this.timedRegulator = new timed_light_regulator_1.TimedLightRegulator(this.pwmDriver, this.logger);
        this.pwmDriver.setLedMode(RgbController.MANUAL_MODE_CODE);
        this.fader = new fader_1.Fader(this.pwmDriver, this.logger);
        this.lightRegulator = new light_regulator_1.LightRegulator(this.fader, this.lightSource);
        this.logger.info('debug', 'RgbController initialized');
    }
    ;
    async init() {
        // return Promise.all([
        //     this.pwmDriver.setup()
        // ]).then(function(vals) {
        //     vals.forEach((val) => {
        //         // this.pwmDriver.getState() = val;
        //         this.logger.error(`WTF IS HAPPENING: ${val}`);
        //     });
        //     return vals;
        // });
    }
    setColours(colors) {
        _.forEach(colors, (val, key) => {
            if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                this.pwmDriver.setColor(key, val);
            }
        });
    }
    ;
    switchAllLedsOff() {
        this.colors = JSON.parse(JSON.stringify(this.pwmDriver.getState()));
        this.pwmDriver.setColor('red', 0);
        this.pwmDriver.setColor('green', 0);
        this.pwmDriver.setColor('blue', 0);
        this.pwmDriver.setColor('warmWhite', 0);
        this.pwmDriver.setColor('coldWhite', 0);
        this.pwmDriver.setLedState(0);
    }
    ;
    switchAllLedsOn() {
        this.pwmDriver.setColor('red', this.colors.red.value);
        this.pwmDriver.setColor('green', this.colors.green.value);
        this.pwmDriver.setColor('blue', this.colors.blue.value);
        this.pwmDriver.setColor('warmWhite', this.colors.warmWhite.value);
        this.pwmDriver.setColor('coldWhite', this.colors.coldWhite.value);
        this.pwmDriver.setLedState(1);
    }
    ;
    getState() {
        return JSON.parse(JSON.stringify(this.pwmDriver.getState()));
    }
    ;
    clearTimersIntervals() {
        this.timedRegulator.clearTimersIntervals();
    }
    ;
    setTimedSettings() {
        ``;
        this.timedRegulator.checkIntervalsAndAjustLightSetting();
    }
    ;
    async adaptLight() {
        let result = await this.lightRegulator.adaptToConditions();
    }
    ;
    async performBootDemo() {
        var waitiner = await this.fader.performBootDemo();
        return waitiner;
    }
    getLedMode() {
        return this.pwmDriver.getLedMode();
    }
    ;
    setMode(mode) {
        this.pwmDriver.setLedMode(mode);
    }
    ;
    getRgbCctLedDriver() {
        return this.pwmDriver;
    }
}
RgbController.AUTO_MODE_CODE = 0;
RgbController.MANUAL_MODE_CODE = 1;
RgbController.TIMED_MODE_CODE = 2;
RgbController.CHECK_MODE_CODE = 3;
exports.RgbController = RgbController;
;
//# sourceMappingURL=rgb-controller.js.map