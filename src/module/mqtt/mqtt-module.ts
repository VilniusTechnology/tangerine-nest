import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';
import {LightSourceSensorBH1750} from "../../sensors/light/light-source-bh1750";
import {PirState} from "../../sensors/pir-state";
import {Bme280Sensor} from "../../sensors/bme280";
import { connect } from 'mqtt';

export class MqttModule extends ModuleBase {

    public config;
    public mqttClient;
    public logger: Logger;
    public container;

    constructor(config, logger: Logger, container) { 
        super(logger, container);

        this.config = config;
        this.logger = logger;
        this.container = container;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.mqttClient = connect('mqtt://poligonas.local');
            this.mqttClient.on('connect', () => {
                resolve({'module': 'MqttModule', container: this});
            });
        });
    }

    getClient() {
        return this.mqttClient;
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.container, this.config).listRoutes();
    }
}
