import { EffectsManager } from './effector/effects-manager';
import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { FaderAdvanced } from "./effector/fader-advanced";
import {EffectsRepo} from "./effects-repo";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = 'led/effects';
    public logger: Logger;

    private fader: FaderAdvanced;
    private ledModule;
    private repo: EffectsRepo;
    private effectsManager: EffectsManager;

    constructor(logger: Logger, ledModule) {
        super(logger);

        this.ledModule = ledModule;
        this.logger = logger;

        this.fader = this.ledModule.getFader();
        this.effectsManager = new EffectsManager(this.fader, this.logger);

        this.repo = new EffectsRepo(this.logger);

        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute('/list'), bodyParser.json(), (req, res) => {
            this.logger.info('Should list all effects');

            res.write(
                JSON.stringify(
                    this.repo.retrieveEffectsList()
                )
            );
            res.end();
        });

        this.restapi.all(this.getFullRoute('/play/:id'), bodyParser.json(), (req, res) => {
            this.logger.info(`/play/${req.params.id}`);
            let efId = req.params.id;

            this.execute('perform' + efId);

            res.write(JSON.stringify(true));
            res.end();
        });
    }

    execute(effectKey) {
        const prom = this.effectsManager[effectKey]();
        prom.then( (resolution) => {
            this.logger.debug(`\x1b[41m \x1b[0m perform${effectKey} FINISHED`, resolution);
        });
    }
}