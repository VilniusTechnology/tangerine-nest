import { Logger } from 'log4js';
import * as _ from "lodash";
import {LedModuleManager} from "./led/led-module-manager";
import {LedModule} from "./led-module";
import {disconnect} from "cluster";

const sqlite3 = require('sqlite3').verbose();

export class RequestProcessor {

    private wereLightsRevived: boolean = false;
    private readonly ledModuleManager: LedModuleManager;
    private logger: Logger;
    private config;
    private readonly dbPath;
    private timerOfLightAdaptor;
    
    constructor(ledModuleManager: LedModuleManager, logger, config) {
        this.ledModuleManager = ledModuleManager;
        this.logger = logger;
        this.config = config;

        this.dbPath = this.config.settingsDb.path;

        this.logger.info('RequestProcessor initialized');
    };

    public getLedModule() {
        return this.ledModuleManager;
    }

    public manageModes(query) {
        this.logger.debug(
            'Will manage modes::this.ledModuleManager.getState().ledState: ',
            this.ledModuleManager.getState().ledState
        );
        this.logger.debug('query.state: ', query.state);

        // If state changes LEDs must be set ON/OFF
        if (parseInt(query.state) != this.ledModuleManager.getState().ledState) {
            this.logger.info('State change detected, will set: ', query.state);

            // Turn ON/OFF
            query.state = parseInt(query.state);
            if (parseInt(query.state) == 1) {
                this.logger.debug('Will unmute.');
                this.ledModuleManager.unMute();
            }
            if (parseInt(query.state) == 0 || query.state == null) {
                this.logger.debug('Will mute.');
                this.ledModuleManager.mute();
                query.mode = this.ledModuleManager.getState().ledMode;

                this.ledModuleManager.clearTimersIntervals();
                clearInterval(this.timerOfLightAdaptor);
            }
        }

        // AUTO mode.
        if (query.mode == LedModule.AUTO_MODE_CODE) {
            this.logger.info('-------------  Auto mode -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);
            
            this.ledModuleManager.mute();
            let colors = {
                "coldWhite" : 1,
                "warmWhite" : 2, 
            };
            this.ledModuleManager.setColours(colors);
            this.timerOfLightAdaptor = setInterval( () => {  
                this.logger.info('Adapting Light');
                this.ledModuleManager.adaptLight().then((result) => {
                    this.logger.info(`Adapted to Light level: ${result}`);
                })
            }, this.config.lightLvl.auto.interval).unref();
        }

        // Manual mode.
        if (query.mode == LedModule.MANUAL_MODE_CODE) {
            this.logger.info('---------- Manual mode  -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);

            this.logger.info(`query.state: ${query.state}`);

            // Set lights colours.
            if (query.state == 1) {
                this.logger.debug('WILL SET Colours ');
                this.ledModuleManager.setColours(query);
            }
        }

        // Timed mode.
        if (query.mode == LedModule.TIMED_MODE_CODE) {
            this.logger.info('---------- Timed mode  -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);
    
            this.handleTimedMode(query);
        }

        const saveState = this.returnState({});
        this.logger.debug(`LED State to be saved: ${saveState}`);

        this.saveState(saveState);
    };

    public clearTimersIntervals() {
        
    }

    public handleTimedMode(query) {     
        let ledState = query.state;
        this.ledModuleManager.setTimedSettings();
    }

    public returnState(query) {
        this.logger.debug('WILL returnState: ', this.ledModuleManager.getState());

        return {
            'main': this.ledModuleManager.getState()
        };
    };

    public prepareResponse(res, data) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        res.writeHead(200, {'Content-Type': 'application/json'});

        this.logger .debug(
            'Response data: ' + JSON.stringify(data)
        );

        res.write(JSON.stringify(data));
        res.end();
    }

    saveState(saveState) {
        this.insertStateToDb(saveState);
    }

    loadSavedState() {
        setTimeout(() => {
            this.loadStateFromDb().then((state:any) => {
                this.logger.info(`Loaded state: `, state);
                const rState = state.main;

                if (rState.ledMode == null || rState.ledMode == undefined) {
                    state.ledMode = 1;
                }

                this.ledModuleManager.setMode(rState.ledMode);

                // Set lights colours.
                if (rState.ledState == 1) {
                    this.logger.debug('WILL SET Colours ');

                    let colors = {};
                    const keys = Object.keys(rState);

                    _.forEach(keys, (val, key, ind) => {
                        if (
                            val !== 'state'
                            && val !== 'mode'
                            && val !== 'ledMode'
                            && val !== 'ledState'
                            && val !== 'ledIliminationState'
                        ) {
                            colors[val] = rState[val].value;
                        }

                        if (key === (ind.length -1)) {
                            this.ledModuleManager.setColours(colors);
                        }
                    });
                }
            }).catch((e) => {
                this.logger.error(e);
            });
        }, 5500);
    }

    protected loadStateFromDb() {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Will list loadStateFromDb.`);

            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    return this.logger.error(' DB error: ', err.message);
                }
            });
            db.serialize(() => {
                db.all(
                    "SELECT value from utils WHERE key='LED_STATE'",
                     (err, stateString) => {
                         if (err) {
                             reject(err.message);
                         }

                         if (stateString == undefined || stateString[0] == undefined) {
                             reject(false);
                             return;
                         }

                         const stateObj = JSON.parse(stateString[0].value);
                         resolve(stateObj);
                    });
            });
            db.close();
        });
    }

    protected insertStateToDb(stateO) {
        const db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                return this.logger.error(' DB error: ', err.message);
            }
        });

        const stateStr = JSON.stringify(stateO);
        const insertQuery = `
                INSERT OR REPLACE INTO 'utils' (
                    'key',
                    'value'
                )
                VALUES
                (
                    ?,
                    ?
                )`;

        db.run(
            insertQuery,
            ['LED_STATE', stateStr],
            (err, rs) => {
                if (err) {
                    return console.error(err.message);
                }
                this.logger.debug(`Rows inserted`, rs);
            });
        db.close();
    }
}
