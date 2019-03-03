"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FaderAdvancedDown {
    constructor(pwmDriver, logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger;
    }
    fadeDown(from, to, channel, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            // const validStep = this.getPossibleDecrease(from, to, step);
            this.initFading(from, to, channel, timeout, step);
        });
    }
    initFading(from, to, channel, timeout, step) {
        const validStep = this.getPossibleDecrease(from, to, step);
        if (from == to) {
            this.resolve({ from: from, to: to });
            return true;
        }
        if (validStep) {
            setTimeout(() => {
                this.performFadeDown(from, to, channel, timeout, step, validStep);
            }, timeout);
        }
        if (!validStep) {
            this.resolve(false);
            return false;
        }
    }
    performFadeDown(from, to, channel, timeout, step, validStep) {
        from = from - validStep;
        // Will do actual light change.
        // const percentVal = this.pwmDriver.getRgbValueInPercents(from); // (Math.round(from*100)/100);
        this.pwmDriver.setColor(channel, from);
        this.logger.debug(channel, from);
        if (from <= 0 || from < to) {
            this.resolve({ from: from, to: to });
            return true;
        }
        return this.initFading(from, to, channel, timeout, step);
    }
    getPossibleDecrease(from, to, step) {
        if (step == 0) {
            return false;
        }
        const futureFrom = from - step;
        // console.log('Before checking: ', futureFrom, step);
        if (futureFrom >= 0) {
            return step;
        }
        if (futureFrom <= 0 && step > 0) {
            // console.log('Will ajust increase: ', step);
            step--;
            return this.getPossibleDecrease(from, to, step);
        }
        return false;
    }
}
exports.FaderAdvancedDown = FaderAdvancedDown;
//# sourceMappingURL=fader-advanced-down.js.map