import { GWEffect } from './../effects/gw-effect';
import { Logger } from 'log4js';
import { FaderAdvanced } from './fader-advanced';

export class EffectsManager {
    private logger: Logger;
    private gw: GWEffect;
    private fader: FaderAdvanced;

    constructor(fader, logger: Logger) {
        this.fader = fader;
        this.logger = logger;
        this.gw = new GWEffect(this.fader);
    }

    public performBootDemo() {
        this.gw.performEffect();
    }

    public performGW() {
        return new Promise((resolve, reject) => {
            this.gw.performEffect().then((resolution) => {
                this.logger.warn('EFECT HAD FINISHED !!!');
                resolve(resolution);
            });
        });
    }
}
