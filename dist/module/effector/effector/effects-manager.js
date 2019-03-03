"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gw_effect_1 = require("./../effects/gw-effect");
class EffectsManager {
    constructor(fader, logger) {
        this.fader = fader;
        this.logger = logger;
        this.gw = new gw_effect_1.GWEffect(this.fader);
    }
    performBootDemo() {
        this.gw.performEffect();
    }
    performGW() {
        this.gw.performEffect();
    }
}
exports.EffectsManager = EffectsManager;
//# sourceMappingURL=effects-manager.js.map