import { Container } from "../module/container";
import { MqttClient } from "../module/mqtt/mqtt-client";
import { PirState } from "../sensors/pir-state";

const sqlite3 = require('sqlite3').verbose();
export class PirRunner {

    config;
    logger;
    db;
    public mqttClient: MqttClient;
    public container: Container;

    constructor(config: any, logger, container) {
        this.config = config;
        this.logger = logger
        this.container = container;

        this.mqttClient = this.container.get('MqttModule').getClient();
    }

    public init () {
        // this.publishReadings2Mqtt();
        return new Promise( (resolve, reject) => {
            this.db = new sqlite3.Database(this.config.sensorData.database.path, (err) => {
                if (err) {
                    reject(`PirRunner DB error: ${err.message} `);
                }
            });

            resolve(true);
        }); 
    }

    public read() {
        return new Promise( (resolve, reject) => {
            const ADS1115 = require('ads1115');
            const connection = [1, 0x48, 'i2c-bus'];
            ADS1115.open(...connection).then((ads1115) => {
                ads1115.gain = 2;

                ads1115.measure('0+GND').then((reading) =>{
                    let res = false;

                    if (reading > 20000) {
                        res = true;
                    }

                    // console.log('PIR reading:', reading);

                    resolve(res);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public readMqtt() {
        return new Promise( (resolve, reject) => {
            const ADS1115 = require('ads1115');
            const connection = [1, 0x48, 'i2c-bus'];
            ADS1115.open(...connection).then((ads1115) => {
                ads1115.gain = 2;

                ads1115.measure('0+GND').then((reading) =>{
                    let res = false;

                    if (reading > 20000) {
                        res = true;
                    }

                    console.log('PIR reading 4 MQTT:', reading);

                    resolve(res);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public readAndPersist() {
        this.read()
            .then((stateStr) => {
                const insertQuery = `
                        INSERT OR REPLACE INTO 'store' (
                            'key',
                            'value'
                        )
                        VALUES
                        (
                            ?,
                            ?
                        )`;

                this.db.run(
                    insertQuery,
                    ['PIR_STATE', stateStr],
                    (err, rs) => {
                        if (err) {
                            this.logger.error(err.message);
                        }
                    });
            })
            .catch(() => {
                
            });
    }

    publishReadings2Mqtt() {
        const config = this.registerNodes();
        setInterval(() => {
            this.readMqtt().then((data) => {
                let resp = 0;
                if (data)  {
                    resp = 1;
                    const payload = {
                        "state": resp,
                    };
    
                    this.mqttClient.publishRawDevice(config.state_topic, JSON.stringify(payload));
                }

            }).catch((error) => {
                console.log('PIR error: ', JSON.stringify(error));
            });
        }, 1000);
    }

    buildMqttConfig() {
        const did = this.mqttClient.hashString(this.config.hostname);
        return {
            "device_class": "motion", 
            "name": "Motion sensor " + this.config.hostname,
            "state_topic": "homeassistant/binary_sensor/motion" + this.config.hostname + did + "/state",
            "availability_topic": "homeassistant/binary_sensor/motion" + this.config.hostname + did + "/availability",

            "value_template": "{{ value_json.state }}",

            "payload_on": 1,
            "payload_off": 0,

            "payload_available": "Online",
            "payload_not_available": "Offline",

            "force_update": true,
            "off_delay": 10,

            "object_id": "motion-" + this.config.hostname,
            "unique_id": this.config.hostname + did + "motion",
            
            "device": this.mqttClient.buildDeviceConfig(),
            "discoveryTopic": "homeassistant/binary_sensor/motion" + this.config.hostname + did + "/config"
        };
    }

    registerNodes() {
        const config = this.buildMqttConfig();
        this.mqttClient.publishRawDevice(config.discoveryTopic, JSON.stringify(config));

        return config;
    }
}
