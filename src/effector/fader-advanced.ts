import { FaderAdvancedUp } from './fader-advanced-up';
import { FaderAdvancedDown } from './fader-advanced-down';

export class FaderAdvanced {

    private faderUp: FaderAdvancedUp;
    private faderDown: FaderAdvancedDown;

    constructor() {
        this.faderUp = new FaderAdvancedUp();
        this.faderDown = new FaderAdvancedDown();
    }

    public fadeUp(from: number, to: number, timeout: number, step: number = 1) {
        return new Promise((resolve, reject) => {
            this.faderUp.fadeUp(from, to, timeout, step)
            .then( (data) => {
                resolve(data);
            })
            .catch( (data) => {
                reject(data);
            });
        });
    }

    public fadeDown(from: number, to: number, timeout: number, step: number = 1) {
        return new Promise((resolve, reject) => {
            this.faderDown.fadeDown(from, to, timeout, step)
            .then( (data) => {
                resolve(data);
            })
            .catch( (data) => {
                reject(data);
            });
        });
    }
}
