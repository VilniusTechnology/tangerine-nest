import { LedServerConfig } from './model/config-model';
import { Logger } from 'log4js';
export declare class TangerineNestServer {
    static readonly PORT: number;
    private port;
    private app;
    logger: Logger;
    config: any;
    modules: any;
    constructor(configJson: LedServerConfig, port?: number);
    getContainer(): () => any;
    private resgisterModules;
    private registerModulesRoutes;
    launch(): void;
    private initWebServer;
    private registerMiddlewares;
    /**
     * Filters out CORS preflights from further operations.
     *
     * @param req
     * @param res
     * @param next
     */
    private corsMiddleware;
    private listen;
}
