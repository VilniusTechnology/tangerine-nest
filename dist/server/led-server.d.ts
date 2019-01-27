import { Logger } from 'log4js';
export declare class LedServer {
    static readonly PORT: number;
    private port;
    private app;
    private server;
    private requestHandler;
    logger: Logger;
    constructor(port?: number);
    private createServer;
    private resgisterModules;
    private registerModulesRoutes;
    private listen;
    launch(): void;
}
