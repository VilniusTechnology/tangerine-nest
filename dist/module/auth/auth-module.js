"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const module_base_1 = require("../module-base");
const authorizer_1 = require("./authorizer");
const config = require('../../../dist/server/config-loader');
class AuthModule extends module_base_1.ModuleBase {
    constructor(logger, container) {
        super(logger, container);
        this.config = config.config;
        this.logger = logger;
        this.logger.debug('AuthModule was constructed.');
        this.authorizer = new authorizer_1.Authorizer(this.logger);
    }
    init() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.logger.debug('\x1b[42m \x1b[40m AuthModule was loaded. \x1b[0m');
                resolve({ 'module': 'AuthModule', container: this });
            }, 1);
        });
    }
    getAuthorizer() {
        return this.authorizer;
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.authorizer).listRoutes();
    }
}
exports.AuthModule = AuthModule;
;
//# sourceMappingURL=auth-module.js.map