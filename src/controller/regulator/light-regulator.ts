import { Logger } from "log4js";
import { FaderAdvanced } from '../../module/effector/effector/fader-advanced';
import {LightSourceSensor} from "../../sensors/light/light-source";

export class LightRegulator {
    private lightSource: LightSourceSensor;
    private fader: FaderAdvanced;
    private logger: Logger;
    private config;

    public desiredLevelBottom = 0;
    public desiredLevelTop = 1;

    constructor(fader, lightSource, logger, config) {
        this.fader = fader;
        this.logger = logger;
        this.lightSource = lightSource;
        this.config = config;

        this.desiredLevelTop = config.lightLvl.auto.top
        this.desiredLevelBottom = config.lightLvl.auto.bottom;
    }

    adaptToConditions() {
        // this.logger.warn(`adaptToConditions::this.desiredLevelBottom: ${this.desiredLevelBottom}`);
        // this.logger.warn(`adaptToConditions::this.desiredLevelTop: ${this.desiredLevelTop}`);

        return new Promise((resolve, reject) => {
            this.getLightevel().then( (lightLevel) => {
                if (this.config.lightLvl.auto.cutOff <= lightLevel) {
                    this.fader.getPwmDriverManager().switchAllLedsOff();
                    return;
                }

                // Get actual white state
                if (this.isToLow(lightLevel)) {
                    this.increaseCycle(lightLevel).then((lightLevel) => {
                        resolve(lightLevel);
                    });
                }
        
                if (this.isTooMuch(lightLevel)) {
                    this.decreaseCycle(lightLevel).then((lightLevel) => {
                        resolve(lightLevel);
                    });
                }
            });
        });
    }

    increaseCycle(lightLevel) {
        return new Promise((resolve, reject) => {
                this.logger.warn(`increaseCycle::lightLevel: ${lightLevel}`);
                let data = this.fader.getPwmDriverManager().getState();

                let a = this.fader.fadeUp(
                    data.coldWhite.value,
                    data.coldWhite.value + 3,
                    'coldWhite',
                    100,
                    1
                );
                let b =  this.fader.fadeUp(
                    data.warmWhite.value,
                    data.warmWhite.value + 3,
                    'warmWhite',
                    100,
                    1
                );
                let c =  this.fader.fadeUp(
                    data.red.value,
                    data.red.value + 10,
                    'red',
                    100,
                    1
                );
                let d =  this.fader.fadeUp(
                    data.green.value,
                    data.green.value + 1,
                    'green',
                    100,
                    1
                );
    
                Promise.all([a, b, c, d]).then((values) => {
                    this.getLightevel().then((lightLevel) => {
                        resolve(lightLevel);
                    });
                });
        });
    }
    
    decreaseCycle(lightLevel) {
        return new Promise((resolve, reject) => {
            this.logger.warn(`decreaseCycle::lightLevel: ${lightLevel}`);

                let data = this.fader.getPwmDriverManager().getState();

                let a =  this.fader.fadeDown(
                    data.coldWhite.value,
                    data.coldWhite.value - 5,
                    'coldWhite',
                    100,
                    1
                );
                let b =  this.fader.fadeDown(
                    data.warmWhite.value,
                    data.warmWhite.value - 5,
                    'warmWhite',
                    100,
                    1
                );
                let c =  this.fader.fadeDown(
                    data.red.value,
                    data.red.value - 10,
                    'red',
                    100,
                    1
                );
                let d =  this.fader.fadeDown(
                    data.green.value,
                    data.green.value - 1,
                    'green',
                    100,
                    1
                );

                Promise.all([a, b, c, d]).then((values) => {
                    this.getLightevel().then((lightLevel) => {
                        resolve(lightLevel);
                    });
                });
        });
    }

    getLightevel() {
        return new Promise((resolve, reject) => {
            this.lightSource.read().then((reading: any) => {
                resolve(reading.light_lvl);
            });
        });
    }

    isTooMuch(lightLevel) {
        let isIt = (lightLevel > this.desiredLevelTop);
        this.logger.debug(`isTooMuch: ${isIt}`);
        return isIt;
    }

    isToLow(lightLevel) {
        let isIt = (lightLevel < this.desiredLevelBottom);
        this.logger.debug(`isToLow: ${isIt}`);
        return isIt;
    }
};
