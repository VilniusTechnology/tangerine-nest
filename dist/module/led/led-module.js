"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_base_1 = require("./../module-base");
const routes_1 = require("./routes");
const light_regulator_1 = require("../../controller/regulator/light-regulator");
const timed_light_regulator_1 = require("../../controller/regulator/timed-light-regulator");
const pca9685_rgb_cct_driver_manager_1 = require("../../driver/pca9685-rgb-cct-driver-manager");
const light_source_1 = require("../../sensors/light-source");
const fader_advanced_1 = require("../effector/effector/fader-advanced");
const led_module_manager_1 = require("./led/led-module-manager");
class LedModule extends module_base_1.ModuleBase {
    constructor(config, logger, container) {
        super(logger, container);
        this.pwmManager = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(config, logger);
        this.logger = logger;
        this.colors = this.pwmManager.getState();
        this.lightSource = new light_source_1.LightSourceSensor();
        this.lightRegulator = new light_regulator_1.LightRegulator(this.fader, this.lightSource);
        this.timedRegulator = new timed_light_regulator_1.TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger);
        this.ledModuleManager = new led_module_manager_1.LedModuleManager(config, logger);
    }
    ;
    init() {
        this.logger.info('\x1b[41m \x1b[0m  Will init LED module!');
        return new Promise((resolve, reject) => {
            this.pwmManager.setup().then((response) => {
                this.logger.debug('\x1b[41m \x1b[0m PwmManager is UP!');
                this.pwmManager.setLedMode(LedModule.MANUAL_MODE_CODE);
                this.fader = new fader_advanced_1.FaderAdvanced(this.pwmManager, this.logger);
                this.logger.info('\x1b[41m \x1b[40m LedModule fully initialized \x1b[0m');
                resolve({ 'module': 'LedModule', container: this });
            }).catch((err) => {
                this.logger.error(`PWM driver setup error!`, err);
            });
        });
    }
    getFader() {
        return this.fader;
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.ledModuleManager).listRoutes();
    }
    getRgbCctLedDriver() {
        this.ledModuleManager.getRgbCctLedDriver();
    }
}
LedModule.AUTO_MODE_CODE = 0;
LedModule.MANUAL_MODE_CODE = 1;
LedModule.TIMED_MODE_CODE = 2;
LedModule.CHECK_MODE_CODE = 3;
exports.LedModule = LedModule;
;
//# sourceMappingURL=led-module.js.map