import { Logger } from "log4js";
import { bcrypt } from "bcrypt";

const sqlite3 = require('sqlite3').verbose();

export class DbReloader {
    public logger: Logger;
    public config: any;
    public db;

    constructor(logger, config) {
        this.config = config;
        this.logger = logger;

        this.db = new sqlite3.Database(this.config.config.settingsDb.path, (err: Error) => {
            if (err) {
                return this.logger.error(`RELOAD DB error on path: ${this.config.config.settingsDb.path}: `, err.message);
            }
            this.logger.debug('RELOAD loaded DB OK.');
        })
    }

    public performReload() {
        return new Promise((resolve, reject) => {
            const setupUsers = this.setupUsers();
            const setupLightPrograms = this.setupLightPrograms();
            const setupHomeData = this.setupHomeData();

            Promise.all([
                setupUsers, 
                setupLightPrograms, 
                setupHomeData
            ]).then( (values) => {
                resolve(true);
            });
        });
    }

    public createUser(username: string, email: string, pasword: string) {
        return new Promise((resolve, reject) => {

                bcrypt.hash(pasword, 'Lietuva', (error, passwordHash) => {

                    const insertQuery = `
                        INSERT INTO 'users' (
                            timestamp,
                            name,
                            email,
                            password,
                            token,
                            token_expiration
                        )
                        VALUES
                        (
                            datetime('now'),
                            '${username}',
                            '${email}',
                            '${passwordHash}',
                            'token-test',
                            datetime('now', '60 minutes')
                        )`;

                    this.db.run(insertQuery, {}, (e: Error) => {
                        if (e) {
                            reject('Error while creating ADMIN user');
                        } 
        
                        resolve(true);
                    });
                });
        });
    }

    private setupLightPrograms() {
        return new Promise((resolve, reject) =>  {
            let queryDrop = `DROP TABLE IF EXISTS 'light_time_programs'`;
            this.db.run(queryDrop, {}, (e: Error) => {
                    if (e) {
                        let err = {query: queryDrop, message: e.message};
                        this.logger.error(err);
                        reject(err);
                    }
        
                    const queryCreate = `CREATE TABLE IF NOT EXISTS 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
                    this.db.run(queryCreate, {}, (e: Error) => {
                        if (e) {
                            let err = {query: queryCreate, message: e.message};
                            this.logger.error(err);
                            reject(err);
                        }

                        resolve(true);
                    });
                }
            );
        });
    }

    private setupHomeData() {
        return new Promise((resolve, reject) =>  {
            let queryDrop = `DROP TABLE IF EXISTS 'home_data'`;
            this.db.run(queryDrop, {}, (e: Error) => {
                if (e) {
                    let err = {query: queryDrop, message: e.message};
                    this.logger.error(err);
                    reject(err);
                } 
            
                const queryCreate = `CREATE TABLE 'home_data' (
                    'id' int, 
                    'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
                    'light' text, 
                    'temperature' text, 
                    'humidity' text, 
                    'pressure' text
                )`;
                this.db.run(queryCreate, {}, (e: Error) => {
                    if (e) {
                        let err = { query: queryCreate, message: e.message };
                        this.logger.error(err);
                        reject(err);
                    }
                    
                    resolve(true);
                });
            });
        });
    }

    private setupUsers() {
        return new Promise((resolve, reject) => {
            let queryDrop = `DROP TABLE IF EXISTS 'users'`;
            this.db.run(queryDrop, {}, (e: Error) => {
                if (e) {
                    let err = { query: queryDrop, message: e.message };
                    this.logger.error(err);
                    reject(err);
                } 
        
                this.logger.info(queryDrop + "\n"); 
            
                const queryCreate = `CREATE TABLE  IF NOT EXISTS 'users' (
                    'id' INTEGER PRIMARY KEY, 
                    'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
                    'name' TEXT, 
                    'password' TEXT, 
                    'email' TEXT,
                    'token' TEXT,
                    'token_expiration' DATETIME
                )`;
                this.db.run(queryCreate, {}, (e: Error) => {
                    if (e) {
                        let err = { query: queryCreate, message: e.message };
                        this.logger.error(err);
                        reject(err);
                    }

                    resolve(true);
                });
            });
        });
    }
}
