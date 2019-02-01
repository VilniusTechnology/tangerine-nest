const config = {
    ledDriver : {
        driver_type: 'i2c',
        driver : {
            i2c: i2cBus.openSync(0),
            address: 0x40,
            frequency: 4800,
            debug: false,
        },
        contours : {
            main : {
                red: 0,
                green: 1,
                blue: 2,
                coldWhite: 3,
                warmWhite: 4,
            }
        },
    },
    ledTimer: {
        database: {
            path: '/Users/lukas.mikelionis/Projects/mandarin-nest/mandarinas-settings',
        }
    },
};

module.exports = config;