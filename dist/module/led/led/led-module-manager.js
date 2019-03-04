"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const timed_light_regulator_1 = require("../../../controller/regulator/timed-light-regulator");
const pca9685_rgb_cct_driver_manager_1 = require("../../../driver/pca9685-rgb-cct-driver-manager");
const light_source_1 = require("../../../sensors/light-source");
class LedModuleManager {
    constructor(config, logger) {
        this.pwmManager = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(config, logger);
        this.logger = logger;
        this.colors = this.pwmManager.getState();
        this.lightSource = new light_source_1.LightSourceSensor();
        this.timedRegulator = new timed_light_regulator_1.TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger);
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
LedModuleManager.AUTO_MODE_CODE = 0;
LedModuleManager.MANUAL_MODE_CODE = 1;
LedModuleManager.TIMED_MODE_CODE = 2;
LedModuleManager.CHECK_MODE_CODE = 3;
exports.LedModuleManager = LedModuleManager;
;
//# sourceMappingURL=led-module-manager.js.map