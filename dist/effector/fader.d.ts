import { Logger } from 'log4js';
export declare class Fader {
    pwmDriver: any;
    private logger;
    constructor(pwmDriver: any, logger: Logger);
    fadeColorUpBatch(color: any, speed: any): Promise<void>;
    fadeColorUp(color: any, from: number, to: number, speed: any): Promise<{}>;
    fadeColorDown(color: any, from: number, to: number, speed: any): Promise<{}>;
    performValueChange(direction: any, color: any, speed: any, colorValue: any): Promise<void>;
    performBootDemo(): Promise<void>;
    isColorOkForIncrease(colorName: any): boolean;
    isColorOkForDeCrease(colorName: any): boolean;
    getPwmDriver(): any;
    terminate(): void;
}
