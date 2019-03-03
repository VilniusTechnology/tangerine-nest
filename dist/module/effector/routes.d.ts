import { Pca9685RgbCctDriverManager } from './../../driver/pca9685-rgb-cct-driver-manager';
import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
export declare class Routes extends RoutesModuleBase {
    static readonly ROUTE_PREFIX = "led/effects";
    private logger;
    private fader;
    private pwmManager;
    private effectsManager;
    constructor(logger: Logger, pwmManager: Pca9685RgbCctDriverManager);
    routes(): void;
}
