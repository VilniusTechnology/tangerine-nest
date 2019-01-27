export declare class LightSource {
    light_lvl: number;
    constructor();
    getStuff(): Promise<{
        'light_lvl': number;
    }>;
    getLightLvlInSync(): {
        'light_lvl': number;
    };
    getLightLevel(): Promise<{}>;
}
