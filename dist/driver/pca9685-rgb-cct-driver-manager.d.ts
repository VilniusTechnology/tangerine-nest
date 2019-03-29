import { Colors } from './model/colors';
import { Logger } from 'log4js';
export declare class Pca9685RgbCctDriverManager {
    private logger;
    private config;
    private pwm;
    colors: Colors;
    driver: any;
    mode: string;
    constructor(config: any, logger: Logger);
    setup(): Promise<{}>;
    setColor(colorName: string, value: number): void;
    getRgbValueInPercents(raw: number): number;
    setLedState(newState: number): void;
    setLedMode(mode: any): void;
    getLedMode(): any;
    getState(): Colors;
    getFullState(): {
        colors: Colors;
        mode: any;
    };
    getPwmDriver(): any;
    terminate(): void;
    getColors(): Colors;
}
