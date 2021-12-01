import { ModuleBase } from '../module-base';
import { Logger } from "log4js";
import {Routes} from "./routes";
const sqlite3 = require('sqlite3').verbose();

export class TimedLightSettingsApi extends ModuleBase {
    private db;
    public logger: Logger;
    private config;

    static readonly tableName: string = 'light_time_programs'; 
    
    constructor(config: any, logger = null, container) {
        super(logger, container);

        this.logger = logger;
        this.config = config;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.logger.info('Will init TimedLightSettingsApi module!');
            this.logger.debug(`TimedLightSettingsApi will load DB on path: ${this.config.database.path}`);

            this.db = new sqlite3.Database(this.config.database.path, (err) => {
                if (err) {
                    return this.logger.error(`TimedLightSettingsApi DB error on path: ${this.config.database.path}: `, err.message);
                }
                this.logger.debug('TimedLightSettingsApi loaded DB OK.');
            });

            this.logger.debug('  TimedLightSettingsApi was loaded. ');
            resolve({'module': 'TimedLightSettingsApi', container: this});
        })
    }

    getRoutesForRegistration() {
        return (new Routes(this.logger, this.container, this.config)).bootstrap(this.db).routes().listRoutes();
    }
}
