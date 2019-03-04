"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const led_module_1 = require("../module/led/led-module");
class RequestProcessor {
    constructor(ledModuleManager, logger) {
        this.wereLightsRevived = false;
        this.ledModuleManager = ledModuleManager;
        this.logger = logger;
        this.logger.info('RequestProcessor initialized');
    }
    ;
    getLedModule() {
        return this.ledModuleManager;
    }
    resolveLedMode(query) {
        let ledModeObj = {
            ledMode: Number(this.ledModuleManager.getLedMode())
        };
        return ledModeObj;
    }
    ;
    manageModes(query) {
        this.logger.log('debug', 'Will manage modes');
        // AUTO mode.
        if (query.mode == led_module_1.LedModule.AUTO_MODE_CODE) {
            this.logger.log('info', '-------------  Auto mode -------------');
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);
            this.ledModuleManager.setMode(query.mode);
            this.ledModuleManager.switchAllLedsOff();
            let colors = {
                "coldWhite": 2,
                "warmWhite": 2,
            };
            this.ledModuleManager.setColours(colors);
            this.timerOfLightAdaptor = setInterval(() => {
                this.logger.log('info', 'Adapting Light');
                this.ledModuleManager.adaptLight();
            }, 5700).unref();
        }
        // Manual mode.
        if (query.mode == led_module_1.LedModule.MANUAL_MODE_CODE) {
            this.logger.log('info', '---------- Manual mode  -------------');
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);
            this.ledModuleManager.setMode(query.mode);
            this.handleManualMode(query);
        }
        // Timed mode.
        if (query.mode == led_module_1.LedModule.TIMED_MODE_CODE) {
            this.logger.log('info', '---------- Timed mode  -------------');
            this.ledModuleManager.clearTimersIntervals();
            clearInterval(this.timerOfLightAdaptor);
            this.ledModuleManager.setMode(query.mode);
            this.handleTimedMode(query);
        }
    }
    ;
    clearTimersIntervals() {
    }
    handleTimedMode(query) {
        let ledState = query.state;
        this.ledModuleManager.setTimedSettings();
    }
    handleManualMode(query) {
        let ledState = query.state;
        // Turn light on.
        if (ledState === '1' && this.ledModuleManager.getState().ledState === 0) {
            this.logger.debug('!!! WILL REVIVE !!!');
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
    }
    ;
    returnState(query) {
        let ledModeObj = this.resolveLedMode(query);
        return Object.assign(this.ledModuleManager.getState(), ledModeObj);
    }
    ;
    prepareResponse(res, data) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        this.logger.debug('Response data: ' + JSON.stringify(data));
        res.write(JSON.stringify(data));
        res.end();
    }
    ;
}
exports.RequestProcessor = RequestProcessor;
;
//# sourceMappingURL=request-processor.js.map