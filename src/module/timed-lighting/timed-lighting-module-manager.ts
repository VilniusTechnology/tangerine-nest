import {TimedLightSettingsApi} from "./module-timed-light-settings-api";
import {Logger} from "log4js";

export class TimedLightingModuleManager {

    private db;
    public logger: Logger;
    private config;

    constructor(
        config: any,
        logger: Logger,
        db
    ) {
        this.config = config;
        this.logger = logger;
        this.db = db;
    };

    getPrograms(req, res) {
        return new Promise((resolve, reject) => {
            // const ledModule = this.getModule('LedModule');
            // const regulator = ledModule.getTimedRegulator();
            // regulator.getTimeModesIntervals().then( (intervals: any) => {
            //     console.log(`intervals ::: ::: ::: ===============>`);
            //     console.log(intervals);
            //     console.log(`< =============== intervals ::: ::: :::`);
            // });

            const getQuery = `SELECT * FROM ${TimedLightSettingsApi.tableName}`;
            this.logger.debug(`getPrograms::getQuery: ${getQuery}, dbPath: ${this.config.database.path}`);
            this.db.serialize(() => {
                this.db.all(getQuery, (err, rows) => {
                    if (rows == undefined) {
                        rows = [];
                    }

                    if (err) {
                        this.logger.error(err.message);
                        reject(err.message);
                    }

                    this.logger.debug('Will getPrograms: ', rows);
                    resolve(rows);
                });
            });
        });
    }

    createProgram(req, res) {
        this.logger.debug('createProgram - request body: ', req.body);

        return new Promise((resolve, reject) => {
            if (typeof req.body !== 'undefined' && typeof req.body.title !== 'undefined') {
                let settings = {
                    'red': req.body.red,
                    'green': req.body.green,
                    'blue': req.body.blue,
                };

                let data =  [
                    Math.round(+new Date()/1000),
                    req.body.title,
                    req.body.from,
                    req.body.to,
                    JSON.stringify(settings)
                ];

                this.db.run(
                    `INSERT INTO ${TimedLightSettingsApi.tableName} (id, title, 'from', 'to', settings) VALUES(?,?,?,?,?)`,
                    data,
                    (err) => {
                        if (err) {
                            this.logger.error(err.message);
                            reject(err.message);
                        }
                        resolve('Inserted');
                    }
                );
            }  else {
                reject('empty stuff');
            }
        });
    }

    update(req, res) {
        this.logger.info('Will update.');
        this.logger.debug(req.body);

        // console.log(req.body);
        // let data =  [
        //     Math.round(+new Date()/1000),
        //     req.body.title,
        //     req.body.from,
        //     req.body.to,
        //     JSON.stringify(settings)
        // ];

        let settings = {
            'red': req.body.red,
            'green': req.body.green,
            'blue': req.body.blue,
        };

        const updateQuery =
            `UPDATE ${TimedLightSettingsApi.tableName} 
                SET 
            'title' = '${req.body.title}', 
            'from' = '${req.body.from}', 
            'to' = '${req.body.to}', 
            'settings' = '${JSON.stringify(settings)}'
                WHERE id=${req.body.id};`

        this.logger.debug(req.body);

        this.db.run(updateQuery, {}, (err) => {
            if (err) {
                this.logger.error(err.message);
                return err.message;
            }
        });

        res.json(req.body);
    }

    getAllSensorData(req, res) {
        const getQuery = `SELECT * FROM 'home_data' `;
        this.logger.debug(`getAllSensorData::getQuery: ${getQuery}, dbPath: ${this.config.database.path}`);
        this.db.all(getQuery, (err, rows) => {
            if (rows == undefined) {
                rows = [];
            }

            if (err) {
                this.logger.error(err.message);
            }

            res.json(rows);
        });
    }

    // private removeProgram(req, res) {
    //     const deleteQuery = `DELETE FROM ${TimedLightSettingsApi.tableName} WHERE id=?`;
    //     this.logger.debug(deleteQuery, req.body.id);

    //     this.db.run(deleteQuery, req.body.id, (err) => {
    //         if (err) {
    //             this.logger.error(err.message);
    //             return err.message;
    //         }

    //         this.logger.info(`Row(s) deleted !`);
    //     });
    // }
}
