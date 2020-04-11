import { EffectsManager } from './effector/effects-manager';
import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { FaderAdvanced } from "./effector/fader-advanced";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = 'led/effects';
    public logger: Logger;

    private fader: FaderAdvanced;
    private ledModule;
    private effectsManager: EffectsManager;

    constructor(logger: Logger, ledModule) {
        super(logger);

        this.ledModule = ledModule;
        this.logger = logger;

        this.fader = this.ledModule.getFader();
        this.effectsManager = new EffectsManager(this.fader, this.logger);

        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute('/list'), bodyParser.json(), (req, res) => {
            this.logger.info('Should list all effects');
        });

        this.restapi.all(this.getFullRoute('/play/:id'), bodyParser.json(), (req, res) => {
            this.logger.info(`/play/${req.params.id}`);
            let efId = parseInt(req.params.id);
            
            if(efId == 1) {
                this.effectsManager.performGW().then( (resolution) => {
                    this.logger.debug('\x1b[41m \x1b[0m performGW FINISHED', resolution);
                });
            }

            if(efId == 2) {
                this.effectsManager.performRgbFade().then( (resolution) => {
                    this.logger.debug('\x1b[41m \x1b[0m performRgbFade FINISHED', resolution);
                });
            }
            

            res.write(JSON.stringify(true));
            res.end();
        });
    }
}