import { Logger } from "log4js";
export declare class Routes {
    static readonly ROUTE_PREFIX = "auth";
    private db;
    private restapi;
    private logger;
    private config;
    private authorizer;
    constructor(logger: Logger);
    routes(): void;
    listRoutes(): any;
    getFullRoute(route: string): string;
}
