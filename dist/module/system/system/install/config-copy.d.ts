export declare class ConfigCopy {
    logger: any;
    config: any;
    constructor(logger: any, config: any);
    installConfigs(): void;
    copyConfigs(env: string): void;
}
