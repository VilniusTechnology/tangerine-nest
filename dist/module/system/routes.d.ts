import { LedModule } from './../led/led-module';
import { Logger } from "log4js";
import { RoutesModuleBase } from '../routes-module-base';
export declare class Routes extends RoutesModuleBase {
    readonly ROUTE_PREFIX = "";
    logger: Logger;
    ledModule: LedModule;
    constructor(logger: Logger, container: any);
    routes(): void;
}
