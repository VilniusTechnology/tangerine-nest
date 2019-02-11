import { LedModule } from '../module/led/led-module';
import { Logger } from 'log4js';

export class RequestProcessor {

    private wereLightsRevived: boolean = false;
    private ledModule: LedModule;
    private logger: Logger;
    private timerOfLightAdaptor;
    
    constructor(LedModule: LedModule, logger) {
        this.ledModule = LedModule;
        this.logger = logger;

        this.logger.log('info', 'RequestProcessor initialized');
    };

    public getLedModule() {
        return this.ledModule;
    }

    public resolveLedMode(query) {
        let ledModeObj = {
            ledMode: Number(this.ledModule.getLedMode())
        };

        return ledModeObj;
    };

    public manageModes(query) {

        this.logger.log('debug', 'Will manage modes');

        // AUTO mode.
        if (query.mode == LedModule.AUTO_MODE_CODE) {
            this.logger.log('info', '-------------  Auto mode -------------');
            
            this.ledModule.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModule.setMode(query.mode);
            
            this.ledModule.switchAllLedsOff();
            let colors = {
                "coldWhite" : 2,
                "warmWhite" : 2, 
            };
            this.ledModule.setColours(colors);
            this.timerOfLightAdaptor = setInterval( () => {  
                this.logger.log('info', 'Adapting Light');
                this.ledModule.adaptLight();
            }, 5700).unref();

        }
        
        // Manual mode.
        if (query.mode == LedModule.MANUAL_MODE_CODE) {
            this.logger.log('info', '---------- Manual mode  -------------');
            
            this.ledModule.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModule.setMode(query.mode);

            this.handleManualMode(query);
        }

        // Timed mode.
        if (query.mode == LedModule.TIMED_MODE_CODE) {
            this.logger.log('info', '---------- Timed mode  -------------');
            
            this.ledModule.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModule.setMode(query.mode);
    
            this.handleTimedMode(query);
        }
    };

    public clearTimersIntervals() {
        
    }

    public handleTimedMode(query) {     
        let ledState = query.state;
        this.ledModule.setTimedSettings();
    }

    public handleManualMode(query) {     
        let ledState = query.state;

        // Turn light on.
        if (ledState === '1' && this.ledModule.getState().ledState === 0) {
            this.logger .debug('!!! WILL REVIVE !!!');
            this.ledModule.switchAllLedsOn();
            this.wereLightsRevived = true;
        }

        // Set lights colours.
        if (ledState === '1' && this.wereLightsRevived === false) {
            this.logger.debug('WILL SET Colours ');
            this.ledModule.setColours(query);
        }

        // Turn light off.
        if (ledState === '0') {
            this.logger .debug('!!! WILL SWITCH OFF !!!');
            this.ledModule.switchAllLedsOff();
        }

        this.wereLightsRevived = false;
    };

    public returnState(query) {
        let ledModeObj = this.resolveLedMode(query);
        return Object.assign(
            this.ledModule.getState(),
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
