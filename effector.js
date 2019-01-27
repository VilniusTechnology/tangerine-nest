const Effector = require('./dist/effector/effector').Effector;
const Fader = require('./dist/effector/fader').Fader;
const Pca9685RgbCctDriverManager = require('./dist/driver/pca9685-rgb-cct-driver-manager').Pca9685RgbCctDriverManager;
const sleep = require('./dist/delay/delay').sleep;

const log4js = require('log4js');
const logger = log4js.getLogger();

let pwmDriverconfig = {
    driver_type: 'local',
    // driver_type: 'i2c',
    driver : {
        i2c: null,
        // i2c: i2cBus.openSync(0),
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
    }
};

logger.level = 'debug';

const pwmDriver = new Pca9685RgbCctDriverManager(pwmDriverconfig, logger);
const fader = new Fader(pwmDriver, logger);
let effector = new Effector(fader, logger);

(async () => {
    logger.error(' ... START ... ');
    await sleep(3000);
    await effector.zalgiris();
    logger.error(' ... FINISH ... ');
    effector.terminate();
})();

effector2 = new Effector(fader, logger);

(async () => {
    logger.error(' ... START ... ');
    await effector2.zalgiris();
    logger.error(' ... FINISH ... ');
    // effector2.terminate();
})();

