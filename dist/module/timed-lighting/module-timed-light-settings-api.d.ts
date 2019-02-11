export declare class TimedLightSettingsApi {
    private db;
    private restapi;
    private port;
    private hostname;
    private logger;
    config: any;
    static readonly tableName: string;
    constructor(config: any, logger?: any);
    bootstrap(): void;
    listen(): void;
    getRoutesForRegistration(): any;
    private getPrograms;
    private createProgram;
    private update;
    getAllSensorData(req: any, res: any): void;
}
