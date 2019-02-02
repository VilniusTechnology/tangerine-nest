"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FaderAdvancedUp {
    fadeUp(from, to, timeout, step = 1) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            const validStep = this.getPossibleIncrease(from, to, step);
            this.initFading(from, to, timeout, step, validStep);
        });
    }
    initFading(from, to, timeout, step, validStep) {
        if (validStep) {
            setTimeout(() => {
                this.performFadeUp(from, to, timeout, step, validStep);
            }, timeout);
        }
        if (from == to) {
            this.resolve({ from: from, to: to });
            return true;
        }
        if (!validStep) {
            this.resolve(false);
            return false;
        }
    }
    performFadeUp(from, to, timeout, step, validStep) {
        // Implement real fading here.
        console.log(from, to, timeout);
        from = from + validStep;
        if (from > 255) {
            this.resolve({ from: from, to: to });
            return true;
        }
        if (from > to) {
            this.resolve({ from: from, to: to });
            return true;
        }
        return this.initFading(from, to, timeout, step, validStep);
    }
    getPossibleIncrease(from, to, step) {
        if (step == 0) {
            return false;
        }
        const futureFrom = from + step;
        if (futureFrom <= 255) {
            return step;
        }
        if (futureFrom > 255 && step > 0) {
            console.log('Will ajust increase: ', step);
            step--;
            return this.getPossibleIncrease(from, to, step);
        }
        return false;
    }
}
exports.FaderAdvancedUp = FaderAdvancedUp;
//# sourceMappingURL=fader-advanced-up.js.map