import { PwmDriverFacade } from 'tangerine-nest-local-light-driver';
export declare class FaderAdvanced {
    private faderUp;
    private faderDown;
    private pwmDriver;
    constructor(pwmDriver: PwmDriverFacade);
    fadeUp(from: number, to: number, channel: number, timeout: number, step?: number): Promise<{}>;
    fadeDown(from: number, to: number, timeout: number, step?: number): Promise<{}>;
}
