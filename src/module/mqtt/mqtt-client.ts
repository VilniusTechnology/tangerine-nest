import { Logger } from 'log4js';
import { connect } from 'mqtt';
import {MqttManager} from "./mqtt-manager";

export class MqttClient {

    public config;
    public mqttClient;
    public mqttManager: MqttManager;
    public logger: Logger;

    constructor(config, logger: Logger, manager) {
        this.config = config;
        this.logger = logger;
        this.mqttManager = manager;
    }

    init() {
        // var caFile = fs.readFileSync("./hub.local/hub.local.rootCA.pem");
        // var certFile = fs.readFileSync("./hub.local/hub.local.server.crt");
        // var keyFile = fs.readFileSync("./hub.local/hub.local.server.key");
        //
        // let connectUrl = '';
        // connectUrl = `mqtts://${host}`;
        // connectUrl = `wss://${host}:8884`;
        //
        // var opts = {
        //     rejectUnauthorized: false,
        //     // username: serverUsername,
        //     // password: serverPassword,
        //     connectTimeout: 5000,
        //     reconnectPeriod: 1000,
        //     ca: [ caFile ],
        //     cert: certFile,
        //     key: keyFile
        // };


        return new Promise((resolve, reject) => {
            const options = {
                connectTimeout: this.config.mqtt.connectTimeout,
                reconnectPeriod: 500,
            };

            this.mqttClient = connect('mqtt://' + this.config.mqtt.url, options);
            this.mqttClient.on('connect', (data) => {
                resolve(true);
            });
            this.mqttClient.on('error', (error) => {
                this.logger.error('MQTT error!!! ');
                this.logger.error(error);
                reject(error);
            });
            this.mqttClient.on("offline", () => {
                this.logger.error('MQTT offline !!!');
                this.mqttClient.end();
                reject(false);
            });
        });
    }

    publish(device, data) {
        const path = this.mqttManager.buildTopic(device);
        this.publishRawDevice(path, data);
    }

    subscribeToTopic(topic, cb) {
        this.mqttClient.subscribe(topic, (err) => {
            if (err) {
                this.logger.error(err);
            }

            this.mqttClient.on('message', (topic, message) => {
                cb(topic, message);
            });

        });
    }

    unSubscribeFromTopic(topic) {
        return new Promise((resolve, reject) => {
            this.mqttClient.unsubscribe(topic, (error) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                } else {
                    resolve(topic);
                }
            })
        });

    }

    publishRawDevice(device, data) {
        this.mqttClient.publish(device, data);
    }

    buildTopic(deviceSuffix) {
        return this.getManager().buildTopic(deviceSuffix);
    }

    getManager() {
        return this.mqttManager;
    }
}
