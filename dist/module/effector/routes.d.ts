import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
export declare class Routes extends RoutesModuleBase {
    readonly ROUTE_PREFIX = "led/effects";
    logger: Logger;
    private fader;
    private ledModule;
    private effectsManager;
    constructor(logger: Logger, ledModule: any);
    routes(): void;
}
