"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const routes_module_base_1 = require("../routes-module-base");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger, authorizer) {
        super(logger);
        this.ROUTE_PREFIX = 'auth';
        this.logger = logger;
        this.restapi = express();
        this.routes();
        this.authorizer = authorizer;
    }
    routes() {
        this.restapi.post(this.getFullRoute('/log-in'), bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /auth/log-in');
            this.authorizer.authenticate(req.body.email, req.body.password)
                .then((response) => {
                res.write(JSON.stringify(response));
                res.end();
            }).catch((response) => {
                res.write(JSON.stringify(response));
                res.end();
            });
        });
    }
    getAuthorizer() {
        return this.authorizer;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map