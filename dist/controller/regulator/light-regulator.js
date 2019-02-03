"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const light_source_1 = require("../../sensors/light-source");
class LightRegulator {
    constructor(fader, lightSource) {
        this.desiredLevelBottom = 4000;
        this.desiredLevelTop = 8000;
        this.fader = fader;
        this.lightSource = new light_source_1.LightSourceSensor();
    }
    async adaptToConditions() {
        let lightLevel = await this.getLightevel();
        // Get actual white state
        if (this.isToLow(lightLevel)) {
            await this.increaseCycle();
        }
        if (this.isTooMuch(lightLevel)) {
            await this.decreaseCycle();
        }
    }
    async increaseCycle() {
        let lightLevel = await this.getLightevel();
        let i = 0;
        while (this.isToLow(lightLevel)) {
            if (i > 10) {
                return false;
            }
            let data = this.fader.pwmDriver.getState();
            await this.fader.fadeColorUp(['coldWhite'], data.coldWhite.value, data.coldWhite.value + 3, 1);
            await this.fader.fadeColorUp(['warmWhite'], data.warmWhite.value, data.warmWhite.value + 3, 1);
            await this.fader.fadeColorUp(['red'], data.red.value, data.red.value + 10, 1);
            await this.fader.fadeColorUp(['green'], data.green.value, data.green.value + 1, 1);
            i++;
        }
    }
    async decreaseCycle() {
        let lightLevel = await this.getLightevel();
        let i = 0;
        while (this.isTooMuch(lightLevel)) {
            if (i > 10) {
                return false;
            }
            let data = this.fader.pwmDriver.getState();
            await this.fader.fadeColorDown(['coldWhite'], data.coldWhite.value, data.coldWhite.value - 5, 10);
            await this.fader.fadeColorDown(['warmWhite'], data.warmWhite.value, data.warmWhite.value - 5, 10);
            await this.fader.fadeColorDown(['red'], data.red.value, data.red.value - 10, 5);
            await this.fader.fadeColorDown(['green'], data.green.value, data.green.value - 1, 1);
            i++;
        }
    }
    async getLightevel() {
        // let reading = await this.lightSource.getStuff();
        let reading = { 'light_lvl': 500 };
        let lightLevel = reading.light_lvl;
        return lightLevel;
    }
    isTooMuch(lightLevel) {
        return (lightLevel > this.desiredLevelTop);
    }
    isToLow(lightLevel) {
        return (lightLevel < this.desiredLevelBottom);
    }
}
exports.LightRegulator = LightRegulator;
;
//# sourceMappingURL=light-regulator.js.map