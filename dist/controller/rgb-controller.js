"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const light_source_1 = require("./../sensors/light-source");
const fader_1 = require("./../effector/fader");
const light_regulator_1 = require("./regulator/light-regulator");
const timed_light_regulator_1 = require("./regulator/timed-light-regulator");
const pca9685_rgb_cct_driver_manager_1 = require("../driver/pca9685-rgb-cct-driver-manager");
const _ = require("lodash");
class RgbController {
    constructor(config, logger) {
        this.pwmManager = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(config, logger);
        this.pwmManager.setup();
        // this.pwmManager.setup().then((response) => {
        //     console.log('response', response);
        // });
        this.logger = logger;
        this.colors = this.pwmManager.getState();
        this.lightSource = new light_source_1.LightSource();
        this.timedRegulator = new timed_light_regulator_1.TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger);
        this.pwmManager.setLedMode(RgbController.MANUAL_MODE_CODE);
        this.fader = new fader_1.Fader(this.pwmManager, this.logger);
        this.lightRegulator = new light_regulator_1.LightRegulator(this.fader, this.lightSource);
        this.logger.info('RgbController initialized');
    }
    ;
    setColours(colors) {
        _.forEach(colors, (val, key) => {
            if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                this.pwmManager.setColor(key, val);
            }
        });
    }
    ;
    switchAllLedsOff() {
        this.colors = JSON.parse(JSON.stringify(this.pwmManager.getState()));
        this.pwmManager.setColor('red', 0);
        this.pwmManager.setColor('green', 0);
        this.pwmManager.setColor('blue', 0);
        this.pwmManager.setColor('warmWhite', 0);
        this.pwmManager.setColor('coldWhite', 0);
        this.pwmManager.setLedState(0);
    }
    ;
    switchAllLedsOn() {
        this.pwmManager.setColor('red', this.colors.red.value);
        this.pwmManager.setColor('green', this.colors.green.value);
        this.pwmManager.setColor('blue', this.colors.blue.value);
        this.pwmManager.setColor('warmWhite', this.colors.warmWhite.value);
        this.pwmManager.setColor('coldWhite', this.colors.coldWhite.value);
        this.pwmManager.setLedState(1);
    }
    ;
    getState() {
        return JSON.parse(JSON.stringify(this.pwmManager.getState()));
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
        return this.pwmManager.getLedMode();
    }
    ;
    setMode(mode) {
        this.pwmManager.setLedMode(mode);
    }
    ;
    getRgbCctLedDriver() {
        return this.pwmManager;
    }
}
RgbController.AUTO_MODE_CODE = 0;
RgbController.MANUAL_MODE_CODE = 1;
RgbController.TIMED_MODE_CODE = 2;
RgbController.CHECK_MODE_CODE = 3;
exports.RgbController = RgbController;
;
//# sourceMappingURL=rgb-controller.js.map