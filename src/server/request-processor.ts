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
        this.logger.debug('Will manage modes::this.ledModuleManager.getState().ledState: ', this.ledModuleManager.getState().ledState);
        this.logger.debug('query.state: ', query.state);

        if (parseInt(query.state) != this.ledModuleManager.getState().ledState) {

            this.logger.info('State change detected, will set: ', query.state);
            query.state = parseInt(query.state);
            if (parseInt(query.state) == 1) {
                this.logger.debug('Will unmute.');
                this.ledModuleManager.unMute();
            }

            if (parseInt(query.state) == 0 || query.state == null) {
                this.logger.debug('Will mute.');
                this.ledModuleManager.mute();
                query.mode = this.ledModuleManager.getState().ledMode;

                this.ledModuleManager.clearTimersIntervals();
                clearInterval(this.timerOfLightAdaptor);
            }
        }

        // AUTO mode.
        if (query.mode == LedModule.AUTO_MODE_CODE) {
            this.logger.info('-------------  Auto mode -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);
            
            this.ledModuleManager.switchAllLedsOff();
            let colors = {
                "coldWhite" : 1,
                "warmWhite" : 2, 
            };
            this.ledModuleManager.setColours(colors);
            this.timerOfLightAdaptor = setInterval( () => {  
                this.logger.info('Adapting Light');
                this.ledModuleManager.adaptLight().then((result) => {
                    this.logger.info(`Adapted to Light level: ${result}`);
                })
            }, 5700).unref();

        }
        
        // Manual mode.
        if (query.mode == LedModule.MANUAL_MODE_CODE) {
            this.logger.info('---------- Manual mode  -------------');
            
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);

            this.logger.info(`query.state: ${query.state}`);

            // Set lights colours.
            if (query.state == 1) {
                this.logger.debug('WILL SET Colours ');
                this.ledModuleManager.setColours(query);
            }
        }

        // Timed mode.
        if (query.mode == LedModule.TIMED_MODE_CODE) {
            this.logger.info('---------- Timed mode  -------------');
            
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

    public returnState(query) {
        let ledModeObj = this.resolveLedMode(query);
        let nst = Object.assign(
            this.ledModuleManager.getState(),
            ledModeObj,
        );

        this.logger.debug('WILL returnState: ', nst);

        return nst;
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
