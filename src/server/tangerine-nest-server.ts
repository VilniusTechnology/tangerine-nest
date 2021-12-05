import { LedServerConfig } from './model/config-model';
import * as express from 'express';
import { config  } from './config-loader';
import * as bodyParser from "body-parser";
import {Logger} from "../logger/logger";
import {ModuleLoader} from "./module-loader";
import {Container} from "../module/container";
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
        }

        this.port = port || TangerineNestServer.PORT;

        this.logger.debug('TangerineNestServer was constructed..');
    }

    public getContainer() {
       return (() => this.modules);
    }

    public launch(): void {
        this.initWebServer();
        this.registerMiddlewares();

        this.logger.debug('Will prepare for launch.');
        const loader = new ModuleLoader(this.logger, this.config);

        loader.launch(this.app).then((container: Container) => {
            this.listen().then(() => {
                this.logger.info('Will start boot DEMO.');

                const ledModule = container.get('LedModule');
                ledModule.getManager()
                    .splash(1000,  1,   255, 2, 50);
                ledModule.getRgbCctLedDriver().setLedState(1);
            });
        });
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
