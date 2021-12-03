import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
var BH1750 = require('bh1750');

export class LightSourceSensorBH1750 implements LightSourceSensor {
    public config;
    public logger: Logger;
    public container;
    public sensor;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;

        this.sensor = new BH1750({
            //options
        });
    }

    init() {
        return new Promise((resolve, reject) => {
            // console.log('BH1750 init OK');
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            this.sensor.readLight((err, value) => {
                if (err) {
                    reject(err);
                } else {
                    this.log('LightSourceSensorBH1750: ' + value);
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
