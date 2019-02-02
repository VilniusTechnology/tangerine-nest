"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fader_advanced_up_1 = require("./fader-advanced-up");
const fader_advanced_down_1 = require("./fader-advanced-down");
class FaderAdvanced {
    constructor() {
        this.faderUp = new fader_advanced_up_1.FaderAdvancedUp();
        this.faderDown = new fader_advanced_down_1.FaderAdvancedDown();
    }
    fadeUp(from, to, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.faderUp.fadeUp(from, to, timeout, step)
                .then((data) => {
                resolve(data);
            })
                .catch((data) => {
                reject(data);
            });
        });
    }
    fadeDown(from, to, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.faderDown.fadeDown(from, to, timeout, step)
                .then((data) => {
                resolve(data);
            })
                .catch((data) => {
                reject(data);
            });
        });
    }
}
exports.FaderAdvanced = FaderAdvanced;
//# sourceMappingURL=fader-advanced.js.map