import * as BME280 from 'bme280-sensor';
import {AtmoSensor} from "./atmo-sensor";

export class AtmoBme280Sensor implements AtmoSensor{

    private bme280: BME280;

    constructor(config: any, logger, container) {
        const conf = config.atmoSensor.sensors.Bme280;
        let sensConfig = {
            i2cBusNo   : 1,
            i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS(),
        };

        if(config != null) {
            sensConfig = {
                i2cBusNo   : conf.i2cBusNo,
                i2cAddress : conf.i2cAddress,
            };
        }

        this.bme280 = new BME280(sensConfig);
    }

    public init() {
        return new Promise( (resolve, reject) => {
            this.bme280
                .init()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(`BME280 initialization failed: ${err} `);
                });
        });  
    }

    public read() {
        return new Promise( (resolve, reject) => {
            this.bme280
            .readSensorData()
            .then((data) => {
                data.temperature_Fa = BME280.convertCelciusToFahrenheit(data.temperature_C);
                data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
                data.temperature = data.temperature_C;
                data.pressure = data.pressure_hPa;

                resolve(data);
            })
            .catch((err) => {
                reject(`BME280 initialization failed: ${err} `);
            });
        });
    }


}