import * as _ from 'lodash';
import { Logger } from "log4js";
import { TimedLightRegulator } from "../../../controller/regulator/timed-light-regulator";
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';
import { FaderAdvanced } from '../../effector/effector/fader-advanced';

const sqlite3 = require('sqlite3').verbose();

export class LedModuleManager {
    protected pwmManager: Pca9685RgbCctDriverManager;
    protected logger: Logger;
    protected colors;

    protected timedRegulator: TimedLightRegulator;
    protected fader: FaderAdvanced;
    protected lightRegulator;
    protected dbPath;

    constructor(
        config: any,
        logger: Logger,
        pwmManager: Pca9685RgbCctDriverManager,
        lightRegulator,
        fader
    ) {
        this.pwmManager = pwmManager;      
        this.logger = logger;
        this.fader = fader;

        this.colors = this.pwmManager.getState();
        this.timedRegulator = new TimedLightRegulator(
            config.ledTimer,
            this.pwmManager,
            this.logger
        );
        this.lightRegulator = lightRegulator;
        this.dbPath = config.settingsDb.path;
    };

    setColours(colors) {
        _.forEach(colors, (val, key) => {
            if (
                key !== 'state'
                && key !== 'mode'
                && key !== 'ledMode'
                && key !== 'ledState'
                && key !== 'ledIliminationState'
            ) {
                this.logger.debug(`Will setColor: ${key} - ${val}`);
                this.colors[key].value = val;
                this.pwmManager.setColor(key, parseInt(val));
            }
        });   
    };

    setMqttColours(state) {
        let keySet = '';
        _.forEach(state.color, (val, key) => {
            if(key == 'r') { keySet = 'red'; }
            if(key == 'g') { keySet = 'green'; }
            if(key == 'b') { keySet = 'blue'; }

            if(key == 'c') { keySet = 'coldWhite'; }
            if(key == 'w') { keySet = 'warmWhite'; }

            this.logger.debug(`Will setColor: ${keySet} - ${val}`);
            this.colors[keySet].value = val;
            this.pwmManager.setColor(keySet, parseInt(val));
        });   
    };

    mute() {
        this.pwmManager.switchAllLedsOff();
        this.colors.ledState = 0;
    }

    unMute() {
        this.pwmManager.switchAllLedsOn();
        this.colors.ledState = 1;
    }

    getState() {
        let ledModeObj = {
            ledMode: Number(this.pwmManager.getLedMode())
        };
        this.colors.ledIliminationState = this.resolveLedLuminosity();
        const colorsState = JSON.parse(JSON.stringify(this.colors));

        return Object.assign(
            colorsState,
            ledModeObj,
        );
    }

    resolveLedLuminosity() {
        let colors = ["red", "green", "blue", "coldWhite", "warmWhite"];
        let i = 0;
        for (;colors[i];) {
            const value = this.colors[colors[i]].value;
            if (value > 0) {
                return 1;
            }
            i++;
        }

        return 0;
    }

    clearTimersIntervals() {
        this.timedRegulator.clearTimersIntervals();
    }

    setTimedSettings() {
        this.timedRegulator.checkIntervalsAndAjustLightSetting();
    }

    adaptLight() {
        return new Promise((resolve, reject) => {
            if (!this.lightRegulator) {
                reject(false);
            }
            this.lightRegulator.adaptToConditions().then((result) => {
                resolve(result);
            });
        });
    }

    splash(pauseDuration, fromVal = 1, toVal  = 150, step = 1, timeout = 300) {
        let wasOn = false;
        const color = 'red';

        return new Promise((resolve, reject) => {
            if (this.pwmManager.isAnythingOn()) {
                wasOn = true;
                this.logger.debug('STORING STATE');
                this.mute();
            }

            this.logger.warn('WILL FADE UP');
            this.fader.fadeUp(
                fromVal,
                toVal,
                color,
                timeout,
                step
            ).then((done) => {
                this.logger.debug('FINISHED FADE UP');
                setTimeout(() => {
                    this.logger.debug('WILL FADE DOWN');
                    this.fader.fadeDown(
                        toVal,
                        fromVal,
                        color,
                        timeout,
                        step
                    ).then(() => {
                        this.logger.debug('FINISHED FADE DOWN WILL');
                        if (wasOn) {
                            // this.loadSavedState();
                            this.logger.debug('WILL unMute');
                            this.unMute();
                        }
                        resolve(true);
                    });
                }, pauseDuration);
            }).catch((err) => {
                this.logger.error('err: ', err);
            });
        });
    }

    getLedMode() {
        return this.pwmManager.getLedMode();
    }

    setMode(mode) {
        this.pwmManager.setLedMode(mode);
    }

    getRgbCctLedDriver(): Pca9685RgbCctDriverManager {
        return this.pwmManager;
    }

    loadSavedState() {
        this.getStateFromDb().then((state:any) => {
            this.logger.info(`Loaded state: ` + JSON.stringify(state));

            // Set lights colours.
            if (state.main.ledState == 1) {
                let colors = {};
                const keys = Object.keys(state.main);

                _.forEach(keys, (val, key, ind) => {
                    if (
                        val !== 'state'
                        && val !== 'mode'
                        && val !== 'ledMode'
                        && val !== 'ledState'
                        && val !== 'ledIliminationState'
                    ) {
                        colors[val] = state.main[val].value;
                    }

                    if (key === (ind.length -1)) {
                        this.setColours(colors);
                    }
                });
            }
        }).catch((e) => {
            this.logger.error(e);
        });
    }

    getStateFromDb() {
        this.logger.debug(`getStateFromDb`);
        return new Promise((resolve, reject) => {
            this.logger.debug(`Will get State From DB.`);

            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    return this.logger.error(' DB error: ' + err.message);
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

    insertStateToDb(state) {
        const db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                return this.logger.error(' DB error: ' + err.message);
            }
        });

        const stateStr = JSON.stringify(state);
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

        this.logger.debug(`Will save state: ` + stateStr);

        db.run(
            insertQuery,
            ['LED_STATE', stateStr],
            (err, rs) => {
                if (err) {
                    return console.error(err.message);
                }
                // console.log('rs: ', rs);
                // this.logger.debug(`Rows inserted: ` + JSON.stringify(rs));
            });
        db.close();

        // db.serialize(function() {
        //     db.run("CREATE TABLE lorem (info TEXT)");
        //
        //     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        //     for (var i = 0; i < 10; i++) {
        //         stmt.run("Ipsum " + i);
        //     }
        //     stmt.finalize();
        //
        //     db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        //         console.log(row.id + ": " + row.info);
        //     });
        // });
        //
        // db.close();

        this.logger.error('Saved');
    }

    public codeToMode(code) {
        return this.pwmManager.codeToMode(code);
    }
}
