const i2cBus = require('i2c-bus');

const config = {
    logger: {
        level: 'debug',
    },
    ledDriver : {
        driver_type: 'i2c',
        driver : {
            i2c: i2cBus.openSync(1),
            address: 0x60,
            frequency: 50,
            debug: false,
        },
        contours : {
            main : {
                green: 0,
                coldWhite: 1,

                red: 4,
                blue: 5,
                warmWhite: 6,
            }
        },
        hardwareLoader: true,
    },
    ledTimer: {
        database: {
            path: '/home/madcatzx/projects/tangerine-nest/mandarinas-settings',
        },
        hardwareLoader: true,
    },
    bme280: {
        address: 0x76,
        hardwareLoader: true,
    },
    lightLvl: {
        address: 0x4A,
        hardwareLoader: true,
    }
};

module.exports = config;
