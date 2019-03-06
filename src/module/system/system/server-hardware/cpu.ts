import os = require('os');
import osUtils = require('os-utils');

export class Cpu  {

    constructor() {
        
    }

    getData() {
        return new Promise( (resolve, reject) => {

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