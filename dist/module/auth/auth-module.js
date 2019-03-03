"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const config = require('../../../dist/server/config-loader');
class AuthModule {
    constructor(logger) {
        this.config = config.config;
        this.logger = logger;
        this.logger.debug('AuthModule was constructed.');
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger).listRoutes();
    }
}
exports.AuthModule = AuthModule;
;
//# sourceMappingURL=auth-module.js.map