"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV = process.env.NODE_ENV || 'development';
const config = require(`../../config/${ENV}/config.js`);
exports.config = config;
//# sourceMappingURL=config-loader.js.map