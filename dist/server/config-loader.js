"use strict";
// // import * as dotenv from "dotenv";
// import * as dotenv from "dotenv-json";
// dotenv.config();
// let path;
// switch (process.env.NODE_ENV) {
//   case "test":
//     path = `${__dirname}/../../.env.test`;
//     break;
//   case "production":
//     path = `${__dirname}/../../.env.production`;
//     break;
//   default:
//     path = `${__dirname}/../../.env.development`;
// }
// dotenv.config({ path: path });
// export const DB_PATH = process.env.DB_PATH;
Object.defineProperty(exports, "__esModule", { value: true });
const config = require(`../../config/${process.env.NODE_ENV}/config.js`);
exports.config = config;
//# sourceMappingURL=config-loader.js.map