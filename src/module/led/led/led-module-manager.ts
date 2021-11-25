import * as _ from 'lodash';
import { Logger } from "log4js";
import { TimedLightRegulator } from "../../../controller/regulator/timed-light-regulator";
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';
import { FaderAdvanced } from '../../effector/effector/fader-advanced';
import {LightSourceSensor} from "../../../sensors/light/light-source";

const sqlite3 = require('sqlite3').verbose();

export class LedModuleManager {
    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

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
                this.logger.debug(`'Will setColor: ${key} - ${val}'`);
                this.colors[key].value = val;
                this.pwmManager.setColor(key, parseInt(val));
            }
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
        setTimeout(() => {
            this.loadStateFromDb().then((state:any) => {
                this.logger.info(`Loaded state: ` + JSON.stringify(state));
                const rState = state.main;

                if (rState.ledMode == null || rState.ledMode == undefined) {
                    state.ledMode = 1;
                }

                this.setMode(rState.ledMode);

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
                            this.setColours(colors);
                        }
                    });
                }
            }).catch((e) => {
                this.logger.error(e);
            });
        }, 5500);
    }

    loadStateFromDb() {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Will list loadStateFromDb.`);

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

        db.run(
            insertQuery,
            ['LED_STATE', stateStr],
            (err, rs) => {
                if (err) {
                    return console.error(err.message);
                }
                this.logger.debug(`Rows inserted: ` + rs);
            });
        db.close();

        this.logger.error('Saved');
    }
}
