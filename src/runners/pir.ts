
export class PirRunner {

    db;
    logger;

    constructor(db: any, logger) {
        this.db = db;
        this.logger = logger
    }

    public readAndPersist() {
        const ADS1115 = require('ads1115')
        const connection = [1, 0x48, 'i2c-bus'];
        ADS1115.open(...connection).then((ads1115) => {
            ads1115.gain = 2;
            ads1115.measure('0+GND').then((rs) =>{
                let res = false;
                if (rs > 20000) {
                    res = true;
                }

                let stateStr = JSON.stringify(res);
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
                            return console.error(err.message);
                        }
                        // this.logger.debug(`PirRunner Rows inserted`, rs);
                    });
            });
        });
    }
}