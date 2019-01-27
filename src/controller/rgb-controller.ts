import { LightSource } from './../sensors/light-source';
import { Fader } from './../effector/fader';
import { LightRegulator } from './regulator/light-regulator';
import { TimedLightRegulator } from './regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../driver/pca9685-rgb-cct-driver-manager";
import * as _ from 'lodash';
import { Logger } from "log4js";

export class RgbController {
    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

    protected pwmDriver: Pca9685RgbCctDriverManager;
    protected logger: Logger;
    protected colors;
    protected lightSource;

    protected timedRegulator: TimedLightRegulator;
    protected fader: Fader;
    protected lightRegulator;

    constructor(logger: Logger) {
        let pwmDriverconfig = {
            driver_type: 'local',
            // driver_type: 'i2c',
            driver : {
                i2c: null, 
                // i2c: i2cBus.openSync(0),
                address: 0x40,
                frequency: 4800,
                debug: false,
            },
            contours : {
                main : {
                    red: 0,
                    green: 1,
                    blue: 2,
                    coldWhite: 3,
                    warmWhite: 4,
                }
            }
        };

        this.pwmDriver = new Pca9685RgbCctDriverManager(pwmDriverconfig, logger);
        this.pwmDriver.setup().then((response) => {
            console.log('response', response);
        });
        this.logger = logger;
        this.colors = this.pwmDriver.getState();
        this.lightSource = new LightSource();
        this.timedRegulator = new TimedLightRegulator(this.pwmDriver, this.logger);

        this.pwmDriver.setLedMode(RgbController.MANUAL_MODE_CODE);

        this.fader = new Fader(this.pwmDriver, this.logger);
        this.lightRegulator = new LightRegulator(this.fader, this.lightSource);

        this.logger.info('debug', 'RgbController initialized');
    };

    async init() {
        // return Promise.all([
        //     this.pwmDriver.setup()
        // ]).then(function(vals) {
        //     vals.forEach((val) => {
        //         // this.pwmDriver.getState() = val;
        //         this.logger.error(`WTF IS HAPPENING: ${val}`);
        //     });
        //     return vals;
        // });
    }

    setColours(colors) {
        _.forEach(colors, (val, key) => {
            if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                this.pwmDriver.setColor(key, val);
            }
        });
    };

    switchAllLedsOff() {
        this.colors = JSON.parse(
            JSON.stringify(this.pwmDriver.getState())
        );

        this.pwmDriver.setColor('red', 0);
        this.pwmDriver.setColor('green', 0);
        this.pwmDriver.setColor('blue', 0);
        this.pwmDriver.setColor('warmWhite', 0);
        this.pwmDriver.setColor('coldWhite', 0);

        this.pwmDriver.setLedState(0) ;
    };

    switchAllLedsOn() {
        this.pwmDriver.setColor('red', this.colors.red.value);
        this.pwmDriver.setColor('green', this.colors.green.value);
        this.pwmDriver.setColor('blue', this.colors.blue.value);
        this.pwmDriver.setColor('warmWhite', this.colors.warmWhite.value);
        this.pwmDriver.setColor('coldWhite', this.colors.coldWhite.value);

        this.pwmDriver.setLedState(1) ;
    };

    getState() {
        return JSON.parse(JSON.stringify(this.pwmDriver.getState()));
    };

    clearTimersIntervals() {
        this.timedRegulator.clearTimersIntervals();
    };

    setTimedSettings() {``
        this.timedRegulator.checkIntervalsAndAjustLightSetting();
    };

    async adaptLight() {
        let result = await this.lightRegulator.adaptToConditions();
    };

    async performBootDemo() {
        var waitiner = await this.fader.performBootDemo();

        return waitiner;
    }

    getLedMode() {
        return this.pwmDriver.getLedMode();
    };

    setMode(mode) {
        this.pwmDriver.setLedMode(mode);
    };

    getRgbCctLedDriver() {
        return this.pwmDriver;
    }
    
};
