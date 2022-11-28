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

        this.mqttClient = this.container.get('MqttModule').getClient();

        // {
        //     "unit_of_measurement":"ms",
        //     "state_class":"measurement",
        //     "expire_after":"120",
        //     "icon":"'$icon'",
        //     "name":"'"$name $dev $3"'",
        //     "state_topic":"'"$topic/${id}/${devx}_${1}"'",
        //     "availability_topic":"'$topic/${id}/status'",
        //     "unique_id":"'"${id}_${devx}_$1"'",
        //     "device":{
        //       "identifiers":"'${id}'",
        //       "name":"'"$name"'",
        //       "model":"'"$model"'"}
        // }

        let payload = {
            "device_class": "temperature", 
            "name": "Temperature", 
            "state_topic": "homeassistant/sensor/sensorBedroom/state", 
            "unit_of_measurement": "°C", 
            "value_template": "{{ value_json.temperature}}",
            "object_id":"sensorBedroomT",
            "unique_id": "123456",
            "device": {
                "identifiers": ["homeassistant/sensor/sensorBedroom/state"],
                "name": "Shady tangerine",
                "model": "Tangerine RPI mini",
                "manufacturer": "LM",
                "sw_version": "1.0"
            }
        };
        let discoveryTopic = "homeassistant/sensor/sensorBedroom/sensorBedroomT/config";
        this.mqttClient.publishRawDevice(discoveryTopic, JSON.stringify(payload));

        payload = {
            "device_class": "humidity", 
            "name": "Humidity", 
            "state_topic": "homeassistant/sensor/sensorBedroom/state",
            "unit_of_measurement": "%", 
            "value_template": "{{ value_json.humidity}}",
            "object_id":"sensorBedroomH",
            "unique_id": "1234567",
            "device": {
                "identifiers": ["homeassistant/sensor/sensorBedroom/state"],
                "name": "Shady tangerine",
                "model": "Tangerine RPI mini",
                "manufacturer": "LM",
                "sw_version": "1.0"
            }
        };
        discoveryTopic = "homeassistant/sensor/sensorBedroom/sensorBedroomH/config";
        this.mqttClient.publishRawDevice(discoveryTopic, JSON.stringify(payload));

        payload = {
            "device_class": "illuminance", 
            "name": "Luminosity", 
            "state_topic": "homeassistant/sensor/sensorBedroom/state",
            "unit_of_measurement": "lum", 
            "value_template": "{{ value_json.illuminance}}",
            "object_id":"sensorBedroomL",
            "unique_id": "12345678",
            "device": {
                "identifiers": ["homeassistant/sensor/sensorBedroom/state"],
                "name": "Shady tangerine",
                "model": "Tangerine RPI mini",
                "manufacturer": "LM",
                "sw_version": "1.0"
            }
        };
        discoveryTopic = "homeassistant/sensor/sensorBedroom/sensorBedroomL/config";
        this.mqttClient.publishRawDevice(discoveryTopic, JSON.stringify(payload));


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
                this.pirSensor = new PirRunner(this.config, this.logger);
                sensors.push(this.pirSensor.init());
            }

            Promise.all(sensors).then((rsp) => {
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
        console.log(this.config.sensorData.checkInterval);

        this.atmoSensor.init().then(() => {
            setInterval(() => {
                this.read().then((rs) => {
                    this.publishReadings(rs);
                }).catch();
            }, this.config.sensorData.checkInterval);
        }).catch((error) => {
            this.logger.error('SensorModule: ' + error);
        });
    }

    publishReadings(data) {
        this.mqttClient.publishRawDevice(
            "homeassistant/sensor/sensorBedroom/state", 
            JSON.stringify(this.getByTopics(data))
        );
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
