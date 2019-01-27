"use strict";
// import { i2cBus } from 'i2c-bus';
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        this.driver = {
            i2c: null,
            address: 0x40,
            frequency: 4800,
            debug: false,
        };
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map