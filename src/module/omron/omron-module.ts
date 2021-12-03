import { d6t } from 'd6t';
import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import * as moment from 'moment'
import {LightSourceSensorBH1750} from "../../sensors/light/light-source-bh1750";

const config = require('../../../dist/server/config-loader');

// d6t.D6T_44L_06 = 0;
// d6t.D6T_8L_06  = 1;
// d6t.D6T_1A_01  = 2;
// d6t.D6T_1A_02  = 3;
// d6t.D6T_8L_09  = 4;

export class OmronModule extends ModuleBase {

    private config;
    public container;
    public logger: Logger;

    constructor(logger: Logger, container) {
        super(logger, container);

        this.container = container;
        this.config = config.config;
        this.logger = logger;

        this.logger.debug('Omron D6T module was constructed.');
    }

    getRoutesForRegistration() {
        return new Routes(this.logger).listRoutes();
    }

    init(container) {
        return new Promise((resolve, reject) => {
            container.add('OmronModule', this);

            if (this.config.omronSensor.enabled) {
                const d6t_devh = new d6t.d6t_devh_t();
                let isOpen = d6t.d6t_open_js(d6t_devh, 2);

                this.logger.debug('IS d6t ok: ' + isOpen);

                const client = this.container()['MqttModule'].getClient();

                this.startMonitoring(d6t_devh, client);
            }

            resolve({'module': 'OmronModule', container: this});
        });
    }

    startMonitoring (d6t_devh, client) {
        let tempDiffThresh = this.config.omronSensor.tempDiffThresh;
        let lastTemp = this.config.omronSensor.lastTemp;
        let paused = this.config.omronSensor.paused;
        let intervalStep = this.config.omronSensor.intervalStep;
        let lightLvl = this.config.omronSensor.lightLvl;
        let curTemp = this.config.omronSensor.curTemp;

        // const manager = this.getModule('LedModule').getManager();
        const manager = this.container()['LedModule'].getManager();


        setInterval(() => {
            const beginningTime = moment();
            const morningStart = moment('08:30', 'HH:mm');
            const eveningEnd = moment('23:30', 'HH:mm');
            const timeToWork = (beginningTime.isAfter(morningStart) && beginningTime.isBefore(eveningEnd));

            const isOkToWork = !paused && timeToWork;

            if(isOkToWork) {
                let data = d6t.d6t_read_js(d6t_devh);
                curTemp = parseFloat(data[1]);
                const tempDiff = curTemp - lastTemp;

                let lightLvlOk = true;
                // if(this.config.lightLvl.enabled) {
                //     let ls = new LightSourceSensorBH1750();
                //     ls.init().then(() => {
                //         ls.read().then((light) => {
                //             //@ts-ignore
                //             lightLvl = light.light_lvl;
                //         }).catch(() => {
                //
                //         });
                //     }).catch(() => {
                //
                //     });
                //     lightLvlOk = (lightLvl < 1);
                // }

                // 24 > 0.3
                // 25 > 0.4
                if (lastTemp > 25) {
                    tempDiffThresh = 0.4;
                } else {
                    tempDiffThresh = 0.3;
                }

                if (tempDiff > 0.2) {
                    const data = {
                        dateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        tempDiff: tempDiff,
                        lastTemp: lastTemp,
                        curTemp: curTemp,
                        lightLvl: lightLvl
                    };

                    client.publish("omronTrigger", JSON.stringify(data));
                }

                if (!lightLvlOk) {
                    return;
                }

                if (lastTemp > 0) {
                    const isTriggered = (tempDiff > tempDiffThresh);

                    if (isTriggered) {
                        const fadeStep = 1;
                        const fadeTimeStep = 5;
                        const fadeMin = 1;
                        const fadeMax = 255;
                        const pauseDuration = 10000;

                        this.logger.debug('INIT SPLASH tempDiff: ' + tempDiff);
                        manager.splash(pauseDuration,  fadeMin,   fadeMax, fadeStep, fadeTimeStep).then(() => {
                            paused = false;
                        });
                        paused = true;
                    }
                }
                lastTemp = curTemp;
            }

        }, intervalStep);
    }
}
