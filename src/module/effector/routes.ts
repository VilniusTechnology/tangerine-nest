import { EffectsManager } from './effector/effects-manager';
import { Pca9685RgbCctDriverManager } from './../../driver/pca9685-rgb-cct-driver-manager';
import { RoutesModuleBase } from "../routes-module-base";

import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { FaderAdvanced } from "./effector/fader-advanced";

export class Routes extends RoutesModuleBase {

    public static readonly ROUTE_PREFIX = 'led/effects';

    private logger: Logger;
    private fader: FaderAdvanced;
    private pwmManager: Pca9685RgbCctDriverManager;
    private effectsManager: EffectsManager;

    constructor(logger: Logger, pwmManager: Pca9685RgbCctDriverManager) {
        super();

        this.pwmManager = pwmManager;
        this.logger = logger;
        
        this.routes();
        this.fader = new FaderAdvanced(this.pwmManager, this.logger);
        this.effectsManager = new EffectsManager(this.fader, this.logger);
    }

    routes() {
        this.restapi.post(this.getFullRoute('/list'), bodyParser.json(), (req, res) => {
            this.logger.info('Should list all effects');
        });

        this.restapi.all(this.getFullRoute('/play/:id'), bodyParser.json(), (req, res) => {
            this.logger.info(req.params.id);
            this.effectsManager.performGW();
        });
    }
}