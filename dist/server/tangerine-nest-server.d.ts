import { LedServerConfig } from './model/config-model';
import { LedModule } from '../module/led/led-module';
import { Logger } from 'log4js';
export declare class TangerineNestServer {
    static readonly PORT: number;
    private port;
    private app;
    private server;
    private requestHandler;
    logger: Logger;
    config: any;
    controller: LedModule;
    constructor(configJson: LedServerConfig, port?: number);
    private createServer;
    private resgisterModules;
    private registerModulesRoutes;
    private listen;
    launch(): void;
}
