"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const routes_module_base_1 = require("../routes-module-base");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger) {
        super(logger);
        this.ROUTE_PREFIX = 'openpixel';
        this.logger = logger;
        this.restapi = express();
        this.routes();
    }
    routes() {
        this.restapi.post(this.getFullRoute('/toggle'), bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /openpixel/launch');
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map