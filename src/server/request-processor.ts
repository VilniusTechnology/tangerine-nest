import { LedModule } from '../module/led/led-module';
import { Logger } from 'log4js';
import { LedModuleManager } from '../module/led/led/led-module-manager';

export class RequestProcessor {

    private wereLightsRevived: boolean = false;
    private ledModuleManager: LedModuleManager;
    private logger: Logger;
    private timerOfLightAdaptor;
    
    constructor(ledModuleManager: LedModuleManager, logger) {
        this.ledModuleManager = ledModuleManager;
        this.logger = logger;

        this.logger.info('RequestProcessor initialized');
    };

    public getLedModule() {
        return this.ledModuleManager;
    }

    public resolveLedMode(query) {
        let ledModeObj = {
            ledMode: Number(this.ledModuleManager.getLedMode())
        };

        return ledModeObj;
    };

    public manageModes(query) {

        this.logger.log('debug', 'Will manage modes', query);
        // this.logger.log('error', 'LedModule.AUTO_MODE_CODE: ', LedModule.AUTO_MODE_CODE);

        // AUTO mode.
        if (query.mode == LedModule.AUTO_MODE_CODE) {
            this.logger.log('info', '-------------  Auto mode -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);
            
            this.ledModuleManager.switchAllLedsOff();
            let colors = {
                "coldWhite" : 2,
                "warmWhite" : 2, 
            };
            this.ledModuleManager.setColours(colors);
            this.timerOfLightAdaptor = setInterval( () => {  
                this.logger.log('info', 'Adapting Light');
                this.ledModuleManager.adaptLight();
            }, 5700).unref();

        }
        
        // Manual mode.
        if (query.mode == LedModule.MANUAL_MODE_CODE) {
            this.logger.log('info', '---------- Manual mode  -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);

            this.handleManualMode(query);
        }

        // Timed mode.
        if (query.mode == LedModule.TIMED_MODE_CODE) {
            this.logger.log('info', '---------- Timed mode  -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);
    
            this.handleTimedMode(query);
        }
    };

    public clearTimersIntervals() {
        
    }

    public handleTimedMode(query) {     
        let ledState = query.state;
        this.ledModuleManager.setTimedSettings();
    }

    public handleManualMode(query) {     
        let ledState = query.state;

        // Turn light on.
        if (ledState === '1' && this.ledModuleManager.getState().ledState === 0) {
            this.logger .debug('!!! WILL REVIVE !!!');
            this.ledModuleManager.switchAllLedsOn();
            this.wereLightsRevived = true;
        }

        // Set lights colours.
        if (ledState === '1' && this.wereLightsRevived === false) {
            this.logger.debug('WILL SET Colours ');
            this.ledModuleManager.setColours(query);
        }

        // Turn light off.
        if (ledState === '0') {
            this.logger.debug('!!! WILL SWITCH OFF !!!');
            this.ledModuleManager.switchAllLedsOff();
        }

        this.wereLightsRevived = false;
    };

    public returnState(query) {
        let ledModeObj = this.resolveLedMode(query);
        return Object.assign(
            this.ledModuleManager.getState(),
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
