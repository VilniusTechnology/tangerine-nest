import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
import {MqttClient} from "../../module/mqtt/mqtt-client";

export class LightSourceSensorMqtt implements LightSourceSensor {
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
                this.config.lightSensor.sensors.Mqtt.device
            ).then(() => {
                this.mqttClient.subscribeToTopic(
                    this.config.lightSensor.sensors.Mqtt.device,
                    (topic, message) => {
                        const sensData = JSON.parse(message.toString());
                        resolve({light_lvl: sensData.illuminance_lux});
                    });
            });
        });
    }
}
