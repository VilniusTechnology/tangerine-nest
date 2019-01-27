export declare class LightRegulator {
    private lightSource;
    private fader;
    desiredLevelBottom: number;
    desiredLevelTop: number;
    constructor(fader: any, lightSource: any);
    adaptToConditions(): Promise<void>;
    increaseCycle(): Promise<boolean>;
    decreaseCycle(): Promise<boolean>;
    getLightevel(): Promise<number>;
    isTooMuch(lightLevel: any): boolean;
    isToLow(lightLevel: any): boolean;
}
