export declare class TimedLightSettingsApi {
    private db;
    private restapi;
    private port;
    private hostname;
    private logger;
    static readonly tableName: string;
    constructor(config: any, logger?: any);
    bootstrap(): void;
    listen(): void;
    getRoutesForRegistration(): any;
    private getPrograms;
    private createProgram;
    private update;
    private removeProgram;
    private reset_db;
}
