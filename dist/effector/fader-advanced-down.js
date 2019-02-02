"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FaderAdvancedDown {
    fadeDown(from, to, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            // const validStep = this.getPossibleDecrease(from, to, step);
            this.initFading(from, to, timeout, step);
        });
    }
    initFading(from, to, timeout, step) {
        const validStep = this.getPossibleDecrease(from, to, step);
        if (from == to) {
            // console.log('Should resolve down', {from: from, to: to});
            this.resolve({ from: from, to: to });
            return true;
        }
        if (validStep) {
            setTimeout(() => {
                this.performFadeDown(from, to, timeout, step, validStep);
            }, timeout);
        }
        if (!validStep) {
            this.resolve(false);
            return false;
        }
    }
    performFadeDown(from, to, timeout, step, validStep) {
        from = from - validStep;
        // Implement real fading here.
        console.log(from, to, timeout);
        if (from <= 0 || from < to) {
            this.resolve({ from: from, to: to });
            return true;
        }
        return this.initFading(from, to, timeout, step);
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
            console.log('Will ajust increase: ', step);
            step--;
            return this.getPossibleDecrease(from, to, step);
        }
        return false;
    }
}
exports.FaderAdvancedDown = FaderAdvancedDown;
//# sourceMappingURL=fader-advanced-down.js.map