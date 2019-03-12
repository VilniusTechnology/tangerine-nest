"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_effect_factory_1 = require("./json-effect-factory");
const pca9685_rgb_cct_driver_manager_1 = require("../../../driver/pca9685-rgb-cct-driver-manager");
class JsonEffectExecutor {
    constructor(config, logger) {
        this.logger = logger;
        this.factory = new json_effect_factory_1.JsonEffectFactory(config, this.logger);
        this.pwmManager = new pca9685_rgb_cct_driver_manager_1.Pca9685RgbCctDriverManager(config, logger);
        this.pwmManager.setup();
    }
    performJson(json) {
        let effectChain = this.factory.convert(json);
        const pwmManager = this.pwmManager;
        const logger = this.logger;
        this.logger.debug('FINAL built effect: ', JSON.stringify(effectChain, null, 4));
        eval(`${effectChain}`);
    }
}
exports.JsonEffectExecutor = JsonEffectExecutor;
//# sourceMappingURL=json-effect-executor.js.map