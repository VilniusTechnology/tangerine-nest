const FaderAdvanced = require('./dist/effector/fader-advanced').FaderAdvanced;
const PwmDriverPca9685 = require('./dist/driver/pwm-driver-pca9685').PwmDriverPca9685;
const PwmDriverEmulator = require('tangerine-nest-local-light-driver').PwmDriverEmulator;
const log4js = require('log4js');

const config = {
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
    }
};

const logger = log4js.getLogger();
logger.level = 'info';

const pwmDriver = new PwmDriverEmulator(config, 7777, logger);
const faderAdvanced = new FaderAdvanced(pwmDriver);

pwmDriver.onClientConnect().then( (rsp) => {
    // console.log('CONNECTED', rsp);
    GWfade().then( () => {
        GWfade().then( () => {
            setTimeout( () => {
                blinkChain().then( () => {
                    setTimeout( () => {
                        blinkChain().then( () => {
                            finalAction();
                        }); 
                    }, 300);
                });
            }, 100);
        });
    }); 
});

function GWfade() {
    const delay = 3;
    const step = 3;
    return new Promise( (resolve, reject) => {
        faderAdvanced.fadeUp(50, 255, 1, delay, step).then(() => {
            (new FaderAdvanced(pwmDriver)).fadeUp(50, 255, 3, delay, step).then( () => {
                (new FaderAdvanced(pwmDriver)).fadeDown(255, 0, 3, delay, step).then( () => {
                    resolve(true);
                });
            });
            (new FaderAdvanced(pwmDriver)).fadeDown(255, 0, 1, delay, step);
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
    return new Promise((resolve, reject) => {
        blink(1, 150, 1).then(() => {
            blink(3, 150, 1).then( () => {
                blink(1, 150, 1).then(() => {
                    blink(3, 150, 1).then( () => {
                        resolve(true);
                    });
                });
            });
        });
    })
}

function blink(color, max, delay) {
    return new Promise((resolve, reject) => {
        const faderAdvanced = new FaderAdvanced(pwmDriver);
        const prUp = faderAdvanced.fadeUp(0, max, color, delay, 5)
            .then( () => {
                faderAdvanced.fadeDown(max, 0, color, delay, 5)
                    .then( () => {
                        resolve(true);
                    });
            });
    });
}

function finalAction() {
    process.exit(1);
}
