import { FaderAdvanced } from './../effector/fader-advanced';
export declare class GWEffect {
    private faderAdvanced;
    constructor(fader: FaderAdvanced);
    performEffect(): void;
    GWfade(): Promise<{}>;
    blinkChain(): Promise<{}>;
    blinkSequence(): Promise<{}>;
    blink(color: any, max: any, delay: any): Promise<{}>;
    finalAction(): void;
}
