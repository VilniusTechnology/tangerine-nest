import { LedModule } from './../led/led-module';
import { Disk } from './system/server-hardware/disk';
import { Memory } from './system/server-hardware/memory';
import { Os } from './system/server-hardware/os';
import { Cpu } from './system/server-hardware/cpu';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { RoutesModuleBase } from '../routes-module-base';
import { Bme280Sensor } from "../../sensors/bme280";
import {LightSourceSensorBH1750} from "../../sensors/light/light-source-bh1750";
import {PirState} from "../../sensors/pir-state";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = '';

    public config;
    public logger: Logger;
    public ledModule: LedModule;
    public sensor: Bme280Sensor;

    constructor(logger: Logger, container, config) {
        super(logger);

        this.logger = logger;
        this.config = config;
        this.sensor = new Bme280Sensor(config.bme280, this.logger);
        this.ledModule = container()['LedModule'];
        this.routes();
    }

    routes() {
        this.restapi.all('/', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /');

            const cpu = new Cpu();
            const os = new Os();
            const mem = new Memory();
            const dsk = new Disk();
            
            const cpuProm = cpu.getData();
            const oosProm = os.getData();
            const memProm = mem.getData();
            const dskProm = dsk.getData();

            Promise.all([
                cpuProm,
                oosProm,
                memProm,
                dskProm
            ]).then( (responses) => {
                const respJson = {
                    system: {
                        os: responses[1],
                        cpu: responses[0],
                        mem: responses[2],
                        // disk: {},
                    },
                    led: this.ledModule.getRgbCctLedDriver().getFullState(),
                    sensors: {},
                    modules: {},
                }
                res.write(JSON.stringify(respJson));
                res.end();
            });
        });

        this.restapi.all('/healthcheck', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /healthcheck');

            res.write('true');
            res.end();
        });

        this.restapi.all('/sensors-atmo', bodyParser.json(), (req, res) => {

            this.logger.debug('On route to: /sensors-atmo');

            this.sensor.init().then(() => {
                this.sensor.read().then((response) => {
                    res.write(JSON.stringify(response));
                    res.end();
                }).catch((error) => {
                    this.logger.error(error);
                });
            }).catch((error) => {
                this.logger.error(error);
            });
        });

        this.restapi.all('/sensors-all', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /sensors-all');

            this.sensor.init().then(() => {
                this.sensor.read().then((response) => {

                    const ls = new LightSourceSensorBH1750(this.logger);
                    ls.init().then(() => {
                        ls.read().then((light) => {
                            //@ts-ignore
                            response.light = light.light_lvl;

                            const pirState = new PirState(this.config, this.logger);
                            pirState.read().then((pir) => {
                                //@ts-ignore
                                response.pir = pir.value;

                                res.write(JSON.stringify(response));
                                res.end();
                            });
                        });
                    });
                }).catch((error) => {
                    this.logger.error(error);
                });
            }).catch((error) => {
                this.logger.error(error);
            });
        });

        this.restapi.all('/sensors-some', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /sensors-some');

            this.sensor.init().then(() => {
                this.sensor.read().then((response) => {
                    //@ts-ignore
                    response.light = light.light_lvl;
                    res.write(JSON.stringify(response));
                    res.end();
                }).catch((error) => {
                    this.logger.error(error);
                });
            }).catch((error) => {
                this.logger.error(error);
            });
        });
    }
}