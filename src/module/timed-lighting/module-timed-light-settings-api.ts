// import * as sqlite3 from "sqlite3";
import * as bodyParser from "body-parser";
import * as express from 'express';
import * as os from 'os';
import { Logger } from "log4js";

const sqlite3 = require('sqlite3').verbose();

export class TimedLightSettingsApi {
    private db;
    private restapi;
    private port: number;
    private hostname: string;
    private logger: Logger;
    config;

    static readonly tableName: string = 'light_time_programs'; 
    
    constructor(config: any, logger = null) {
        this.logger = logger;
        this.config = config;

        // let hostname = os.hostname();
        this.hostname = 'localhost';
        this.port = 3002;

        // this.restapi.use((req, res, next) =>{
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     next();
        // });
    }

    public bootstrap() {
        this.logger.debug(`TimedLightSettingsApi will load DB on path: ${this.config.database.path}`);
        this.db = new sqlite3.Database(this.config.database.path);
        this.restapi = express();

        this.restapi.all('/get-light-time-programs', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /get-light-time-programs');
            this.getPrograms(req, res).then( (rows) => {
                res.json(rows);
            });
        });

        this.restapi.all('/add-light-time-program', bodyParser.json(), (req, res) => {
            this.logger.debug('On route: /add-light-time-program');
            this.createProgram(req, res).then( () => {
                this.getPrograms(req, res).then( (rows) => {
                    res.json(rows);
                });
            });
        });

        this.restapi.all('/reload-db', (req, res) => {
            this.logger.debug('On route: /reload-db');
            // this.reset_db(req, res);  
        });

        this.restapi.post('/edit-light-time-program', bodyParser.json(), (req, res) => {
            this.update(req, res);
        });

        this.restapi.post('/delete-light-time-program', bodyParser.json(), (req, res) => {
            // this.removeProgram(req, res);
        }); 
        
        this.restapi.all('/sensors/get-all', bodyParser.json(), (req, res) => {
            this.getAllSensorData(req, res);
        });
    }

    public listen() {
        this.restapi.listen(this.port);
        this.restapi._router.stack.forEach(function(r){
            if (r.route && r.route.path){
                console.log(`Submit GET or POST to http://${this.hostname}:${this.port}${r.route.path}`);
            }
        });
    }

    public getRoutesForRegistration() {
        return this.restapi._router.stack;
    }

    private getPrograms(req, res) {
        return new Promise((resolve, reject) => {
            const getQuery = `SELECT * FROM ${TimedLightSettingsApi.tableName}`;
            this.db.all(getQuery, (err, rows) => {
                if (rows == undefined) {
                    rows = [];
                }
    
                if (err) {
                    this.logger.error(err);
                    reject(err);
                }
    
                this.logger.debug('Will getPrograms: ', rows);
                resolve(rows);
            });
        });
    }

    private createProgram(req, res) {
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

    private update(req, res) {
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

    public getAllSensorData(req, res) {
        const getQuery = `SELECT * FROM 'home_data' `;
        this.db.all(getQuery, (err, rows) => {
            if (rows == undefined) {
                rows = [];
            }

            if (err) {
                this.logger.error(err);
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

    // private reset_db(req, res) {
    //     this.logger.info('Will reset_db !!!');
    //     try {
    //         const queryDrop = `DROP TABLE ${TimedLightSettingsApi.tableName}`;
    //         this.db.run(queryDrop, {}, (e) => {
    //             this.logger.info(queryDrop, e);
    //         });
    //     } catch (e) {
    //         this.logger.error(e);
    //         res.json({e});
    //     }

    //     try {
    //         const queryCreate = `CREATE TABLE ${TimedLightSettingsApi.tableName}(id int, title text, 'from' text, 'to' text, settings text)`;
    //         this.db.run(queryCreate, {}, (e) => {
    //             this.logger.info(queryCreate, e);
    //         });
    //     } catch (e) {
    //         this.logger.error(e);
    //         res.json({e});
    //     }

    //     this.getPrograms(req, res);
    // }
}
