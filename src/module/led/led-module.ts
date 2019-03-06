import { ModuleBase } from './../module-base';
import { Routes } from './routes';
import { LightRegulator } from '../../controller/regulator/light-regulator';
import { TimedLightRegulator } from '../../controller/regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../../driver/pca9685-rgb-cct-driver-manager";
import * as _ from 'lodash';
import { Logger } from "log4js";
import { LightSourceSensor } from '../../sensors/light-source';
import { FaderAdvanced } from '../effector/effector/fader-advanced';
import { LedModuleManager } from './led/led-module-manager';

export class LedModule extends ModuleBase {
    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

    public fader: FaderAdvanced;
    public logger: Logger;
    public ledModuleManager: LedModuleManager;

    protected pwmManager: Pca9685RgbCctDriverManager;
    protected colors;
    protected lightSource;

    protected timedRegulator: TimedLightRegulator;
    protected lightRegulator;

    constructor(config: any, logger: Logger, container) {

        super(logger, container);

        this.pwmManager = new Pca9685RgbCctDriverManager(config, logger);      
        this.logger = logger;
        this.colors = this.pwmManager.getState();
        this.lightSource = new LightSourceSensor();
        this.lightRegulator = new LightRegulator(this.fader, this.lightSource);
        this.timedRegulator = new TimedLightRegulator(config.ledTimer, this.pwmManager, this.logger); 
        this.ledModuleManager = new LedModuleManager(config, logger, this.pwmManager);      
    };

    init() {
        this.logger.info('\x1b[41m \x1b[0m  Will init LED module!');
        return new Promise((resolve, reject) => {
            this.pwmManager.setup().then((response) => {   
                this.logger.debug('\x1b[41m \x1b[0m PwmManager is UP!'); 

                this.pwmManager.setLedMode(LedModule.MANUAL_MODE_CODE);
    
                this.fader = new FaderAdvanced(this.pwmManager, this.logger);
    
                this.logger.info('\x1b[41m \x1b[40m LedModule fully initialized \x1b[0m');

                resolve({'module': 'LedModule', container: this});
            }).catch( (err) => {
                this.logger.error(`PWM driver setup error!`, err);
            }); 
        });
    }

    getFader() {
        return this.fader;
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.ledModuleManager).listRoutes();
    }

    getRgbCctLedDriver() {
        return this.ledModuleManager.getRgbCctLedDriver();
    }
    
};
