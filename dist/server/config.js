"use strict";
// // import * as dotenv from "dotenv";
// import * as dotenv from "dotenv-json";
Object.defineProperty(exports, "__esModule", { value: true });
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
const _ = require("lodash");
const config = require('./config/development/config.js');
exports.config = config;
_.forEach(config, (value) => {
    console.log('-', value);
});
//# sourceMappingURL=config.js.map