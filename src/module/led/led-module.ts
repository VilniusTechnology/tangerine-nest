import { Fader } from '../../effector/fader';
import { LightRegulator } from '../../controller/regulator/light-regulator';
import { TimedLightRegulator } from '../../controller/regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../../driver/pca9685-rgb-cct-driver-manager";
import * as _ from 'lodash';
import { Logger } from "log4js";
import { LedServerConfig } from '../../server/model/config-model';
import { LightSourceSensor } from '../../sensors/light-source';

export class LedModule {
    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

    protected pwmManager: Pca9685RgbCctDriverManager;
    protected logger: Logger;
    protected colors;
    protected lightSource;

    protected timedRegulator: TimedLightRegulator;
    protected fader: Fader;
    protected lightRegulator;

    constructor(config: any, logger: Logger) {
        this.pwmManager = new Pca9685RgbCctDriverManager(config, logger);      
        this.logger = logger;
        this.colors = this.pwmManager.getState();
        this.lightSource = new LightSourceSensor();
        this.timedRegulator = new TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger);   
    };

    init() {
        return new Promise( (resolve, reject) => {
            this.pwmManager.setup().then((response) => {    
                this.pwmManager.setLedMode(LedModule.MANUAL_MODE_CODE);
    
                this.fader = new Fader(this.pwmManager, this.logger);
                this.lightRegulator = new LightRegulator(this.fader, this.lightSource);
    
                this.logger.info('LedModule initialized');

                resolve(true);
            }); 
        });
    }

    setColours(colors) {
        _.forEach(colors, (val, key) => {
            if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                this.pwmManager.setColor(key, val);
            }
        });
    };

    switchAllLedsOff() {
        this.colors = JSON.parse(
            JSON.stringify(this.pwmManager.getState())
        );

        this.pwmManager.setColor('red', 0);
        this.pwmManager.setColor('green', 0);
        this.pwmManager.setColor('blue', 0);
        this.pwmManager.setColor('warmWhite', 0);
        this.pwmManager.setColor('coldWhite', 0);

        this.pwmManager.setLedState(0) ;
    };

    switchAllLedsOn() {
        this.pwmManager.setColor('red', this.colors.red.value);
        this.pwmManager.setColor('green', this.colors.green.value);
        this.pwmManager.setColor('blue', this.colors.blue.value);
        this.pwmManager.setColor('warmWhite', this.colors.warmWhite.value);
        this.pwmManager.setColor('coldWhite', this.colors.coldWhite.value);

        this.pwmManager.setLedState(1) ;
    };

    getState() {
        return JSON.parse(JSON.stringify(this.pwmManager.getState()));
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
        return this.pwmManager.getLedMode();
    };

    setMode(mode) {
        this.pwmManager.setLedMode(mode);
    };

    getRgbCctLedDriver() {
        return this.pwmManager;
    }
    
};
