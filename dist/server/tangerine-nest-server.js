"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const _ = require("lodash");
const log4js_1 = require("log4js");
const config_loader_1 = require("./config-loader");
const module_1 = require("../module");
const bodyParser = require("body-parser");
const auth_mw = require('./../../dist/module/auth/auth-middleware');
class TangerineNestServer {
    constructor(configJson, port = null) {
        this.modules = {};
        // configure('./filename.log');
        this.logger = log4js_1.getLogger();
        this.logger.level = 'debug';
        if (configJson == undefined) {
            this.config = config_loader_1.config;
            this.logger.info('Loading config from file in config directory depending on env.');
            this.logger.level = this.config.logger.level;
            this.logger.info(`\x1b[5m \x1b[47m \x1b[0m Current env is: ${this.config.activeEnv}`);
        }
        else {
            this.config = configJson;
            this.logger.info('Loading config from constructor params.');
            this.logger.level = this.config.logger.level;
        }
        this.port = port || TangerineNestServer.PORT;
        this.logger.debug('\x1b[5m \x1b[46m \x1b[0m TangerineNestServer was constructed..');
    }
    getContainer() {
        return (() => this.modules);
    }
    resgisterModules() {
        this.logger.debug('\x1b[42m \x1b[0m Will register modules.');
        return new Promise((resolve, reject) => {
            const rawModules = [
                { id: 'SystemModule', params: [this.config, this.logger, this.getContainer()] },
                { id: 'LedModule', params: [this.config, this.logger, this.getContainer()] },
                { id: 'AuthModule', params: [this.logger, this.getContainer()] },
                { id: 'TimedLightSettingsApi', params: [this.config.ledTimer, this.logger] },
                { id: 'EffectorModule', params: [this.logger, this.getContainer()] },
                { id: 'OpenpixelModule', params: [this.logger, this.getContainer()] },
            ];
            // Instantiate modules objects.
            let objects = [];
            rawModules.forEach((objectDesc) => {
                const object = new module_1.Modules[objectDesc.id](...objectDesc.params);
                objects.push(object);
            });
            // Instantiate modules logic ".init()".
            let promises = [];
            objects.forEach((module) => {
                const prom = module.init();
                promises.push(prom);
            });
            // After all modules were instantiated.
            Promise.all(promises).then((responses) => {
                responses.forEach((module) => {
                    // Push them to container.
                    this.modules[module.module] = module.container;
                });
                this.logger.info('\x1b[41m \x1b[0m All modules were loaded.');
                resolve(this.modules);
            });
        });
    }
    registerModulesRoutes() {
        return new Promise((resolve, reject) => {
            this.logger.debug('\x1b[45m \x1b[0m Will register module routes.');
            _.forEach(this.modules, (module, key) => {
                this.logger.debug(`\x1b[43m \x1b[0m Will register Routes 4 module ${key}.`);
                module.getRoutesForRegistration().forEach((layer) => {
                    if (layer.route !== undefined) {
                        this.logger.debug(`\x1b[44m \x1b[0m  Will push route: ${layer.route.path}`);
                        this.app._router.stack.push(layer);
                    }
                });
                this.logger.debug(`\x1b[43m \x1b[0m Routes 4 module ${key} were registered.`);
            });
            resolve(true);
        });
    }
    launch() {
        this.initWebServer();
        this.registerMiddlewares();
        this.logger.debug('Will prepare for launch.');
        this.resgisterModules().then(() => {
            this.registerModulesRoutes().then(() => {
                this.listen().then(() => {
                    if (this.modules.LedModule !== undefined) {
                        this.logger.info('Will start boot DEMO.');
                        this.modules.LedModule.getRgbCctLedDriver().setColor('green', 150);
                        this.modules.LedModule.getRgbCctLedDriver().setColor('coldWhite', 5);
                    }
                });
            });
        });
    }
    initWebServer() {
        this.app = express();
        this.logger.debug('Server created.');
    }
    registerMiddlewares() {
        this.app.use(this.corsMiddleware);
        this.app.use(bodyParser.json());
        if (this.config.secure_api) {
            this.logger.error('Injecting to auth_mw', this.modules);
            this.app.use(auth_mw(this.getContainer()));
            this.logger.warn('Registered AUTH Middleware !');
        }
        this.logger.debug('Middlewares were registered !');
    }
    /**
     * Filters out CORS preflights from further operations.
     *
     * @param req
     * @param res
     * @param next
     */
    corsMiddleware(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Auth-token,Auth-email,content-type');
        res.setHeader('Access-Control-Allow-Credentials', 'false');
        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        }
        else {
            // Pass to next layer of middleware.
            next();
        }
    }
    listen() {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, () => {
                this.logger.info(`Server started at http://localhost:${this.port}`);
                this.logger.info('Listening...');
                resolve(true);
            });
        });
    }
}
TangerineNestServer.PORT = 8081;
exports.TangerineNestServer = TangerineNestServer;
//# sourceMappingURL=tangerine-nest-server.js.map