import {AtmoSensor} from "./atmo-sensor";
import {MqttClient} from "../../module/mqtt/mqtt-client";
import {Logger} from "log4js";

export class AtmoMqttSensor implements AtmoSensor {
    public config;
    public logger: Logger;
    public container;
    public mqttClient: MqttClient;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.mqttClient = this.container()['MqttModule'].getClient();
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            this.mqttClient.unSubscribeFromTopic(
                this.config.atmoSensor.sensors.Mqtt.device
            ).then(() => {
                this.mqttClient.subscribeToTopic(
                    this.config.atmoSensor.sensors.Mqtt.device,
                    (topic, message) => {
                        resolve(JSON.parse(message.toString()));
                    });
            });
        });
    }
}