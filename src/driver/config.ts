// import { i2cBus } from 'i2c-bus';

export class Config {
    public config: {};
    public driver: {};

    constructor() {
        this.driver = {
            i2c: null, // i2cBus.openSync(0),
            address: 0x40,
            frequency: 4800,
            debug: false,
        };
    }
}