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
    getModule(module: string): any;
    getContainer(): () => any;
    private resgisterModules;
    private registerModulesRoutes;
    launch(): void;
    private initWebServer;
    private listen;
}
