const config = {
    ledDriver : {
        driver_type: 'local',
        driver : {
            i2c: null, 
            address: 0x40,
            frequency: 4800,
            debug: false,
            incommingPort: '',
            outgoingPort: '',
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
