"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class ConfigCopy {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
    }
    installConfigs() {
        const environments = [
            'development',
            'production',
        ];
        environments.forEach((environment) => {
            this.copyConfigs(environment);
        });
    }
    copyConfigs(env) {
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
exports.ConfigCopy = ConfigCopy;
//# sourceMappingURL=confog-copy.js.map