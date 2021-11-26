import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {LightSourceSensorBH1750} from "../../sensors/light/light-source-bh1750";
import {PirState} from "../../sensors/pir-state";
import {Bme280Sensor} from "../../sensors/bme280";
import { connect } from 'mqtt';

export class SensorModule extends ModuleBase {

    public config;
    public mqttClient;
    public logger: Logger;
    public container;
    public sensor: Bme280Sensor;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;
        this.container = container;

        this.sensor = new Bme280Sensor(config.bme280, this.logger);
        this.mqttClient = container()['MqttModule'].getClient();
    }

    init() {
        return new Promise((resolve, reject) => {
            this.readAndDispatch();
            resolve({'module': 'SensorModule', container: this});
        });
    }

    readAndDispatch() {
        this.sensor.init().then(() => {

            setInterval(() => {

            }, 1500);



        }).catch((error) => {
            this.logger.error(error);
        });
    }

    read() {
        this.sensor.read().then((response) => {

            let ls = new LightSourceSensorBH1750(this.logger);
            ls.init().then((err) => {
                ls.read().then((light) => {
                    //@ts-ignore
                    response.light = light.light_lvl;

                    this.mqttClient.on('connect', () => {
                        this.logger.debug('.............   connected ');
                        this.mqttClient.publish("zigbee2mqtt/shady/sensors.all", JSON.stringify(response));
                        this.logger.debug('.............   ' + JSON.stringify(response));
                    });

                    let pirState = new PirState(this.config, this.logger);
                    pirState.read().then((pir) => {
                        //@ts-ignore
                        response.pir = pir.value;

                        ls = null;
                        pirState = null;
                    }).catch((err) => {
                        this.logger.error('PIR ERR 1');
                    });
                }).catch((err) => {
                    this.logger.error('LS ERR 2');
                    console.log(err)
                });
            }).catch((err) => {
                this.logger.error('LS ERR 3');
            });
        }).catch((error) => {
            this.logger.error(error);
        });
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container, this.config).listRoutes();
    }
}
