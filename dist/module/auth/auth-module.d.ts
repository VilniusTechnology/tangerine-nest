import { Logger } from 'log4js';
export declare class AuthModule {
    private db;
    private config;
    private logger;
    constructor(logger: Logger);
    getRoutesForRegistration(): any;
}
