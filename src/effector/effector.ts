import { Logger } from "log4js";
import { Fader } from "./fader";
import { sleep } from './../delay/delay';

export class Effector {

    private logger: Logger;
    private fader: Fader;

    constructor(fader: Fader, logger: Logger) {
        this.logger = logger;
        this.fader = fader;
        this.logger.debug('constructor');
    }

    execute() {
        this.logger.info('execute...');
    }

    async zalgiris() {
        // RESET
        await this.fader.fadeColorUp(['coldWhite'], 0, 1, 2);
        await this.fader.fadeColorUp(['green'], 0, 1, 1);

        // EFFECT
        await this.fader.fadeColorUp(['green'], 55, 255, 1);
        await this.fader.fadeColorUp(['red'], 0, 255, 1);
        await sleep(1);
        await this.fader.fadeColorUp(['coldWhite'], 55, 255, 1);
        await sleep(1);
    }

    public terminate() {
        this.fader.terminate();
    }
}