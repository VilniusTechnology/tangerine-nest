import { PwmDriverFacade } from "tangerine-nest-local-light-driver";
import { Pca9685RgbCctDriverManager } from "../../../driver/pca9685-rgb-cct-driver-manager";

export class FaderAdvancedDown {
    private resolve: any;
    private reject: any;
    private pwmDriver: Pca9685RgbCctDriverManager;
    private logger; 

    constructor(pwmDriver: Pca9685RgbCctDriverManager, logger) {
        this.pwmDriver = pwmDriver;
        this.logger = logger; 
    }

    public fadeDown(from: number, to: number, channel: string,  timeout: number, step: number = 1) { 
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            // const validStep = this.getPossibleDecrease(from, to, step);
            this.initFading(from, to, channel, timeout, step);
        });
    }

    private initFading(from: number, to: number, channel: string, timeout: number, step: number) {
        const validStep = this.getPossibleDecrease(from, to, step);

        if (from == to) {
            this.resolve({from: from, to: to});
            return true;
        }
        
        if(validStep) {
            setTimeout(()=> {
                this.performFadeDown(from, to, channel, timeout, step, validStep);
            }, timeout);
        } 

        if(!validStep) {
            this.resolve(false);
            return false;
        }
    }

    private performFadeDown(from: number, to: number, channel: string, timeout: number, step: number, validStep: number) {
        from = from - validStep;

        // Will do actual light change.
        // const percentVal = this.pwmDriver.getRgbValueInPercents(from); // (Math.round(from*100)/100);
        this.pwmDriver.setColor(channel, from);
        // this.logger.debug(channel, from);

        if (from <= 0 || from < to) {
            this.resolve({from: from, to: to});
            return true;
        }
        return this.initFading(from, to, channel, timeout, step);
    }

    private getPossibleDecrease(from: number, to: number, step: number) {
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
