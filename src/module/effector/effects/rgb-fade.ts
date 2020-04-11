import { FaderAdvanced } from '../effector/fader-advanced';

export class RgbFade {

    private faderAdvanced: FaderAdvanced;
    
    constructor(fader: FaderAdvanced) {
        this.faderAdvanced = fader;
    };

    performEffect() {
        return new Promise((resolve, reject) => {
            this.threeFade().then( () => {
                resolve(true);
            });  

        });
    }
    
    threeFade() {
        const delay = 100;
        const step = 2;

        this.resetColors();

        return new Promise( (resolve, reject) => {
            this.faderAdvanced.fadeUp(0, 255, 'red', delay, step).then(() => {

                (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                .fadeDown(255, 0, 'red', delay, step);

                (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                .fadeUp(0, 255, 'green', delay, step).then( () => {
                    (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                    .fadeDown(255, 0, 'green', delay, step);

                    (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                    .fadeUp(0, 255, 'blue', delay, step).then( () => {
                        
                        (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                        .fadeDown(255, 0, 'blue', delay, step);

                        (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                        .fadeUp(255, 0, 'warmWhite', delay, step).then( () => {
                            (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                            .fadeDown(255, 0, 'warmWhite', delay, step);
                            (new FaderAdvanced(this.faderAdvanced.getPwmDriverManager(), this.faderAdvanced.getLogger()))
                            .fadeUp(255, 0, 'coldWhite', delay, step).then( () => {
                                this.resetColors();
                                resolve(true);
                            });
                        });

                    });
                });            
            });
        });
    }

    resetColors() {
        const manager = this.faderAdvanced.getPwmDriverManager();
        manager.setColor('red', 0);
        manager.setColor('green', 0);
        manager.setColor('blue', 0);

        manager.setColor('coldWhite', 0);
        manager.setColor('warmWhite', 0);
    }
};
