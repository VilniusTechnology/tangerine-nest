"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i2c = require('i2c-bus');
class LightSourceSensor {
    constructor() { }
    init() { }
    read() {
        const i2c1 = i2c.openSync(0);
        return new Promise((resolve, reject) => {
            i2c1.writeByte(0x4A, 0x01, 0x0, () => {
                i2c1.writeByte(0x4A, 0x02, 0x00, () => {
                    i2c1.readWord(0x4A, 0x3, (err, rawLight) => {
                        resolve({ 'light_lvl': rawLight });
                    });
                });
            });
        });
    }
}
exports.LightSourceSensor = LightSourceSensor;
//# sourceMappingURL=light-source.js.map