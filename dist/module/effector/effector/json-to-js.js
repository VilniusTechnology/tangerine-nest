"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_factory_1 = require("./effect-factory");
const pca9685_rgb_cct_driver_manager_1 = require("../../../driver/pca9685-rgb-cct-driver-manager");
class EffectExecutor {
    constructor(config, logger) {
        this.logger = logger;
        this.factory = new effect_factory_1.EffectFactory(config, this.logger);
        this.pwmManager = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(config, logger);
        this.pwmManager.setup();
    }
    performJson(json) {
        let effectChain = this.factory.convert(json);
        const pwmManager = this.pwmManager;
        const logger = this.logger;
        this.logger.error('FINAL::: ', effectChain);
        eval(`${effectChain}`);
    }
}
exports.EffectExecutor = EffectExecutor;
//# sourceMappingURL=json-to-js.js.map