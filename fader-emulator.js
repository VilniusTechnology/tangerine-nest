const FaderAdvanced = require('./dist/effector/fader-advanced').FaderAdvanced;
const PwmDriverPca9685 = require('./dist/driver/pwm-driver-pca9685').PwmDriverPca9685;
const PwmDriverEmulator = require('tangerine-nest-local-light-driver').PwmDriverEmulator;
const Pca9685RgbCctDriverManager = require('./dist/driver/pca9685-rgb-cct-driver-manager').Pca9685RgbCctDriverManager;
const log4js = require('log4js');
const i2cBus = require('i2c-bus');

// const config = {
//     driver_type: 'local',
//     driver : {
//         i2c: null, 
//         address: 0x40,
//         frequency: 4800,
//         debug: false,
//         incommingPort: '',
//         outgoingPort: '',
//     },
//     contours : {
//         main : {
//             red: 0,
//             green: 1,
//             blue: 2,
//             coldWhite: 3,
//             warmWhite: 4,
//         }
//     }
// };
// const pwmDriver = new PwmDriverEmulator(config, 7777, logger);

const config = {
    ledDriver: {
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
            },
        },
    },
};
// const pwmDriver = new PwmDriverPca9685(config, logger);

const logger = log4js.getLogger();
logger.level = 'info';

const manager = new Pca9685RgbCctDriverManager(config, logger);

const faderAdvanced = new FaderAdvanced(manager, logger);

// manager.setup().then( (rsp) => {
//     console.log('CONNECTED', rsp);
//     show();
// });

manager.setup()
    .then( (data) =>{
        show();
    })
    .catch((data) =>{
        console.log(data);
    });

function show() {
    GWfade().then( () => {
        GWfade().then( () => {
            setTimeout( () => {
                blinkChain().then( () => {
                    setTimeout( () => {
                        blinkChain().then( () => {
                            blinkChain().then( () => {
                                finalAction();
                            });
                        }); 
                    }, 300);
                });
            }, 100);
        });
    }); 
}

function GWfade() {
    const delay = 3;
    const step = 3;
    const stepDown = 15;
    return new Promise( (resolve, reject) => {
        faderAdvanced.fadeUp(50, 255, 'green', delay, step).then(() => {
            (new FaderAdvanced(manager, logger)).fadeUp(50, 255, 'coldWhite', delay, step).then( () => {
                (new FaderAdvanced(manager, logger)).fadeDown(255, 0, 'coldWhite', delay, stepDown).then( () => {
                    resolve(true);
                });
            });
            (new FaderAdvanced(manager, logger)).fadeDown(255, 0, 'green', delay, stepDown);
        });
    });
}

function blinkChain() {
    return new Promise((resolve, reject) => {
        blinkSequence().then( () => {
            blinkSequence().then( () => {
                resolve(true);
            });
        });
    }); 
}

function blinkSequence() {
    const delay = 1;
    return new Promise((resolve, reject) => {
        blink('green', 150, delay).then(() => {
            blink('coldWhite', 150, delay).then( () => {
                blink('green', 150, delay).then(() => {
                    blink('coldWhite', 150, delay).then( () => {
                        resolve(true);
                    });
                });
            });
        });
    })
}

function blink(color, max, delay) {
    const from = 50;
    return new Promise((resolve, reject) => {
        const faderAdvanced = new FaderAdvanced(manager, logger);
        const prUp = faderAdvanced.fadeUp(from, max, color, delay, 5)
            .then( () => {
                faderAdvanced.fadeDown(0, from, color, delay, 5)
                    .then( () => {
                        resolve(true);
                    });
            });
    });
}

function finalAction() {
    manager.setColor('green', 0);
    manager.setColor('coldWhite', 0);
    console.log('EXITING');
    process.exit(1);
}

