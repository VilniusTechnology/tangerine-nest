import { Logger } from 'log4js';

export class MqttManager {

    public config;

    constructor(config, logger: Logger) {
        this.config = config;
    }

    buildTopic(deviceSuffix) {
        const config = this.config;
        const topic = `${config.mqtt.topicBase}/${config.hostname}/${deviceSuffix}`;

        return topic;
    }
}
