import { LedServerConfig } from './model/config-model';
import * as express from 'express';
import * as _ from "lodash"
import { config  } from './config-loader';
import { Modules } from '../module';
import * as bodyParser from "body-parser";
import { LedModuleManager } from '../module/led/led/led-module-manager';
import {Logger} from "../logger/logger";
const sqlite3 = require('sqlite3').verbose();
const auth_mw = require('./../../dist/module/auth/auth-middleware');

// const apm = require('elastic-apm-node').start({
//     serviceName: 'tangeringi',
//     serverUrl: 'http://serveris.local:8200',
//     logLevel: 'trace',
//     logger: require('bunyan')({ name: 'tst', level: 'error' })
// });

export class TangerineNestServer {
    public static readonly PORT:number = 8081;

    private port: number;
    private app: express.Application;

    public logger: Logger;
    public config: any;

    public modules: any = {};

    constructor(configJson: LedServerConfig, port: number = null) {
        this.config = config;
        this.logger = new Logger(this.config.logger.level);

        if (configJson == undefined) {
            this.config = config;
            this.logger.info('Loading config from file in config directory depending on env.');
            // this.logger.level = this.config.logger.level;
            this.logger.info(`Current env is: ${this.config.activeEnv}`);
        } else {
            this.config = configJson;
            this.logger.info('Loading config from constructor params.');
            // this.logger.level = this.config.logger.level;
        }

        this.port = port || TangerineNestServer.PORT;

        this.logger.debug('TangerineNestServer was constructed..');
    }

    public getContainer() {
       return (() => this.modules);
    }

    private resgisterModules() {
        this.logger.debug('Will register modules.');

        return new Promise((resolve, reject) => {
            const rawModules = [
                {id: 'SystemModule',
                    params: [
                        this.config,
                        this.logger,
                        this.getContainer()
                    ]
                },
                {id: 'MqttModule', params: [this.config, this.logger, this.getContainer() ] },
                {id: 'SensorModule', params: [this.config, this.logger, this.getContainer()]},
                {id: 'LedModule', params: [this.config, this.logger, this.getContainer() ] },
                {id: 'AuthModule', params: [this.logger, this.getContainer()]},
                {id: 'OmronModule', params: [this.logger, this.getContainer()]},
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
                this.logger.info('All modules were instantiated. Loading...');
                responses.forEach((module) => {
                    // Push them to container.
                    this.modules[module.module] = module.container;
                });
                this.logger.info('All modules were loaded.');

                resolve(this.modules);
            }).catch((err) => {
                this.logger.error('Init failed: ' + err);
            });
        });
    }

    private registerModulesRoutes() {
        return new Promise((resolve, reject) => {
            this.logger.debug('Will register module routes.');

            _.forEach(this.modules, (module, key) => {
                this.logger.debug(`Will register Routes 4 module ${key}.`);

                const routes = module.getRoutesForRegistration();
                if (Array.isArray(routes)) {
                    routes.forEach((layer) => {
                        if (layer.route !== undefined)  {
                            this.logger.debug( `Will push route: ${layer.route.path}`);

                            this.app._router.stack.push(layer);
                        }
                    });
                }

                this.logger.debug(`Routes 4 module ${key} were registered.`);
            });
            resolve(true);
        })
    }

    public launch(): void {
        this.launchBackgroundRunners();
        this.initWebServer();

        this.registerMiddlewares();

        this.logger.debug('Will prepare for launch.');

        this.resgisterModules().then(() => {

            this.logger.info('All modules were registered.');

            this.launchModules();

            this.registerModulesRoutes().then( () => {
                this.listen().then(() => {
                    if (this.modules.LedModule !== undefined) {
                        this.logger.info('Will start boot DEMO.');
                        // this.modules.LedModule.getRgbCctLedDriver()
                        //     .setColor('red', 2);
                        
                        const ledModule :LedModuleManager = this.modules.LedModule;
                        ledModule.getRgbCctLedDriver().setLedState(1);

                        // TODO: refactor for proper launch
                        if (this.config.omronSensor.enabled) {
                            // If led module is initialized start OmronModule.
                            setTimeout(() => {
                                this.modules.OmronModule.launch();
                            }, 10000);
                        }
                    }
                });
            });
        });
        this.app.get('/api/list-routes', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /api/list-routes');
            const routes = [];
            this.app._router.stack.forEach((layer) => {
                if (layer.route != undefined) {
                    routes.push(layer.route.path);
                }
            });

            res.write(JSON.stringify(routes));
            res.end();
        });
    }

    private launchModules() {
        _.forEach(this.modules, (module, key) => {
            if (typeof module.launch === 'function') {
                module.launch();
            }
        });
    }

    private launchBackgroundRunners() {
        const runners = [
            {
                address: '',
                key: 'pir',
                interval: 500,
            }
        ];

        const db = new sqlite3.Database(this.config.storage.path, (err) => {
            if (err) {
                return this.logger.error(
                    `BackgroundRunners DB error on path: ${config.settingsDb.path}: ${err.message}`
                );
            }
            this.logger.debug('Authorizer loaded DB OK. NEST SERVER.');
        });

        const intervals = [];
        // runners.forEach((runner) => {
        //     if (runner.key == 'pir') {
        //         const intv = setInterval(() => {
        //             const run = new PirRunner(db, this.logger);
        //             run.readAndPersist();
        //         }, runner.interval);
        //         intervals.push(intv);
        //     }
        // });
        db.close();
    }

    private registerMiddlewares() {
        this.app.use(this.corsMiddleware);
        this.app.use(bodyParser.json());

        if(this.config.secure_api) {
            this.logger.debug(`Injecting to auth_mw ${this.modules}`);
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

            const host = this.config.host;
            this.logger.info(`Host: ${host}`);

            try {
                const firstFile = `certs/${host}.server.key`;
                const privateKey  = fs.readFileSync(
                    firstFile,
                    'utf8'
                ) ;

                const secondFile = `certs/${host}.server.crt`;
                const certificate = fs.readFileSync(
                    secondFile,
                    'utf8'
                );
                const credentials = {key: privateKey, cert: certificate};

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
            } catch (e) {
                this.logger.error(e);
            }
        });
    }
}
