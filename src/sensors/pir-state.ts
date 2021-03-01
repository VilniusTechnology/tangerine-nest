const sqlite3 = require('sqlite3').verbose();

export class PirState {
    private db;
    private logger;

    constructor(config: any, logger) {
        this.logger = logger;
        this.db = new sqlite3.Database(config.storage.path, (err) => {
            if (err) {
                return this.logger.error(
                    `PirState DB error on path: ${config.config.settingsDb.path}: `,
                    err.message
                );
            }
            this.logger.debug('Authorizer loaded DB OK. PIR state.');
        });
    }

    public read() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let query = `SELECT * FROM 'store' WHERE key LIKE 'PIR_STATE' `;

                this.db.all(
                    query,
                    (err, rows) => {
                        if (err) {
                            this.logger.error(err.message);
                        }

                        this.db.close();

                        resolve(rows[0]);
                    }
                );
            });
        });
    }


}