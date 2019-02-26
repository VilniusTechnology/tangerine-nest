"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BME280 = require("bme280-sensor");
class Bme280Sensor {
    constructor(config, logger) {
        if (config == null) {
            config = {
                i2cBusNo: 1,
                i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS(),
            };
        }
        this.bme280 = new BME280(config);
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
                data.temperature_Fa = BME280.convertCelciusToFahrenheit(data.temperature_C);
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