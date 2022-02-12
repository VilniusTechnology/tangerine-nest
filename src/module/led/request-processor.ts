import {LedModuleManager} from "./led/led-module-manager";
import {LedModule} from "./led-module";
import {Logger} from "../../logger/logger";

export class RequestProcessor {

    private readonly ledModuleManager: LedModuleManager;
    private logger: Logger;
    private config;
    private readonly dbPath;
    private timerOfLightAdaptor;
    private manualTimeout;

    constructor(ledModuleManager: LedModuleManager, logger, config) {
        this.ledModuleManager = ledModuleManager;
        this.logger = logger;
        this.config = config;

        this.dbPath = this.config.settingsDb.path;
        this.manualTimeout = 350;

        this.logger.info('RequestProcessor was constructed');
    };

    public getLedModule() {
        return this.ledModuleManager;
    }

    public manageModes(query, res) {
        if (query.state == undefined) {
            this.respondState(res);
            return;
        }

        this.perform(query);

        setTimeout(() => {
            this.respondState(res);
        }, this.manualTimeout + 150);
    }

    protected perform(query) {
        const prevState = this.returnState();

        this.logger.debug(
            'Will manage modes [saved state]: ' +
            this.ledModuleManager.getState().ledState
        );
        this.logger.debug('Incoming state: ' + query.state);
        this.logger.debug(`LED Mode: ${this.codeToMode(query.mode)}`);

        // If state changes LEDs must be set ON/OFF
        if (parseInt(query.state) != this.ledModuleManager.getState().ledState) {
            this.logger.info('State change detected, will set: ' + query.state);

            // Turn ON/OFF
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

        // Manual mode.
        if (query.mode == LedModule.MANUAL_MODE_CODE) {
            // Cleanup timed and auto modes timers
            if (prevState.main.ledMode == LedModule.AUTO_MODE_CODE) {
                clearInterval(this.timerOfLightAdaptor);
            }
            this.ledModuleManager.clearTimersIntervals();

            // Manage manual mode.
            setTimeout(() => {
                this.ledModuleManager.setMode(query.mode);
                this.logger.info('---------- Manual mode  -------------');
                if (prevState.main.ledMode == LedModule.AUTO_MODE_CODE) {
                    this.loadSavedState();
                }

                // Set lights colours.
                if (query.state == 1 && !(prevState.main.ledMode == LedModule.AUTO_MODE_CODE)) {
                    this.logger.debug('WILL SET Colours');
                    this.ledModuleManager.setColours(query);
                }
            }, this.manualTimeout);
        }

        // AUTO mode.
        if (query.mode == LedModule.AUTO_MODE_CODE) {
            this.logger.info('-------------  Auto mode -------------');
            if (prevState.main.ledMode == LedModule.MANUAL_MODE_CODE) {
                this.returnAndSaveState();
            }

            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);

            this.timerOfLightAdaptor = setInterval( () => {
                this.logger.info('Adapting Light');
                setTimeout(() => {
                    this.ledModuleManager.adaptLight().then((result) => {
                        this.logger.info(`Adapted to Light level: ${result}`);
                    })
                }, 25);
            }, this.config.lightSensor.auto.interval).unref();
        }

        // Timed mode.
        if (query.mode == LedModule.TIMED_MODE_CODE) {
            this.logger.info('---------- Timed mode  -------------');

            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);

            this.ledModuleManager.setMode(query.mode);

            this.handleTimedMode(query);
        }
    }

    protected compareStates() {

    }

    protected returnAndSaveState() {
        const saveState = this.returnState();
        this.logger.debug('LED State to be saved:' + JSON.stringify(saveState));

        this.saveState(saveState);
    }

    public handleTimedMode(query) {
        let ledState = query.state;
        this.ledModuleManager.setTimedSettings();
    }

    public returnState() {
        return {
            'main': this.ledModuleManager.getState()
        };
    }

    public respondState(res) {
        setTimeout(() => {
            let ledStateObj = this.returnState();
            this.prepareResponse(res, ledStateObj);
        }, 300);
    }

    public prepareResponse(res, data) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        res.writeHead(200, {'Content-Type': 'application/json'});

        this.logger.debug(
            'Response data: ' + JSON.stringify(data)
        );

        res.write(JSON.stringify(data));
        res.end();
    }

    saveState(stateToSave) {
        this.ledModuleManager.insertStateToDb(stateToSave);
    }

    loadSavedState() {
        this.ledModuleManager.loadSavedState();
    }

    public codeToMode(code) {
        return this.ledModuleManager.codeToMode(code);
    }
}
