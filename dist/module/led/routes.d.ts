import { LedModuleManager } from './led/led-module-manager';
import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
export declare class Routes extends RoutesModuleBase {
    readonly ROUTE_PREFIX = "";
    logger: Logger;
    private requestProcessor;
    constructor(logger: Logger, ledModuleManager: LedModuleManager);
    routes(): void;
}
