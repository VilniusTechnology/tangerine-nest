"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const url = require("url");
const request_processor_1 = require("./request-processor");
const rgb_controller_1 = require("../controller/rgb-controller");
const log4js_1 = require("log4js");
const module_timed_light_settings_api_1 = require("../module/timed-lighting/module-timed-light-settings-api");
class LedServer {
    constructor(port = null) {
        this.port = port || LedServer.PORT;
        // configure('./filename.log');
        this.logger = log4js_1.getLogger();
        this.logger.level = 'debug';
        const controller = new rgb_controller_1.RgbController(this.logger);
        this.requestHandler = new request_processor_1.RequestProcessor(controller, this.logger);
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    resgisterModules() {
        return false;
    }
    registerModulesRoutes() {
        const settingApiModule = new module_timed_light_settings_api_1.TimedLightSettingsApi(this.logger);
        settingApiModule.bootstrap();
        settingApiModule.getRoutesForRegistration().forEach((layer) => {
            if (layer.route !== undefined) {
                this.logger.debug(`Will push route: ${layer.route.path}`);
                this.app._router.stack.push(layer);
            }
        });
    }
    listen() {
        this.registerModulesRoutes();
        this.app.get('/', (req, res) => {
            this.logger.debug('Incomming: ', req.url);
            this.logger.log('debug', 'Incomming.......');
            let query = url.parse(req.url, true).query;
            this.requestHandler.manageModes(query);
            let ledStateObj = this.requestHandler.returnState(query);
            this.requestHandler.prepareResponse(res, ledStateObj);
        });
        this.app.listen(this.port, () => {
            this.logger.debug(`server started at http://localhost:${this.port}`);
            this.logger.info('Listening...');
        });
    }
    launch() {
        this.app = express();
        this.createServer();
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'false');
            if ('OPTIONS' === req.method) {
                res.sendStatus(200);
            }
            else {
                // Pass to next layer of middleware.
                next();
            }
        });
        this.listen();
    }
}
LedServer.PORT = 8081;
exports.LedServer = LedServer;
//# sourceMappingURL=led-server.js.map