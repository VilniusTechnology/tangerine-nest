import { Authorizer } from './authorizer';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";

import express = require("express");
import { RoutesModuleBase } from '../routes-module-base';

export class Routes extends RoutesModuleBase{

    public readonly ROUTE_PREFIX = 'auth';
    public logger: Logger;

    private db;
    private config;
    private authorizer: Authorizer;

    constructor(logger: Logger) {
        super(logger);
        
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
}