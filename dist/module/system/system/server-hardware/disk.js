"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disk = require("diskusage");
class Disk {
    constructor() {
    }
    getData() {
        let path = '/';
        return new Promise((resolve, reject) => {
            disk.check(path)
                .then((info) => {
                const data = {
                    available: info.available,
                    free: info.free,
                    total: info.total,
                };
                resolve(data);
            })
                .catch((err) => {
                console.error(err);
            });
        });
    }
}
exports.Disk = Disk;
//# sourceMappingURL=disk.js.map