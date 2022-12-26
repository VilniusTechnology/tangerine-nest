import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
import { MqttClient } from '../../module/mqtt/mqtt-client';
var BH1750 = require('bh1750');

export class LightSourceSensorBH1750 implements LightSourceSensor {
    public config;
    public logger: Logger;
    public container;
    public sensor;
    public mqttClient: MqttClient;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;

        this.sensor = new BH1750({
            //options
        });
        this.mqttClient = this.container.get('MqttModule').getClient();
    }

    init() {
        this.publishReadings2Mqtt();
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

    publishReadings2Mqtt() {
        const config = this.registerNodes();
        setInterval(() => {
            this.read().then((data) => {
                this.mqttClient.publishRawDevice(config.state_topic, JSON.stringify(data));
            }).catch(() => {
                
            });
        }, 2000);
    }

    buildMqttConfig() {
        const did = this.mqttClient.hashString(this.config.hostname);
        return {
            "device_class": "illuminance",
            "name": "Illuminance " + this.config.hostname,
            "state_topic": "homeassistant/sensor/illuminance" + this.config.hostname + did + "/state",
            "unit_of_measurement": "lx", 
            "value_template": "{{ value_json.light_lvl}}",
            "object_id": "illuminance-" + this.config.hostname,
            "unique_id": this.config.hostname + did + "illuminance",   
            "device": this.mqttClient.buildDeviceConfig(),
            "discoveryTopic": "homeassistant/sensor/illuminance" + this.config.hostname + did + "/config"
        };
    }

    registerNodes() {
        const config = this.buildMqttConfig();
        this.mqttClient.publishRawDevice(config.discoveryTopic, JSON.stringify(config));

        return config;
    }
}
