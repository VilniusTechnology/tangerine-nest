import { Logger } from "log4js";

const sqlite3 = require('sqlite3').verbose();

export class DbReloader {
    
    public logger: Logger;
    public config: any;

    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }

    public performReload(username, email, pasword) {
        const db = new sqlite3.Database(this.config.config.settingsDb.path, (err) => {
            if (err) {
                return this.logger.error(`RELOAD DB error on path: ${this.config.config.settingsDb.path}: `, err.message);
            }
            this.logger.debug('RELOAD loaded DB OK.');
        })
    
        let queryDrop = `DROP TABLE IF EXISTS 'light_time_programs'`;
        db.run(queryDrop, {}, (e) => {
                if (e) {
                    this.logger.error(queryDrop + "\n", e.message);
                }  
    
                const queryCreate = `CREATE TABLE IF NOT EXISTS 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
                db.run(queryCreate, {}, (e) => {
                    if (e) {
                        this.logger.error(queryCreate + "\n", e.message);
                    }  
                });
            }
        );
    
        queryDrop = `DROP TABLE IF EXISTS 'home_data'`;
        db.run(queryDrop, {}, (e) => {
            if (e) {
                this.logger.error(queryDrop + "\n", e.message);
            } 
        
            const queryCreate = `CREATE TABLE 'home_data' (
                'id' int, 
                'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
                'light' text, 
                'temperature' text, 
                'humidity' text, 
                'pressure' text
            )`;
            db.run(queryCreate, {}, (e) => {
                if (e) {
                    this.logger.error(queryCreate + "\n", e.message);
                } 
            });
        });
    
    
        queryDrop = `DROP TABLE IF EXISTS 'users'`;
        db.run(queryDrop, {}, (e) => {
            if (e) {
                this.logger.error(queryDrop + "\n", e.message); 
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
            db.run(queryCreate, {}, (e) => {
                if (e) {
                    this.logger.error(queryCreate + "\n", e.message);
                }
                this.logger.info(queryCreate + "\n");
    
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
                        '${pasword}',
                        'token-test',
                        datetime('now', '60 minutes')
                    )`;

                    db.run(insertQuery, {}, (e) => {
                        if (e) {
                            this.logger.error(insertQuery + "\n", e.message);
                        } 
                    });
    
            });
        });
    }
}
