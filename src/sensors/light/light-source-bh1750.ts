import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
var BH1750 = require('bh1750');

export class LightSourceSensorBH1750 implements LightSourceSensor {

    public logger: Logger;

    constructor(logger) {
        this.logger = logger;
        this.logger.debug('LightSourceSensorBH1750 initiated');
    }

    init() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            var light = new BH1750({
                //options
            });
            light.readLight((err, value) => {
                if (err) {
                    reject(err);
                } else {
                    this.logger.debug('LightSourceSensorBH1750: ' + value);
                    light = null;
                    resolve({light_lvl: value});
                }
            });
        });
    }
}
