import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {MqttClient} from "../mqtt/mqtt-client";
import {AtmoSensorFactory} from "../../sensors/atmo/atmo-sensor-factory";
import {LightSourceFactory} from "../../sensors/light/light-source-factory";
import {Container} from "../container";

export class SensorModule extends ModuleBase {

    public config;
    public mqttClient: MqttClient;
    public logger: Logger;
    public container: Container;
    public atmoSensor;
    public lightSensor;

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

            Promise.all([
                atmoSensorInitProm,
                lightSensorInitProm,
            ]).then((rsp) => {
                container.add('SensorModule', this);

                this.readAndDispatchMqtt();

                resolve({'module': 'SensorModule', container: this});
                this.logger.debug('SensorModule was inited.');
            }).catch((error) => {
                reject({module: 'SensorModule', error: error});
            });
        });
    }

    readAndDispatchMqtt() {
        this.mqttClient = this.container.get('MqttModule').getClient();
        // this.atmoSensor.init().then(() => {
        //     setInterval(() => {
        //         this.read().then((rs) => {
        //             this.publishReadings(JSON.stringify(rs));
        //         }).catch();
        //     }, this.config.sensorData.checkInterval);
        // }).catch((error) => {
        //     this.logger.error('SensorModule: ' + error);
        // });
    }

    publishReadings(message) {
        this.mqttClient.publish("sensors.all", message);
    }

    read() {
        return new Promise((resolve, reject) => {

            const atmoSensorReadProm = this.atmoSensor.read();
            const lightSensorReadProm = this.lightSensor.read();

            Promise.all([
                atmoSensorReadProm,
                lightSensorReadProm,
            ]).then((data) => {
                delete (data[0]['battery']);
                delete (data[0]['voltage']);
                const response = {...data[0], ...data[1]};

                resolve(response);
            }).catch(() => {
                reject(false);
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
