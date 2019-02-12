import { PwmDriverFacade } from "tangerine-nest-local-light-driver";
export declare class FaderAdvancedUp {
    private resolve;
    private reject;
    private pwmDriver;
    constructor(pwmDriver: PwmDriverFacade);
    fadeUp(from: number, to: number, channel: number, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeUp;
    private getPossibleIncrease;
}
