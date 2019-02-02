import { Colors } from './entities/colors';
import { Logger } from 'log4js';
import { PwmDriverFacade } from 'mandarin-nest-local-light-driver';
export declare class Pca9685RgbCctDriverManager {
    private logger;
    private config;
    private pwm;
    colors: Colors;
    driver: any;
    mode: string;
    constructor(config: any, logger: Logger);
    setup(): void;
    setColor(colorName: string, value: number): void;
    getRgbValueInPercents(raw: number): number;
    setLedState(newState: number): void;
    setLedMode(mode: any): void;
    getLedMode(): any;
    getState(): Colors;
    getPwmDriver(): PwmDriverFacade;
    terminate(): void;
    getColors(): Colors;
}
