"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
class Cpu {
    constructor() {
    }
    getData() {
        return new Promise((resolve, reject) => {
            resolve(os.cpus());
            // osUtils.cpuUsage((usage: any) => { 
            //     var spawn = require('child_process').spawn;
            //     var temp = spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);
            //     temp.stdout.on('data', (data) => {
            //         const response = {
            //             // usage: `CPU Usage (%): ${usage} `,
            //             // cpu_temp: `${data/1000} degrees Celcius'`,
            //         };   
            //     }); 
            // });  
        });
    }
}
exports.Cpu = Cpu;
//# sourceMappingURL=cpu.js.map