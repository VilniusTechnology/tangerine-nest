import {AtmoSensor} from "./atmo-sensor";
import {MqttClient} from "../../module/mqtt/mqtt-client";
import {Logger} from "log4js";
import {Container} from "../../module/container";

export class AtmoMqttSensor implements AtmoSensor {
    public config;
    public logger: Logger;
    public container: Container;
    public mqttClient: MqttClient;

    protected readings = null;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.mqttClient = this.container.get('MqttModule').getClient();

            if (this.readings == null) {
                this.mqttClient.subscribeToTopic(
                    this.config.atmoSensor.sensors.Mqtt.device,
                    (topic, message) => {
                        if(topic == this.config.atmoSensor.sensors.Mqtt.device) {
                            // console.log(topic, message.toString());
                            this.readings = JSON.parse(message.toString());
                        }
                    });
                resolve(true);
            }
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            resolve(this.readings);
        });
    }
}