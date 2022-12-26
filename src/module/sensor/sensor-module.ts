import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {MqttClient} from "../mqtt/mqtt-client";
import {AtmoSensorFactory} from "../../sensors/atmo/atmo-sensor-factory";
import {LightSourceFactory} from "../../sensors/light/light-source-factory";
import {Container} from "../container";
import { PirRunner } from '../../runners/pir';
import * as _ from 'lodash';
export class SensorModule extends ModuleBase {

    public config;
    public mqttClient: MqttClient;
    public logger: Logger;
    public container: Container;
    public atmoSensor;
    public lightSensor;
    public pirSensor;
    public allSensors;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;

        this.logger.debug('SensorModule was constructed.');
    }

    init(container: Container) {
        this.atmoSensor = (new AtmoSensorFactory(this.config, this.logger, container)).build(this.config.atmoSensor.type);
        this.lightSensor = (new LightSourceFactory(this.config, this.logger, container)).build(this.config.lightSensor.type);

        this.container = container;

        return new Promise((resolve, reject) => {
            this.logger.info('Will init Sensor Module!');
            const atmoSensorInitProm = this.atmoSensor.init();
            const lightSensorInitProm = this.lightSensor.init();

            let sensors = [];
            sensors = [
                atmoSensorInitProm,
                lightSensorInitProm,
            ];

            if (this.config.pir == true) {
                this.pirSensor = new PirRunner(this.config, this.logger, this.container);
                sensors.push(this.pirSensor.init());
            }

            Promise.all(sensors).then((rsp) => {
                container.add('SensorModule', this);
                resolve({'module': 'SensorModule', container: this});
                this.logger.debug('SensorModule was inited.');
            }).catch((error) => {
                reject({module: 'SensorModule', error: error});
            });
        });
    }

    getByTopics(data) {
        let resoponse = {};

        resoponse['temperature'] = data.temperature_C;
        resoponse['humidity'] = data.humidity;
        resoponse['illuminance'] = Math.round(data.light_lvl * 100) / 100;

        return resoponse;
    }

    read() {
        this.logger.debug('Will read Sensor Module!');
        return new Promise((resolve, reject) => {
            const atmoSensorReadProm = this.atmoSensor.read();
            const lightSensorReadProm = this.lightSensor.read();

            let sensors = [];
            sensors = [
                atmoSensorReadProm,
                lightSensorReadProm,
            ];

            if (this.config.pir == true) {
                sensors.push(this.pirSensor.read());
            }

            Promise.all(sensors).then((data) => {
                delete (data[0]['battery']);
                delete (data[0]['voltage']);

                let response = {};

                _.forEach(data, (metrics, idx, array) => {
                    for (const [key, value] of Object.entries(metrics)) {
                        response[key] = value;
                    }

                    if (idx === array.length - 1){ 
                        resolve(response);
                    }
                });  
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container, this.config).listRoutes();
    }

    getSensor(sensor) {
        return this[sensor];
    }
}
