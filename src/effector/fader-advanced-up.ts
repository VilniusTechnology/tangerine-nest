export class FaderAdvancedUp {

    private resolve: any;
    private reject: any;

    public fadeUp(from: number, to: number, timeout: number, step: number = 1) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            const validStep = this.getPossibleIncrease(from, to, step);
            this.initFading(from, to, timeout, step, validStep);
        });
    }

    private initFading(from: number, to: number, timeout: number, step: number, validStep: number) {
        if(validStep) {
            setTimeout(()=> {
                this.performFadeUp(from, to, timeout, step, validStep);
            }, timeout);
        } 

        if (from == to) {
            this.resolve({from: from, to: to});
            return true;
        }

        if(!validStep) {
            this.resolve(false);
            return false;
        }
    }

    private performFadeUp(from: number, to: number, timeout: number, step: number, validStep: number) {
        // Implement real fading here.
        console.log(from, to, timeout);
        
        from = from + validStep;

        if (from > 255) {
            this.resolve({from: from, to: to});
            return true;
        }

        if (from > to) {
            this.resolve({from: from, to: to});
            return true;
        }
        return this.initFading(from, to, timeout, step, validStep);
    }

    private getPossibleIncrease(from: number, to: number, step: number) {
        if (step == 0) {
            return false;
        }
        const futureFrom = from + step;

        if (futureFrom <= 255) {
            return step;
        }

        if (futureFrom > 255 && step > 0) {
            // console.log('Will ajust increase: ', step);
            step--;
            return this.getPossibleIncrease(from, to, step);
        }

        return false;
    }
}
