"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const module_base_1 = require("../module-base");
const config = require('../../../dist/server/config-loader');
class OpenpixelModule extends module_base_1.ModuleBase {
    constructor(logger, container) {
        super(logger, container);
        this.config = config.config;
        this.logger = logger;
        this.logger.debug('OpenpixelModule was constructed.');
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger).listRoutes();
    }
}
exports.OpenpixelModule = OpenpixelModule;
;
//# sourceMappingURL=openpixel-module.js.map