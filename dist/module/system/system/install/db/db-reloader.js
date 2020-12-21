"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt-nodejs");
const sqlite3 = require('sqlite3').verbose();
class DbReloader {
    constructor(logger, dbPath) {
        this.dbPath = dbPath;
        this.logger = logger;
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return this.logger.error(`RELOAD DB error on path: ${dbPath}: `, err.message);
            }
            this.logger.debug('RELOAD loaded DB OK.');
        });
    }
    performReload() {
        return new Promise((resolve, reject) => {
            const setupUsers = this.setupUsers();
            const setupLightPrograms = this.setupLightPrograms();
            const setupHomeData = this.setupHomeData();
            const utilsData = this.setupUtils();
            Promise.all([
                setupUsers,
                setupLightPrograms,
                setupHomeData,
                utilsData
            ]).then((values) => {
                resolve(true);
            }).catch((error) => {
                reject(false);
            });
        });
    }
    createUser(username, email, pasword) {
        return new Promise((resolve, reject) => {
            let passwordHash = bcrypt.hashSync(pasword);
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
            this.db.run(insertQuery, {}, (e) => {
                if (e) {
                    reject('Error while creating ADMIN user');
                }
                resolve(true);
            });
        });
    }
    setupUtils() {
        return new Promise((resolve, reject) => {
            let queryDrop = `DROP TABLE IF EXISTS 'utils'`;
            this.db.run(queryDrop, {}, (e) => {
                if (e) {
                    let err = { query: queryDrop, message: e.message };
                    this.logger.error(err);
                    reject(err);
                }
                const queryCreate = `CREATE TABLE 
                                         IF NOT EXISTS 'utils' 
                                         (id int, 'key' text, 'value' text)`;
                this.db.run(queryCreate, {}, (e) => {
                    if (e) {
                        let err = { query: queryCreate, message: e.message };
                        this.logger.error(err);
                        reject(err);
                    }
                    const queryUpdate = "CREATE UNIQUE INDEX idx_utils_key ON utils (key)";
                    this.db.run(queryUpdate, {}, (e) => {
                        if (e) {
                            let err = { query: queryCreate, message: e.message };
                            this.logger.error(err);
                            reject(err);
                        }
                        resolve(true);
                    });
                    // resolve(true);
                });
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
                const queryCreate = `CREATE TABLE 
                                         IF NOT EXISTS 'light_time_programs' 
                                         (id int, title text, 'from' text, 'to' text, settings text)`;
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