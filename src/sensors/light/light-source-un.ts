import {LightSourceSensor} from "./light-source";

let i2cBus = require('../../../dist/i2c.mock.js');
let os = require('os');

// If working on raspberry-pi.
if (os.arch() == 'arm') {
    i2cBus = require('i2c-bus');
}

export class LightSourceSensorUN implements LightSourceSensor {

    init() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            const i2c1 = i2cBus.openSync(3);
            i2c1.writeByte(0x4A, 0x01, 0x0, () => {
                i2c1.writeByte(0x4A, 0x02, 0x00, () => {
                    i2c1.readWord(0x4A, 0x3, (err, rawLight) => {
                        resolve({'light_lvl': rawLight});
                    });
                });
            });
        });
    }

  async getStuff() {
    const i2c1 = i2cBus.openSync(1);

    i2c1.writeByteSync(0x4A, 0x01, 0x0);
    i2c1.writeByteSync(0x4A, 0x02, 0x00);

    const light_lvl = i2c1.readWordSync(0x4A, 0x02);

    
    return {'light_lvl': light_lvl};
   }
}
