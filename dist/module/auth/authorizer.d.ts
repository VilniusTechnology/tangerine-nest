import { Logger } from "log4js";
export declare class Authorizer {
    private secret;
    private logger;
    private db;
    private config;
    constructor(logger: Logger);
    authenticate(email: string, password: string): Promise<{}>;
    private setToken;
    authorize(email: any, hash: string): Promise<{}>;
    private refreshToken;
    private generateToken;
    private cleanupTokens;
}
