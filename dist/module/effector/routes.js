"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effects_manager_1 = require("./effector/effects-manager");
const routes_module_base_1 = require("../routes-module-base");
const bodyParser = require("body-parser");
const fader_advanced_1 = require("./effector/fader-advanced");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger, pwmManager) {
        super();
        this.pwmManager = pwmManager;
        this.logger = logger;
        this.routes();
        this.fader = new fader_advanced_1.FaderAdvanced(this.pwmManager, this.logger);
        this.effectsManager = new effects_manager_1.EffectsManager(this.fader, this.logger);
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
Routes.ROUTE_PREFIX = 'led/effects';
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map