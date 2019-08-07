import { Logger } from "log4js";
import { RoutesModuleBase } from '../routes-module-base';
export declare class Routes extends RoutesModuleBase {
    readonly ROUTE_PREFIX = "openpixel";
    logger: Logger;
    private db;
    private config;
    constructor(logger: Logger);
    routes(): void;
}
