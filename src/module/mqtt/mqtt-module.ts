import { Logger } from 'log4js';
import { ModuleBase } from '../module-base';
import {MqttManager} from "./mqtt-manager";
import {MqttClient} from "./mqtt-client";

export class MqttModule extends ModuleBase {

    public config;
    public mqttClient: MqttClient;
    public mqttManager: MqttManager;
    public logger: Logger;
    public container;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;
        this.container = container;

        this.mqttManager = new MqttManager(this.config, this.logger);
        this.mqttClient = new MqttClient(this.config, this.logger, this.mqttManager);
    }

    init(container) {
        return new Promise((resolve, reject) => {
            this.logger.info('Will init Mqtt Module!');
            this.mqttClient
                .init()
                .then((rs) => {
                    container.add('MqttModule', this);
                    this.logger.info('Mqtt Module Initiated!');

                    resolve({'module': 'MqttModule', container: this});
                }).catch((error) => {
                    this.logger.error('Failed to init MqttModule...');
                reject({module: 'MqttModule', error: error});
            });
        });
    }

    getRoutesForRegistration() {
        return false;
    }

    getClient() {
        return this.mqttClient;
    }

    getManager() {
        return this.mqttManager;
    }
}
