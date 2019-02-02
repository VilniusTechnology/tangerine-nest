export declare class FaderAdvancedDown {
    private resolve;
    private reject;
    fadeDown(from: number, to: number, timeout: number, step?: number): Promise<{}>;
    private initFading;
    private performFadeDown;
    private getPossibleDecrease;
}
