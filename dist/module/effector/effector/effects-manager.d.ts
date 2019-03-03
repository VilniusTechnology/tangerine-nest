import { Logger } from 'log4js';
export declare class EffectsManager {
    private logger;
    private gw;
    private fader;
    constructor(fader: any, logger: Logger);
    performBootDemo(): void;
    performGW(): void;
}
