import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {MqttClient} from "../mqtt/mqtt-client";
import {AtmoSensorFactory} from "../../sensors/atmo/atmo-sensor-factory";
import {LightSourceFactory} from "../../sensors/light/light-source-factory";

export class SensorModule extends ModuleBase {

    public config;
    public mqttClient: MqttClient;
    public logger: Logger;
    public container;
    public atmoSensor;
    public lightSensor;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;
        this.container = container;

        this.atmoSensor = (new AtmoSensorFactory(config, this.logger, container)).build(this.config.atmoSensor.type);
        this.lightSensor = (new LightSourceFactory(config, this.logger, container)).build(this.config.lightSensor.type);

        this.logger.debug('SensorModule was constructed.');
    }

    init() {
        return new Promise((resolve, reject) => {
            this.logger.debug('SensorModule was inited.');
            resolve({'module': 'SensorModule', container: this});
        });
    }

    launch() {
        this.logger.debug('Will launch SensorModule');
        this.readAndDispatchMqtt();
    }

    readAndDispatchMqtt() {
        this.mqttClient = this.container()['MqttModule'].getClient();
        this.atmoSensor.init().then(() => {
            setInterval(() => {
                this.read().then((rs) => {
                    this.publishReadings(JSON.stringify(rs));
                });
            }, this.config.sensorData.checkInterval);
        }).catch((error) => {
            this.logger.error('SensorModule: ' + error);
        });
    }

    publishReadings(message) {
        this.mqttClient.publish("sensors.all", message);
    }

    read() {
        return new Promise((resolve, reject) => {
            this.atmoSensor.read().then((response) => {
                this.readLight().then((lResponse) => {
                    //@ts-ignore
                    response.light = lResponse.illuminance_lux;
                    resolve(response);
                });
            }).catch((error) => {
                this.logger.error(error);
                reject(error);
            });
        });
    }

    readLight() {
        return new Promise((resolve, reject) => {
            this.lightSensor.init().then((err) => {
                this.lightSensor.read().then((light) => {
                    resolve(light);
                }).catch((err) => {
                    this.logger.error('LS ERR 2');
                    reject(err);
                });
            }).catch((err) => {
                this.logger.error('LS ERR 3');
                reject(err);
            });
        });
    }

    readPir() {
        // let pirState = new PirState(this.config, this.logger);
        // pirState.read().then((pir) => {
        //     //@ts-ignore
        //     response.pir = pir.value;
        //
        //     ls = null;
        //     pirState = null;
        // }).catch((err) => {
        //     this.logger.error('PIR ERR 1');
        // });
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container, this.config).listRoutes();
    }

    getSensor(sensor) {
        return this[sensor];
    }
}
