import { sleep } from './../delay/delay';
import { BootEffect } from './../effect/effects/boot-effect';
import { Logger } from 'log4js';
import * as _ from 'lodash';

export class Fader {
    public pwmDriver;
    private logger: Logger;

    constructor(pwmDriver, logger: Logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger;
    };

    async fadeColorUpBatch(color, speed) {
        let collection = [];
        color.forEach((data) => {
            collection[color] = this.fadeColorUp(
                [data.color], 
                data.etc.from, 
                data.etc.to, 
                speed
            );
        });

        Promise.all(collection).then(function(values) {
            return new Promise((resolve, reject) => {
                resolve('ok');
            });
        });  
    }

    async fadeColorUp(color, from = 0, to = 255, speed) {
        let colorValue = from;

        for (from; from <= to; from++) { 
            console.log(speed, colorValue, from, to);
            await sleep(speed);
            await this.performValueChange('up', color, speed, colorValue);
            colorValue++;
        }

        return new Promise((resolve, reject) => {resolve('ok')});
    }

    async fadeColorDown(color, from = 0, to = 255, speed) {
        let colorValue = from;

        for (from; from >= to; from--) { 
            await sleep(speed);
            await this.performValueChange('down', color, speed, colorValue);
            colorValue--;

            console.log();
        }

        return new Promise((resolve, reject)=> {resolve('ok')});
    }

    async performValueChange(direction, color, speed, colorValue) {
        color.forEach((colorName: string) => {
            if (this.isColorOkForDeCrease(colorName) && direction == 'down') {
                this.pwmDriver.setColor(colorName, colorValue);
            }

            if (this.isColorOkForIncrease(colorName) && direction == 'up') {
                this.pwmDriver.setColor(colorName, colorValue);
            }
        });
    }

    async performBootDemo() {
        const bootEffect = new BootEffect(this);
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

    public getPwmDriver() {
        return this.pwmDriver;
    }

    public terminate() {
        this.pwmDriver.terminate();
    }
};
