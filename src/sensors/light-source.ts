const i2c = require('i2c-bus');

export class LightSourceSensor {
    constructor() {}

    init() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    read() {
        const i2c1 = i2c.openSync(1);

        return new Promise((resolve, reject) => {
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
    const i2c1 = i2c.openSync(1);

    i2c1.writeByteSync(0x4A, 0x01, 0x0);
    i2c1.writeByteSync(0x4A, 0x02, 0x00);

    const light_lvl = i2c1.readWordSync(0x4A, 0x02);

    
    return {'light_lvl': light_lvl};
   }

//   getLightLvlInSync() {
//     const i2c1 = i2c.openSync(0);

//     i2c1.writeByteSync(0x4A, 0x01, 0x0);
//     i2c1.writeByteSync(0x4A, 0x02, 0x00);

//     const light_lvl = i2c1.readWordSync(0x4A, 0x02);

//     // this.logger.info('RAW LIGHT LVL: ' +  light_lvl );

//     return {'light_lvl': this.light_lvl};
//    }
}
