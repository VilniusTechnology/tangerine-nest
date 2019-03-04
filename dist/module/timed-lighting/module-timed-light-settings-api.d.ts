export declare class TimedLightSettingsApi {
    private db;
    private restapi;
    private port;
    private hostname;
    private logger;
    private config;
    static readonly tableName: string;
    constructor(config: any, logger?: any);
    init(): Promise<{}>;
    listen(): void;
    getRoutesForRegistration(): any;
    private getPrograms;
    private createProgram;
    private update;
    getAllSensorData(req: any, res: any): void;
}
