import { FaderAdvanced } from './../effector/fader-advanced';
import { resolve } from 'path';

export class GWEffect {

    private faderAdvanced: FaderAdvanced;
    
    constructor(fader: FaderAdvanced) {
        this.faderAdvanced = fader;
    };

    performEffect() {

        return new Promise((resolve, reject) => {

            this.GWfade().then( () => {
                this.GWfade().then( () => {
                    setTimeout( () => {
                        this.blinkChain().then( () => {
                            setTimeout( () => {
                                this.blinkChain().then( () => {
                                    this.blinkChain().then( () => {
                                        this.finalAction();
                                        resolve(true);
                                    });
                                }); 
                            }, 300);
                        });
                    }, 100);
                });
            });  

        });
    }
    
    GWfade() {
        const delay = 3;
        const step = 3;
        const stepDown = 15;
        return new Promise( (resolve, reject) => {
            this.faderAdvanced.fadeUp(50, 255, 'green', delay, step).then(() => {
                (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger())).fadeUp(50, 255, 'coldWhite', delay, step).then( () => {
                    (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger())).fadeDown(255, 0, 'coldWhite', delay, stepDown).then( () => {
                        resolve(true);
                    });
                });
                (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger())).fadeDown(255, 0, 'green', delay, stepDown);
            });
        });
    }
    
    blinkChain() {
        return new Promise((resolve, reject) => {
            this.blinkSequence().then( () => {
                this.blinkSequence().then( () => {
                    resolve(true);
                });
            });
        }); 
    }
    
    blinkSequence() {
        const delay = 1;
        return new Promise((resolve, reject) => {
            this.blink('green', 150, delay).then(() => {
                this.blink('coldWhite', 150, delay).then( () => {
                    this.blink('green', 150, delay).then(() => {
                        this.blink('coldWhite', 150, delay).then( () => {
                            resolve(true);
                        });
                    });
                });
            });
        })
    }
    
    blink(color, max, delay) {
        const from = 50;
        return new Promise((resolve, reject) => {
            const faderAdvanced = new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger());
            const prUp = faderAdvanced.fadeUp(from, max, color, delay, 5)
                .then( () => {
                    faderAdvanced.fadeDown(0, from, color, delay, 5)
                        .then( () => {
                            resolve(true);
                        });
                });
        });
    }
    
    finalAction() {
        // manager.setColor('green', 0);
        // manager.setColor('coldWhite', 0);
        // console.log('EXITING');
        // process.exit(1);
    }
};
