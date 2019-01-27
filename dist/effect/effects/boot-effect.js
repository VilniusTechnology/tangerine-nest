"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("../../delay/delay");
class BootEffect {
    constructor(fader) {
        this.fader = fader;
    }
    ;
    async performBootDemo() {
        // YELLOW
        var speed = 40;
        await this.fader.fadeColorUpBatch([
            { 'color': 'green', 'etc': { from: 0, to: 10 } },
            { 'color': 'red', 'etc': { from: 11, to: 50 } }
        ], speed);
        await delay_1.sleep(speed * 5);
        // GREEN
        var speed = 20;
        await this.fader.fadeColorDown(['red'], 50, 0, speed);
        await delay_1.sleep(speed);
        var speed = 3;
        await this.fader.fadeColorUp(['green'], 10, 255, speed);
        await delay_1.sleep(speed * 5);
        var speed = 1;
        await this.fader.fadeColorDown(['green'], 255, 0, speed);
        // RED
        var speed = 5;
        await this.fader.fadeColorUp(['red'], 0, 255, speed);
        await delay_1.sleep(speed * 2);
        await this.fader.fadeColorDown(['red'], 255, 0, speed);
        await delay_1.sleep(speed * 5 + 150);
        // FUNNY ONE
        var speed = 15;
        await this.fader.fadeColorUp(['blue', 'red'], 0, 255, speed);
        await delay_1.sleep(speed * 3);
        this.fader.pwmDriver.setColor('blue', 0);
        speed = 1;
        await this.fader.fadeColorDown(['blue'], 255, 0, speed);
        this.fader.pwmDriver.setColor('blue', 0);
        this.fader.pwmDriver.setColor('red', 0);
        await delay_1.sleep(speed);
    }
    ;
}
exports.BootEffect = BootEffect;
;
//# sourceMappingURL=boot-effect.js.map