"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizer_1 = require("./authorizer");
const bodyParser = require("body-parser");
const express = require("express");
class Routes {
    constructor(logger) {
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
    listRoutes() {
        return this.restapi._router.stack;
    }
    getFullRoute(route) {
        return '/' + Routes.ROUTE_PREFIX + route;
    }
}
Routes.ROUTE_PREFIX = 'auth';
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map