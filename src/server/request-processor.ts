import { RgbController } from './../controller/rgb-controller';
import { Logger } from 'log4js';

export class RequestProcessor {

    private wereLightsRevived: boolean = false;
    private rgbController: RgbController;
    private logger: Logger;
    private timerOfLightAdaptor;
    
    constructor(rgbController: RgbController, logger) {
        this.rgbController = rgbController;
        this.logger = logger;

        this.logger.log('info', 'RequestProcessor initialized');
    };

    public getRgbController() {
        return this.rgbController;
    }

    public resolveLedMode(query) {
        let ledModeObj = {
            ledMode: Number(this.rgbController.getLedMode())
        };

        return ledModeObj;
    };

    public manageModes(query) {

        this.logger.log('debug', 'Will manage modes');

        // AUTO mode.
        if (query.mode == RgbController.AUTO_MODE_CODE) {
            this.logger.log('info', '-------------  Auto mode -------------');
            
            this.rgbController.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.rgbController.setMode(query.mode);
            
            this.rgbController.switchAllLedsOff();
            let colors = {
                "coldWhite" : 2,
                "warmWhite" : 2, 
            };
            this.rgbController.setColours(colors);
            this.timerOfLightAdaptor = setInterval( () => {  
                this.logger.log('info', 'Adapting Light');
                this.rgbController.adaptLight();
            }, 5700).unref();

        }
        
        // Manual mode.
        if (query.mode == RgbController.MANUAL_MODE_CODE) {
            this.logger.log('info', '---------- Manual mode  -------------');
            
            this.rgbController.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.rgbController.setMode(query.mode);

            this.handleManualMode(query);
        }

        // Timed mode.
        if (query.mode == RgbController.TIMED_MODE_CODE) {
            this.logger.log('info', '---------- Timed mode  -------------');
            
            this.rgbController.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.rgbController.setMode(query.mode);
    
            this.handleTimedMode(query);
        }
    };

    public clearTimersIntervals() {
        
    }

    public handleTimedMode(query) {     
        let ledState = query.state;
        this.rgbController.setTimedSettings();
    }

    public handleManualMode(query) {     
        let ledState = query.state;

        // Turn light on.
        if (ledState === '1' && this.rgbController.getState().ledState === 0) {
            this.logger .debug('!!! WILL REVIVE !!!');
            this.rgbController.switchAllLedsOn();
            this.wereLightsRevived = true;
        }

        // Set lights colours.
        if (ledState === '1' && this.wereLightsRevived === false) {
            this.logger.debug('WILL SET Colours ');
            this.rgbController.setColours(query);
        }

        // Turn light off.
        if (ledState === '0') {
            this.logger .debug('!!! WILL SWITCH OFF !!!');
            this.rgbController.switchAllLedsOff();
        }

        this.wereLightsRevived = false;
    };

    public returnState(query) {
        let ledModeObj = this.resolveLedMode(query);
        return Object.assign(
            this.rgbController.getState(),
            ledModeObj,
        );
    };


    public prepareResponse(res, data) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        res.writeHead(200, {'Content-Type': 'application/json'});

        this.logger .debug(
            'Response data: ' + JSON.stringify(data)
        );

        res.write(JSON.stringify(data));
        res.end();
    };

};
