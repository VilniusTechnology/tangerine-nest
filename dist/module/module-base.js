"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleBase {
    constructor(logger, container) {
        this.logger = logger;
        this.container = container();
    }
    getModule(moduleName) {
        return this.container[moduleName];
    }
}
exports.ModuleBase = ModuleBase;
;
//# sourceMappingURL=module-base.js.map