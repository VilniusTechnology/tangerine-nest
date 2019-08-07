import { Logger } from "log4js";
export declare class DbReloader {
    logger: Logger;
    dbPath: string;
    db: any;
    constructor(logger: Logger, dbPath: string);
    performReload(): Promise<{}>;
    createUser(username: string, email: string, pasword: string): Promise<{}>;
    private setupLightPrograms;
    private setupHomeData;
    private setupUsers;
}
