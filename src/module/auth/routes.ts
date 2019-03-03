import { Authorizer } from './authorizer';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";

import express = require("express");

export class Routes {

    public static readonly ROUTE_PREFIX = 'auth';

    private db;
    private restapi;
    private logger: Logger;
    private config;
    private authorizer: Authorizer;

    constructor(logger: Logger) {
        this.logger = logger;
        this.restapi = express();
        this.routes();
        this.authorizer = new Authorizer(this.logger);
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

    getFullRoute(route: string) {
        return '/' + Routes.ROUTE_PREFIX + route;
    }
}