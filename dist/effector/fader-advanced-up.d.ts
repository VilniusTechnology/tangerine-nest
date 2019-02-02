export declare class FaderAdvancedUp {
    private resolve;
    private reject;
    fadeUp(from: number, to: number, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeUp;
    private getPossibleIncrease;
}
