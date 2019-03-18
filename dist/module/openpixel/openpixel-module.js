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
        this.logger.debug('AuthModule was constructed.');
    }
    init() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.logger.debug('\x1b[42m \x1b[40m AuthModule was loaded. \x1b[0m');
                resolve({ 'module': 'AuthModule', container: this });
            }, 1);
        });
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger).listRoutes();
    }
}
exports.OpenpixelModule = OpenpixelModule;
;
//# sourceMappingURL=openpixel-module.js.map