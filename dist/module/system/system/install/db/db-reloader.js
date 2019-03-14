"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
class DbReloader {
    constructor(logger, config) {
        this.config = config;
        this.logger = logger;
        this.db = new sqlite3.Database(this.config.config.settingsDb.path, (err) => {
            if (err) {
                return this.logger.error(`RELOAD DB error on path: ${this.config.config.settingsDb.path}: `, err.message);
            }
            this.logger.debug('RELOAD loaded DB OK.');
        });
    }
    performReload() {
        return new Promise((resolve, reject) => {
            const setupUsers = this.setupUsers();
            const setupLightPrograms = this.setupLightPrograms();
            const setupHomeData = this.setupHomeData();
            Promise.all([
                setupUsers,
                setupLightPrograms,
                setupHomeData
            ]).then((values) => {
                resolve(true);
            });
        });
    }
    createUser(username, email, pasword) {
        return new Promise((resolve, reject) => {
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
            this.db.run(insertQuery, {}, (e) => {
                if (e) {
                    reject('Error while creating ADMIN user');
                }
                resolve(true);
            });
        });
    }
    setupLightPrograms() {
        return new Promise((resolve, reject) => {
            let queryDrop = `DROP TABLE IF EXISTS 'light_time_programs'`;
            this.db.run(queryDrop, {}, (e) => {
                if (e) {
                    let err = { query: queryDrop, message: e.message };
                    this.logger.error(err);
                    reject(err);
                }
                const queryCreate = `CREATE TABLE IF NOT EXISTS 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
                this.db.run(queryCreate, {}, (e) => {
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
    setupHomeData() {
        return new Promise((resolve, reject) => {
            let queryDrop = `DROP TABLE IF EXISTS 'home_data'`;
            this.db.run(queryDrop, {}, (e) => {
                if (e) {
                    let err = { query: queryDrop, message: e.message };
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
                this.db.run(queryCreate, {}, (e) => {
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
    setupUsers() {
        return new Promise((resolve, reject) => {
            let queryDrop = `DROP TABLE IF EXISTS 'users'`;
            this.db.run(queryDrop, {}, (e) => {
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
                this.db.run(queryCreate, {}, (e) => {
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
exports.DbReloader = DbReloader;
//# sourceMappingURL=db-reloader.js.map