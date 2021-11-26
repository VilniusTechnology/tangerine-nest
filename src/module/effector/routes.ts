import { EffectsManager } from './effector/effects-manager';
import { RoutesModuleBase } from "../routes-module-base";
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { FaderAdvanced } from "./effector/fader-advanced";
import {EffectsRepo} from "./effects-repo";
import {LedModuleManager} from "../led/led/led-module-manager";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = 'led/effects';
    public logger: Logger;

    private readonly fader: FaderAdvanced;
    private ledModule;
    private ledManager: LedModuleManager;
    private repo: EffectsRepo;
    private readonly effectsManager: EffectsManager;

    constructor(logger: Logger, ledModule) {
        super(logger);

        this.ledModule = ledModule;
        this.logger = logger;

        this.fader = this.ledModule.getFader();
        this.ledManager = this.ledModule.getManager();
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
        this.ledManager.mute();
        prom.then( (resolution) => {
            this.ledManager.unMute();
            this.logger.debug(`Perform${effectKey} FINISHED`, resolution);
        });
    }
}