"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizer_1 = require("./authorizer");
const bodyParser = require("body-parser");
const express = require("express");
const routes_module_base_1 = require("../routes-module-base");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger) {
        super(logger);
        this.ROUTE_PREFIX = 'auth';
        this.logger = logger;
        this.restapi = express();
        this.routes();
        this.authorizer = new authorizer_1.Authorizer(this.logger);
    }
    routes() {
        this.restapi.post(this.getFullRoute('/log-in'), bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /log-in');
            this.authorizer.authenticate(req.body.email, req.body.password).then((response) => {
                res.write(JSON.stringify(response));
                res.end();
            });
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map