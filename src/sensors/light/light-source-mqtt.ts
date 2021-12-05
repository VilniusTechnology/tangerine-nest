import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
import {MqttClient} from "../../module/mqtt/mqtt-client";

export class LightSourceSensorMqtt implements LightSourceSensor {
    public config;
    public logger: Logger;
    public container;
    public mqttClient: MqttClient;

    protected readings = null;

    constructor(config: any, logger, container) {
        this.container = container;
        this.config = config;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.mqttClient = this.container.get('MqttModule').getClient();
            // if (this.readings == null) {
                this.mqttClient.subscribeToTopic(
                    this.config.lightSensor.sensors.Mqtt.device,
                    (topic, message) => {
                        if (topic == this.config.lightSensor.sensors.Mqtt.device) {
                            const sensData = JSON.parse(message.toString());
                            this.readings = {light_lvl: sensData.illuminance_lux};
                        }
                        resolve(true);
                    });
            // }
            // resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            resolve(this.readings);
        });
    }
}
