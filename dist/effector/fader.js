"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("./../delay/delay");
const boot_effect_1 = require("./../effect/effects/boot-effect");
class Fader {
    constructor(pwmDriver, logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger;
    }
    ;
    async fadeColorUpBatch(color, speed) {
        let collection = [];
        color.forEach((data) => {
            collection[color] = this.fadeColorUp([data.color], data.etc.from, data.etc.to, speed);
        });
        Promise.all(collection).then(function (values) {
            return new Promise((resolve, reject) => {
                resolve('ok');
            });
        });
    }
    async fadeColorUp(color, from = 0, to = 255, speed) {
        let colorValue = from;
        for (from; from <= to; from++) {
            console.log(speed, colorValue, from, to);
            await delay_1.sleep(speed);
            await this.performValueChange('up', color, speed, colorValue);
            colorValue++;
        }
        return new Promise((resolve, reject) => { resolve('ok'); });
    }
    async fadeColorDown(color, from = 0, to = 255, speed) {
        let colorValue = from;
        for (from; from >= to; from--) {
            await delay_1.sleep(speed);
            await this.performValueChange('down', color, speed, colorValue);
            colorValue--;
            console.log();
        }
        return new Promise((resolve, reject) => { resolve('ok'); });
    }
    async performValueChange(direction, color, speed, colorValue) {
        color.forEach((colorName) => {
            if (this.isColorOkForDeCrease(colorName) && direction == 'down') {
                this.pwmDriver.setColor(colorName, colorValue);
            }
            if (this.isColorOkForIncrease(colorName) && direction == 'up') {
                this.pwmDriver.setColor(colorName, colorValue);
            }
        });
    }
    async performBootDemo() {
        const bootEffect = new boot_effect_1.BootEffect(this);
        bootEffect.performBootDemo();
    }
    isColorOkForIncrease(colorName) {
        let data = this.pwmDriver.getState();
        if (data[colorName].value >= 250) {
            return false;
        }
        return true;
    }
    isColorOkForDeCrease(colorName) {
        let data = this.pwmDriver.getState();
        if (data[colorName].value <= 0) {
            return false;
        }
        return true;
    }
    getPwmDriver() {
        return this.pwmDriver;
    }
    terminate() {
        this.pwmDriver.terminate();
    }
}
exports.Fader = Fader;
;
//# sourceMappingURL=fader.js.map