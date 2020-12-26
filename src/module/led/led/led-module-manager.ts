import * as _ from 'lodash';
import { Logger } from "log4js";
import { TimedLightRegulator } from "../../../controller/regulator/timed-light-regulator";
import { Pca9685RgbCctDriverManager } from '../../../driver/pca9685-rgb-cct-driver-manager';
import { FaderAdvanced } from '../../effector/effector/fader-advanced';
import {LightSourceSensor} from "../../../sensors/light/light-source";

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

    constructor(
        config: any,
        logger: Logger,
        lightSource: LightSourceSensor,
        pwmManager: Pca9685RgbCctDriverManager,
        lightRegulator,
        fader
    ) {
        this.pwmManager = pwmManager;      
        this.logger = logger;
        this.fader = fader;

        this.colors = this.pwmManager.getState();
        this.lightSource = lightSource;
        this.timedRegulator = new TimedLightRegulator(
            config.ledTimer,
            this.pwmManager,
            this.logger
        );
        this.lightRegulator = lightRegulator;
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
        const colorsState = JSON.parse(JSON.stringify(this.colors))
        const result = Object.assign(
            colorsState,
            ledModeObj,
        );

        return result;
    }

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

    clearTimersIntervals() {
        this.timedRegulator.clearTimersIntervals();
    }

    setTimedSettings() {
        this.timedRegulator.checkIntervalsAndAjustLightSetting();
    }

    adaptLight() {
        return new Promise((resolve, reject) => {
            this.lightRegulator.adaptToConditions().then((result) => {
                resolve(result);
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
}
