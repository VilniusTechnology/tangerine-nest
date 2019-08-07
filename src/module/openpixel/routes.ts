import { Logger } from "log4js";
import * as bodyParser from "body-parser";

import express = require("express");
import { RoutesModuleBase } from '../routes-module-base';

export class Routes extends RoutesModuleBase{

    public readonly ROUTE_PREFIX = 'openpixel';
    public logger: Logger;

    private db;
    private config;

    constructor(logger: Logger) {
        super(logger);
        
        this.logger = logger;
        this.restapi = express();
        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute('/toggle'), bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /openpixel/launch');
        });
    }
}