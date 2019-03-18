"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const module_base_1 = require("../module-base");
const config = require('../../../dist/server/config-loader');
class EffectorModule extends module_base_1.ModuleBase {
    constructor(logger, container) {
        super(logger, container);
        this.config = config.config;
        this.logger = logger;
        this.logger.debug('EffectorModule was constructed.');
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.getModule('LedModule')).listRoutes();
    }
}
exports.EffectorModule = EffectorModule;
;
//# sourceMappingURL=effector-module.js.map