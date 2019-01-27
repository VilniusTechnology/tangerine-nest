"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Delay {
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.Delay = Delay;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=delay.js.map