import { Logger } from "log4js";
export declare class Authorizer {
    private logger;
    private db;
    private config;
    constructor(logger: Logger);
    authenticate(email: string, password: string): Promise<{}>;
    authorize(userId: number, hash: string): Promise<{}>;
    refreshToken(userId: number, hash: string): void;
}
