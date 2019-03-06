"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
class Memory {
    constructor() {
    }
    getData() {
        return new Promise((resolve, reject) => {
            const data = {
                total_memory: os.totalmem(),
                free_memory: os.freemem(),
            };
            resolve(data);
        });
    }
}
exports.Memory = Memory;
//# sourceMappingURL=memory.js.map