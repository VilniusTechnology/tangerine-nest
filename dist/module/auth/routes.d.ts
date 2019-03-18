import { Authorizer } from './authorizer';
import { Logger } from "log4js";
import { RoutesModuleBase } from '../routes-module-base';
export declare class Routes extends RoutesModuleBase {
    readonly ROUTE_PREFIX = "auth";
    logger: Logger;
    private db;
    private config;
    private authorizer;
    constructor(logger: Logger, authorizer: Authorizer);
    routes(): void;
    getAuthorizer(): Authorizer;
}
