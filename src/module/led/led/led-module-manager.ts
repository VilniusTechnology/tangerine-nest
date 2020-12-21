import * as _ from 'lodash';
import { Logger } from "log4js";
import { TimedLightRegulator } from "../../../controller/regulator/timed-light-regulator";
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';
import { FaderAdvanced } from '../../effector/effector/fader-advanced';
import { LightSourceSensor } from '../../../sensors/light-source';
import { LightRegulator } from '../../../controller/regulator/light-regulator';

export class LedModuleManager {
    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

    protected pwmManager: Pca9685RgbCctDriverManager;
    protected logger: Logger;
    protected colors;
    protected lightSource;

    protected timedRegulator: TimedLightRegulator;
    protected fader: FaderAdvanced;
    protected lightRegulator;

    constructor(config: any, logger: Logger, pwmManager: Pca9685RgbCctDriverManager) {
        this.pwmManager = pwmManager;      
        this.logger = logger;
        this.fader = new FaderAdvanced(this.pwmManager, this.logger);
        this.colors = this.pwmManager.getState();
        this.lightSource = new LightSourceSensor();
        this.timedRegulator = new TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger); 
        this.lightRegulator = new LightRegulator(this.fader, this.lightSource, this.logger);  
    };

    setColours(colors) {
        console.log('colors: ', colors);
        _.forEach(colors, (val, key) => {
            console.log(0, val, key);
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
        this.switchAllLedsOff();
        this.colors.ledState = 0;
    };

    switchAllLedsOff() {
        this.logger.debug('switchAllLedsOff');
        this.colors = JSON.parse(
            JSON.stringify(this.pwmManager.getState())
        );

        this.pwmManager.setColor('red', 0);
        this.pwmManager.setColor('green', 0);
        this.pwmManager.setColor('blue', 0);
        this.pwmManager.setColor('warmWhite', 0);
        this.pwmManager.setColor('coldWhite', 0);

        this.pwmManager.setLedState(0);
    };

    unMute() {
        this.switchAllLedsOn();
        this.colors.ledState = 1;
    };
    
    switchAllLedsOn() {
        this.logger.debug('switchAllLedsOn');
        this.pwmManager.setColor('red', this.colors.red.value);
        this.pwmManager.setColor('green', this.colors.green.value);
        this.pwmManager.setColor('blue', this.colors.blue.value);
        this.pwmManager.setColor('warmWhite', this.colors.warmWhite.value);
        this.pwmManager.setColor('coldWhite', this.colors.coldWhite.value);

        this.pwmManager.setLedState(1);
    };

    resolveLedLuminosity() {
        var colors = ["red", "green", "blue", "coldWhite", "warmWhite"];
        var i = 0;
        for (;colors[i];) {
            const value = this.colors[colors[i]].value;
            if (value > 0) {
                return 1;
            }
            i++;
        }

        return 0;
    }

    getState() {
        this.colors.ledIliminationState = this.resolveLedLuminosity();

        return JSON.parse(JSON.stringify(this.colors));
    };

    clearTimersIntervals() {
        this.timedRegulator.clearTimersIntervals();
    };

    setTimedSettings() {
        this.timedRegulator.checkIntervalsAndAjustLightSetting();
    };

    adaptLight() {
        return new Promise((resolve, reject) => {
            this.lightRegulator.adaptToConditions().then((result) => {
                resolve(result);
            });
        });
        
    };

    getLedMode() {
        return this.pwmManager.getLedMode();
    };

    setMode(mode) {
        this.pwmManager.setLedMode(mode);
    };

    getRgbCctLedDriver(): Pca9685RgbCctDriverManager {
        return this.pwmManager;
    }
    
};
