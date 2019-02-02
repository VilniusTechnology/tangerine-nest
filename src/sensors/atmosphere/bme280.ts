import * as BME280 from 'bme280-sensor';
import { resolve } from 'dns';

export class Bme280Sensor {

    private bme280: BME280;

    constructor(config, logger) {
        const options = {
            i2cBusNo   : 1, // defaults to 1
            i2cAddress : 0x76, //BME280.BME280_DEFAULT_I2C_ADDRESS()
        };
        this.bme280 = new BME280(options);
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
                data.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
                data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);

                resolve(data);
            })
            .catch((err) => {
                reject(`BME280 initialization failed: ${err} `);
            });
        });
    }


}