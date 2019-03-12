import { Logger } from "log4js";
export declare class DbReloader {
    logger: Logger;
    config: any;
    db: any;
    constructor(logger: any, config: any);
    performReload(): void;
    createUser(username: string, email: string, pasword: string): void;
    private setupLightPrograms;
    private setupHomeData;
    private setupUsers;
}
