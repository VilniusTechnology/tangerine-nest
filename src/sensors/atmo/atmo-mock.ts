import {AtmoSensor} from "./atmo-sensor";
import {MqttClient} from "../../module/mqtt/mqtt-client";
import {Logger} from "log4js";

export class AtmoMockSensor implements AtmoSensor {
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
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            resolve({temperature: 123456789, humidity: 123456789});
        });
    }
}