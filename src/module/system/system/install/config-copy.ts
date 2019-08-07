import * as fs from "fs";

export class ConfigCopy {

    public logger;
    public config;

    constructor(logger) {
        this.logger = logger;
    }


    public installConfigs() {
        const environments = [
            'development',
            'production',
        ];

        environments.forEach((environment: string) => {
            this.copyConfigs(environment);
        });
    }

    public copyConfigs(env: string) {
        const fileNameBefore = 'config.js.dist';
        const fileNameAfter = 'config.js';
        
        const basePath = process.cwd();
        const path = `/config/${env}/`;

        const fullPath = basePath + path;
        
        this.logger.debug(` --- Configs for: ${env} --- `);
        this.logger.debug(fullPath + fileNameBefore);
        this.logger.debug(fullPath + fileNameAfter);

        fs.createReadStream(fullPath + fileNameBefore)
            .pipe(fs.createWriteStream(fullPath + fileNameAfter));
    }
}
