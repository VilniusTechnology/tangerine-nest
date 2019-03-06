import os = require('os');

export class Os  {
    constructor() {

    }

    getData() {
        return new Promise( (resolve, reject) => {
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