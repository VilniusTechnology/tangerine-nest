import * as BME280 from 'bme280-sensor';
import { Container } from '../../module/container';
import { MqttClient } from '../../module/mqtt/mqtt-client';
import {AtmoSensor} from "./atmo-sensor";

export class AtmoBme280Sensor implements AtmoSensor{

    private bme280: BME280;
    public container: Container;
    public mqttClient: MqttClient;
    public config;

    constructor(config: any, logger, container) {
        this.container = container;
        const conf = config.atmoSensor.sensors.Bme280;
        let sensConfig = {
            i2cBusNo   : 1,
            i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS(),
        };

        if(config != null) {
            sensConfig = {
                i2cBusNo   : conf.i2cBusNo,
                i2cAddress : conf.i2cAddress,
            };
        }

        this.config = config;
        this.bme280 = new BME280(sensConfig);
        this.mqttClient = this.container.get('MqttModule').getClient();
    }

    public init() {
        this.publishReadings2Mqtt();

        return new Promise( (resolve, reject) => {
            this.bme280
                .init()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(`BME280 initialization failed: ${err} `);
                });
        });
    }

    public read() {
        return new Promise( (resolve, reject) => {
            this.bme280
            .readSensorData()
            .then((data) => {
                data.temperature_Fa = BME280.convertCelciusToFahrenheit(data.temperature_C);
                data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
                data.temperature = data.temperature_C;
                data.pressure = data.pressure_hPa;

                resolve(data);
            })
            .catch((err) => {
                reject(`BME280 initialization failed: ${err} `);
            });
        });
    }

    publishReadings2Mqtt() {
        const config = this.registerNode();
        setInterval(() => {
            this.read().then((data) => {
                this.mqttClient.publishRawDevice(config.temperature.state_topic, JSON.stringify(data));
                this.mqttClient.publishRawDevice(config.humidity.state_topic, JSON.stringify(data));
                this.mqttClient.publishRawDevice(config.pressure.state_topic, JSON.stringify(data));
            }).catch(() => {
                
            });
        }, 2000);
    }

    buildMqttConfig() {
        const did = this.mqttClient.hashString(this.config.hostname);
        return {
            "temperature" : {
                "device_class": "temperature", 
                "name": "Temperature " + this.config.hostname, 
                "state_topic":  "homeassistant/sensor/temperature" + this.config.hostname + did + "/state", 
                "unit_of_measurement": "°C", 
                "value_template": "{{ value_json.temperature}}",
                "object_id": "temperature-" + this.config.hostname,
                "unique_id": this.config.hostname + did + "temperature",    
                "device": this.mqttClient.buildDeviceConfig(),
                "discoveryTopic": "homeassistant/sensor/temperature" + this.config.hostname + did + "/config"
            },
            "humidity" : {
                "device_class": "humidity", 
                "name": "Humidity " + this.config.hostname,
                "state_topic": "homeassistant/sensor/humidity" + this.config.hostname + did + "/state",
                "unit_of_measurement": "%", 
                "value_template": "{{ value_json.humidity}}",
                "object_id": "humidity-" + this.config.hostname,
                "unique_id": this.config.hostname + did + "humidity",   
                "device": this.mqttClient.buildDeviceConfig(),
                "discoveryTopic": "homeassistant/sensor/humidity" + this.config.hostname + did + "/config"
            },
            "pressure" : {
                "device_class": "pressure", 
                "name": "Pressure " + this.config.hostname,
                "state_topic": "homeassistant/sensor/pressure" + this.config.hostname + did + "/state",
                "unit_of_measurement": "hPa", 
                "value_template": "{{ value_json.pressure}}",
                "object_id": "pressure-" + this.config.hostname,
                "unique_id": this.config.hostname + did + "pressure",   
                "device": this.mqttClient.buildDeviceConfig(),
                "discoveryTopic": "homeassistant/sensor/pressure" + this.config.hostname + did + "/config"
            }
        }
    }

    registerNode() {
        const config = this.buildMqttConfig();
        this.mqttClient.publishRawDevice(config.humidity.discoveryTopic, JSON.stringify(config.humidity));
        this.mqttClient.publishRawDevice(config.temperature.discoveryTopic, JSON.stringify(config.temperature));

        return config;
    }
}
