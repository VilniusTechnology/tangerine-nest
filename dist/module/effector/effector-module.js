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
    init() {
        return new Promise((resolve, reject) => {
            this.logger.debug('\x1b[42m \x1b[40m EffectorModule was loaded. \x1b[0m');
            resolve({ 'module': 'EffectorModule', container: this });
        });
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.getModule('LedModule')).listRoutes();
    }
}
exports.EffectorModule = EffectorModule;
;
//# sourceMappingURL=effector-module.js.map