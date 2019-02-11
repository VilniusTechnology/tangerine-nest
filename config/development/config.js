// const i2cBus = require('i2c-bus');
let path = require('path');
let i2cBus = require('../../dist/i2c.mock.js');
let os = require('os');
// If working on raspberry-pi.
if (os.arch() == 'arm') {
    let i2cBus = require('i2c-bus')
}

require('dotenv').config({path: path.resolve(process.cwd(), 'config/production/.env')});

const config = {
    logger: {
        level: 'debug',
    },
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
            path: '/Users/lukas.mikelionis/Projects/tangerine-nest/mandarinas-settings',
        }
    },
    activeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;
