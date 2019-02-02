"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BME280 = require("bme280-sensor");
class Bme280Sensor {
    constructor(config, logger) {
        const options = {
            i2cBusNo: 1,
            i2cAddress: 0x76,
        };
        this.bme280 = new BME280(options);
    }
    init() {
        return new Promise((resolve, reject) => {
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
    read() {
        return new Promise((resolve, reject) => {
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
exports.Bme280Sensor = Bme280Sensor;
//# sourceMappingURL=bme280.js.map