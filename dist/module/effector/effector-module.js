"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const config = require('../../../dist/server/config-loader');
class EffectorModule {
    constructor(logger, pwmManager) {
        this.config = config.config;
        this.logger = logger;
        this.pwmManager = pwmManager;
        this.logger.debug('EffectorModule was constructed.');
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.pwmManager).listRoutes();
    }
}
exports.EffectorModule = EffectorModule;
;
//# sourceMappingURL=effector-module.js.map