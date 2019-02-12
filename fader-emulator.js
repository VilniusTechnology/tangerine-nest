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
    console.log('CONNECTED', rsp);

    const prUp = faderAdvanced.fadeUp(0, 100, 1, 10);
    prUp.then((data) => {
        console.log('Splash DONE', data);
        fade();
    });
});



function fade() {
    const faderAdvanced = new FaderAdvanced(pwmDriver);
    const prUp = faderAdvanced.fadeUp(250, 255, 3, 6, 1);

    let start = new Date().getTime()
    prUp.then((data) => {
        console.log('fadeUp Top LVL finished.', data);
    
        let finish = new Date().getTime();
        const execTime = finish - start;
    
        console.log(`EXEC TIME: ${execTime}`);
        finalAction();
    }).catch((data) => {
        console.log('fadeUp Top LVL finished with err.', data);
    });
}

function finalAction() {
    process.exit(1);
}
