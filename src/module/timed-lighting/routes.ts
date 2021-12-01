import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { RoutesModuleBase } from '../routes-module-base';
import {TimedLightingModuleManager} from "./timed-lighting-module-manager";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = '';

    public container;
    public config;
    public logger: Logger;
    public manager: TimedLightingModuleManager;

    constructor(logger: Logger, container, config) {
        super(logger);

        this.logger = logger;
        this.config = config;
        this.config = config;
    }

    bootstrap(db) {
        this.manager = new TimedLightingModuleManager(this.config, this.logger, db);
        return this;
    }

    routes() {
        this.restapi.all('/get-light-time-programs', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /get-light-time-programs');
            this.manager.getPrograms(req, res).then( (rows) => {
                res.json(rows);
            }).catch( (err) => {
                this.logger.error('AAAAAAAA HERE 1');
            })
        });

        this.restapi.all('/add-light-time-program', bodyParser.json(), (req, res) => {
            this.logger.debug('On route: /add-light-time-program');
            this.manager.createProgram(req, res).then(() => {
                this.manager.getPrograms(req, res).then((rows) => {
                    res.json(rows);
                }).catch( (err) => {
                    this.logger.error('AAAAAAAA HERE 2');
                })
            }).catch( (err) => {
                this.logger.error('AAAAAAAA HERE 3');
            });
        });

        this.restapi.all('/reload-db', (req, res) => {
            this.logger.debug('On route: /reload-db, but wonr reload as its disabled. ');
            // this.manager.reset_db(req, res);
        });

        this.restapi.post('/edit-light-time-program', bodyParser.json(), (req, res) => {
            this.manager.update(req, res);
        });

        this.restapi.post('/delete-light-time-program', bodyParser.json(), (req, res) => {
            // this.manager.removeProgram(req, res);
        });

        return this;
    }
}