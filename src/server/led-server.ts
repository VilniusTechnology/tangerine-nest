import { LedServerConfig } from './model/config-model';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as url from 'url';
import * as _ from "lodash"
import { RequestProcessor } from './request-processor';
import { LedModule } from '../module/led/led-module';

import { getLogger, Logger  } from 'log4js';
import { TimedLightSettingsApi } from '../module/timed-lighting/module-timed-light-settings-api';

import { config  } from './config-loader';

export class LedServer {
    public static readonly PORT:number = 8081;

    private port: number;
    private app: express.Application;
    private server: Server;

    private requestHandler: RequestProcessor;
    public logger: Logger;
    public config: any;
    public controller: LedModule; 

    constructor(configJson: LedServerConfig, port: number = null) {
        // configure('./filename.log');
        this.logger = getLogger();
        this.logger.level = 'debug';

        if (configJson == undefined) {
            this.config = config;
            this.logger.info('Loading config from file in config directory depending on env.');
            this.logger.level = this.config.logger.level;
            this.logger.info(`Current env is: ${this.config.activeEnv}`);

            console.log(this.config);
        } else {
            this.config = configJson;
            this.logger.info('Loading config from constructor params.');
            this.logger.level = this.config.logger.level;
        }

        this.port = port || LedServer.PORT;

        this.controller = new LedModule(this.config, this.logger);
        this.requestHandler = new RequestProcessor(this.controller, this.logger);
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private resgisterModules() {
        return false;
    }

    private registerModulesRoutes() {
        const settingApiModule = new TimedLightSettingsApi(this.config.ledTimer, this.logger);
        settingApiModule.bootstrap();

        settingApiModule.getRoutesForRegistration().forEach((layer) => {
            if (layer.route !== undefined)  {
                this.logger.debug( `Will push route: ${layer.route.path}` );
                this.app._router.stack.push(layer);
            }
        });
    }

    private listen(): void {
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
            this.logger.info( `server started at http://localhost:${this.port}` );
            this.logger.info('Listening...');
        } );
    }

    public launch(): void {
        this.controller.init().then( () => {
            this.app = express();
            this.createServer();
    
            this.app.use(function (req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', 'false');
    
                if ('OPTIONS' === req.method) {
                    res.sendStatus(200);
                } else {
                    // Pass to next layer of middleware.
                    next();
                }
            });

            this.listen();

            this.logger.info('Will start boot DEMO.');
            this.controller.getRgbCctLedDriver().setColor('green', 150);
            this.controller.getRgbCctLedDriver().setColor('coldWhite', 5);
        });
    }
}