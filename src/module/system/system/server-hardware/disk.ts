import disk = require('diskusage');

export class Disk  {

    constructor() {

    }

    getData() {
        let path = '/';
        
        return new Promise( (resolve, reject) => {
            disk.check(path)
            .then( (info) => { 
                const data = {
                    available: info.available,
                    free: info.free,
                    total: info.total,
                };
                resolve(data);
            })
            .catch( (err) => { 
                console.error(err) 
            })
        });
    }
}