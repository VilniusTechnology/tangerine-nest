import { Fader } from './../../effector/fader';
export declare class BootEffect {
    private fader;
    constructor(fader: Fader);
    performBootDemo(): Promise<void>;
}
