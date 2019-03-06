"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
class Os {
    constructor() {
    }
    getData() {
        return new Promise((resolve, reject) => {
            const data = {
                hostname: os.hostname(),
                type: os.type(),
                release: os.release(),
                uptime: os.uptime(),
            };
            resolve(data);
        });
    }
}
exports.Os = Os;
//# sourceMappingURL=os.js.map