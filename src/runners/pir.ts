import { PirState } from "../sensors/pir-state";

const sqlite3 = require('sqlite3').verbose();
export class PirRunner {

    config;
    logger;
    db;

    constructor(config: any, logger) {
        this.config = config;
        this.logger = logger
    }

    public init () {
        return new Promise( (resolve, reject) => {
            this.db = new sqlite3.Database(this.config.sensorData.database.path, (err) => {
                if (err) {
                    reject(`PirRunner DB error: ${err.message} `);
                }
            });

            resolve(true);
        }); 
    }

    public read() {
        return new Promise( (resolve, reject) => {
            const ADS1115 = require('ads1115');
            const connection = [1, 0x48, 'i2c-bus'];
            ADS1115.open(...connection).then((ads1115) => {
                ads1115.gain = 2;

                setInterval(() => { 
                    ads1115.measure('0+GND').then((rs) =>{
                        let res = false;
    
                        console.log('PIR res: ', rs);
    
                        if (rs > 20000) {
                            res = true;
                        }
    
                        console.log({pir: rs, state: res});
                    });
                }, 1500);

                ads1115.measure('0+GND').then((rs) =>{
                    let res = false;

                    console.log('PIR res: ', rs);

                    if (rs > 20000) {
                        res = true;
                    }

                    resolve({pir: rs});
                });
            });
        });

        // let pirState = new PirState(this.config, this.logger);
        // pirState.read().then((pir) => {
        //     //@ts-ignore
        //     response.pir = pir.value;        
        //     // ls = null;
        //     // pirState = null;
        // }).catch((err) => {
        //     this.logger.error('PIR ERR 1');
        // });
    }

    public readAndPersist() {
        this.read()
            .then((stateStr) => {
                const insertQuery = `
                        INSERT OR REPLACE INTO 'store' (
                            'key',
                            'value'
                        )
                        VALUES
                        (
                            ?,
                            ?
                        )`;

                this.db.run(
                    insertQuery,
                    ['PIR_STATE', stateStr],
                    (err, rs) => {
                        if (err) {
                            this.logger.error(err.message);
                        }
                    });
            })
            .catch(() => {
                
            });
    }
}