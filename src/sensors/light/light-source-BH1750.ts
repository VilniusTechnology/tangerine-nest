import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
var BH1750 = require('bh1750');

export class LightSourceSensorBH1750 implements LightSourceSensor {
    public config;
    public logger: Logger;
    public container;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;
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
                    this.log('LightSourceSensorBH1750: ' + value);
                    light = null;
                    resolve({light_lvl: value});
                }
            });
        });
    }

    log(msg) {
        if (this.logger != null) {
            this.logger.debug(msg);
        }
    }
}
