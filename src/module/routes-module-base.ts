import express = require("express");

export class RoutesModuleBase {

    public ROUTE_PREFIX = '';

    public restapi;
    public logger;

    constructor(logger) {
        this.logger = logger;
        this.restapi = express();
    }

    getFullRoute(route: string) {
        return '/' + this.ROUTE_PREFIX + route;
    }

    listRoutes() {
        return this.restapi._router.stack;
    }
}