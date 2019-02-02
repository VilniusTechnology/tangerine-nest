export declare class FaderAdvanced {
    private faderUp;
    private faderDown;
    constructor();
    fadeUp(from: number, to: number, timeout: number, step?: number): Promise<{}>;
    fadeDown(from: number, to: number, timeout: number, step?: number): Promise<{}>;
}
