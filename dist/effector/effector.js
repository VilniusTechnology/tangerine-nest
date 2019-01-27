"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("./../delay/delay");
class Effector {
    constructor(fader, logger) {
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
        await delay_1.sleep(1);
        await this.fader.fadeColorUp(['coldWhite'], 55, 255, 1);
        await delay_1.sleep(1);
    }
    terminate() {
        this.fader.terminate();
    }
}
exports.Effector = Effector;
//# sourceMappingURL=effector.js.map