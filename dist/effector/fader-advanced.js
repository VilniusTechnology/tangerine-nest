"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fader_advanced_up_1 = require("./fader-advanced-up");
const fader_advanced_down_1 = require("./fader-advanced-down");
class FaderAdvanced {
    constructor(pwmDriver, logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger;
        this.faderUp = new fader_advanced_up_1.FaderAdvancedUp(this.pwmDriver, logger);
        this.faderDown = new fader_advanced_down_1.FaderAdvancedDown(this.pwmDriver, logger);
    }
    fadeUp(from, to, channel, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.faderUp.fadeUp(from, to, channel, timeout, step)
                .then((data) => {
                resolve(data);
            })
                .catch((data) => {
                reject(data);
            });
        });
    }
    fadeDown(from, to, channel, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.faderDown.fadeDown(from, to, channel, timeout, step)
                .then((data) => {
                resolve(data);
            })
                .catch((data) => {
                reject(data);
            });
        });
    }
    fullOn(channel) {
        this.pwmDriver.setColor(channel, 1);
    }
    fullOff(channel) {
        this.pwmDriver.setColor(channel, 0);
    }
}
exports.FaderAdvanced = FaderAdvanced;
//# sourceMappingURL=fader-advanced.js.map