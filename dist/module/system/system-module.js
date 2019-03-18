"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const module_base_1 = require("../module-base");
class SystemModule extends module_base_1.ModuleBase {
    constructor(config, logger, container) {
        super(logger, container);
        this.config = config.config;
        this.logger = logger;
        this.container = container;
        this.logger.debug('SystemModule was constructed.');
    }
    getRoutesForRegistration() {
        return new routes_1.Routes(this.logger, this.container).listRoutes();
    }
}
exports.SystemModule = SystemModule;
;
//# sourceMappingURL=system-module.js.map