import {Logger} from "log4js";
import {LightSourceSensor} from "./light-source";
import {MqttClient} from "../../module/mqtt/mqtt-client";

export class LightSourceSensorMock implements LightSourceSensor {
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
            resolve({lightLvl: 123456789});
        });
    }
}
