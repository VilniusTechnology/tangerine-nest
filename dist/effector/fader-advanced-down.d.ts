import { PwmDriverFacade } from "tangerine-nest-local-light-driver";
export declare class FaderAdvancedDown {
    private resolve;
    private reject;
    private pwmDriver;
    constructor(pwmDriver: PwmDriverFacade);
    fadeDown(from: number, to: number, channel: number, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeDown;
    private getPossibleDecrease;
}
