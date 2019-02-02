export declare class Bme280Sensor {
    private bme280;
    constructor(config: any, logger: any);
    init(): Promise<{}>;
    read(): Promise<{}>;
}
