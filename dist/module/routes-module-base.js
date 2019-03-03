"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class RoutesModuleBase {
    constructor() {
        this.ROUTE_PREFIX = '';
        this.restapi = express();
    }
    getFullRoute(route) {
        return '/' + this.ROUTE_PREFIX + route;
    }
    listRoutes() {
        return this.restapi._router.stack;
    }
}
exports.RoutesModuleBase = RoutesModuleBase;
//# sourceMappingURL=routes-module-base.js.map