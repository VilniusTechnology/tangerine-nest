"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effects_manager_1 = require("./effector/effects-manager");
const routes_module_base_1 = require("../routes-module-base");
const bodyParser = require("body-parser");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger, ledModule) {
        super(logger);
        this.ROUTE_PREFIX = 'led/effects';
        this.ledModule = ledModule;
        this.logger = logger;
        this.fader = this.ledModule.getFader();
        this.effectsManager = new effects_manager_1.EffectsManager(this.fader, this.logger);
        this.routes();
    }
    routes() {
        this.restapi.all(this.getFullRoute('/list'), bodyParser.json(), (req, res) => {
            this.logger.info('Should list all effects');
        });
        this.restapi.all(this.getFullRoute('/play/:id'), bodyParser.json(), (req, res) => {
            this.logger.info(`/play/${req.params.id}`);
            this.effectsManager.performGW().then((resolution) => {
                this.logger.debug('\x1b[41m \x1b[0m performGW FINISHED', resolution);
            });
            res.write(JSON.stringify(true));
            res.end();
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map