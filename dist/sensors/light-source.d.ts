export declare class LightSourceSensor {
    constructor();
    init(): Promise<{}>;
    read(): Promise<{}>;
    getStuff(): Promise<{
        'light_lvl': any;
    }>;
}
