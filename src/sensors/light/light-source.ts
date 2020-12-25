let i2cBus = require('../../dist/i2c.mock.js');
let os = require('os');

// If working on raspberry-pi.
if (os.arch() == 'arm') {
    i2cBus = require('i2c-bus');
}

export interface LightSourceSensor {
    init();
    read();
}
