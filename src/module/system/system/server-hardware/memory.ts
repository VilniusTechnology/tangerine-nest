import os = require('os');

export class Memory  {
    constructor() {

    }

    getData() {
        return new Promise( (resolve, reject) => {
            const data = {
                total_memory: os.totalmem(),
                free_memory: os.freemem(),
            };
            resolve(data);
        });
    }
}