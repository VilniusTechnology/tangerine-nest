import { LedServerConfig } from './model/config-model';
import * as express from 'express';
import * as _ from "lodash"
import { getLogger, Logger  } from 'log4js';
import { config  } from './config-loader';
import { Modules } from '../module';
import * as bodyParser from "body-parser";
import { LedModuleManager } from '../module/led/led/led-module-manager';
const auth_mw = require('./../../dist/module/auth/auth-middleware');

export class TangerineNestServer {
    public static readonly PORT:number = 8081;

    private port: number;
    private app: express.Application;

    public logger: Logger;
    public config: any;

    public modules: any = {};

    constructor(configJson: LedServerConfig, port: number = null) {
        this.logger = getLogger();
        this.logger.level = 'debug';

        if (configJson == undefined) {
            this.config = config;
            this.logger.info('Loading config from file in config directory depending on env.');
            this.logger.level = this.config.logger.level;
            this.logger.info(`\x1b[5m \x1b[47m \x1b[0m Current env is: ${this.config.activeEnv}`);
        } else {
            this.config = configJson;
            this.logger.info('Loading config from constructor params.');
            this.logger.level = this.config.logger.level;
        }

        this.port = port || TangerineNestServer.PORT;

        this.logger.debug('\x1b[5m \x1b[46m \x1b[0m TangerineNestServer was constructed..');
    }

    public getContainer() {
       return (() => this.modules);
    }

    private resgisterModules() {
        this.logger.debug('\x1b[42m \x1b[0m Will register modules.');

        return new Promise((resolve, reject) => {
            const rawModules = [
                {id: 'SystemModule',
                    params: [
                        this.config,
                        this.logger,
                        this.getContainer()
                    ]
                },
                {id: 'LedModule', params: [this.config, this.logger, this.getContainer() ] },
                {id: 'AuthModule', params: [this.logger, this.getContainer()]},
                {id: 'TimedLightSettingsApi', params: [
                        this.config.ledTimer,
                        this.logger,
                        this.getContainer()
                    ]
                },
                {id: 'EffectorModule', params: [this.logger, this.getContainer()]},
                {id: 'OpenpixelModule', params: [this.logger, this.getContainer()]},
            ];

            // Instantiate modules objects.
            let objects = [];
            rawModules.forEach((objectDesc) => {
                const object = new Modules[objectDesc.id](...objectDesc.params);
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

    private registerModulesRoutes() {
        return new Promise((resolve, reject) => {
            this.logger.debug('\x1b[45m \x1b[0m Will register module routes.');

            _.forEach(this.modules, (module, key) => {
                this.logger.debug(`\x1b[43m \x1b[0m Will register Routes 4 module ${key}.`);

                module.getRoutesForRegistration().forEach((layer) => {
                    if (layer.route !== undefined)  {
                        this.logger.debug( `\x1b[44m \x1b[0m  Will push route: ${layer.route.path}`);

                        this.app._router.stack.push(layer);
                    }
                });
                this.logger.debug(`\x1b[43m \x1b[0m Routes 4 module ${key} were registered.`);
            });
            resolve(true);
        })
    }

    public launch(): void {
        this.initWebServer();

        this.registerMiddlewares();

        this.logger.debug('Will prepare for launch.');

        this.resgisterModules().then(() => {
            this.registerModulesRoutes().then( () => {   
                this.listen().then(() => {
                    if (this.modules.LedModule !== undefined) {
                        this.logger.info('Will start boot DEMO.');

                        this.modules.LedModule.getRgbCctLedDriver()
                            .setColor('red', 2);
                        // this.modules.LedModule.getRgbCctLedDriver().setColor('coldWhite', 5);
                        
                        const ledModule :LedModuleManager = this.modules.LedModule;
                        ledModule.getRgbCctLedDriver().setLedState(1);
                    }
                });
            });
        });
    }

    private registerMiddlewares() {
        this.app.use(this.corsMiddleware);
        this.app.use(bodyParser.json());

        if(this.config.secure_api) {
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
    private corsMiddleware(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Auth-token,Auth-email,content-type');
        res.setHeader('Access-Control-Allow-Credentials', 'false');

        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
    }

    private initWebServer(): void {
        this.app = express();
        this.logger.debug('Server created.');
    }

    private listen() {
        return new Promise((resolve, reject) => {
            var fs = require('fs');
            var https = require('https')

            var privateKey  = fs.readFileSync('certs/server.key', 'utf8');
            var certificate = fs.readFileSync('certs/server.crt', 'utf8');
            var credentials = {key: privateKey, cert: certificate};

            https.createServer(credentials, this.app)
                .listen(443, () => {
                    this.logger.info( `Server started at https://localhost` );

                    // this.app.listen(this.port, () => {
                    //     this.logger.info( `Server started at http://localhost:${this.port}` );
                    //     this.logger.info('Listening...');
                    //
                        resolve(true);
                    // });
                });
        });
    }
}
