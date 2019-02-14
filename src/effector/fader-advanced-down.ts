import { PwmDriverFacade } from "tangerine-nest-local-light-driver";

export class FaderAdvancedDown {
    private resolve: any;
    private reject: any;
    private pwmDriver: PwmDriverFacade;

    constructor(pwmDriver: PwmDriverFacade) {
        this.pwmDriver = pwmDriver;
    }

    public fadeDown(from: number, to: number, channel: number,  timeout: number, step: number = 1) { 
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            // const validStep = this.getPossibleDecrease(from, to, step);
            this.initFading(from, to, channel, timeout, step);
        });
    }

    private initFading(from: number, to: number, channel: number, timeout: number, step: number) {
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

    private performFadeDown(from: number, to: number, channel: number, timeout: number, step: number, validStep: number) {
        from = from - validStep;

        // Will do actual light change.
        const percentVal = (from / 100 / 3);
        this.pwmDriver.setDutyCycle(channel, percentVal);
        // console.log(channel, percentVal);

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
