"use strict";
// const i2c = require('i2c-bus');
Object.defineProperty(exports, "__esModule", { value: true });
class LightSource {
    constructor( // logger
    ) {
        this.light_lvl = 100;
        // this.logger = logger;
    }
    async getStuff() {
        // const i2c1 = i2c.openSync(0);
        // i2c1.writeByteSync(0x4A, 0x01, 0x0);
        // i2c1.writeByteSync(0x4A, 0x02, 0x00);
        // const light_lvl = i2c1.readWordSync(0x4A, 0x02);
        // // this.logger.info('RAW LIGHT LVL: ' +  light_lvl );
        return { 'light_lvl': this.light_lvl };
    }
    getLightLvlInSync() {
        // const i2c1 = i2c.openSync(0);
        // i2c1.writeByteSync(0x4A, 0x01, 0x0);
        // i2c1.writeByteSync(0x4A, 0x02, 0x00);
        // const light_lvl = i2c1.readWordSync(0x4A, 0x02);
        // // this.logger.info('RAW LIGHT LVL: ' +  light_lvl );
        return { 'light_lvl': this.light_lvl };
    }
    async getLightLevel() {
        // const i2c1 = i2c.openSync(0);
        return new Promise((resolve, reject) => {
            //   i2c1.writeByte(0x4A, 0x01, 0x0, function() {
            //     i2c1.writeByte(0x4A, 0x02, 0x00, function() {
            //       i2c1.readWord(0x4A, 0x3, (err, rawLight) => {
            //         resolve({'light_lvl': rawLight});
            //       });
            //     });
            //   });
            resolve({ 'light_lvl': this.light_lvl });
        });
    }
}
exports.LightSource = LightSource;
//# sourceMappingURL=light-source.js.map