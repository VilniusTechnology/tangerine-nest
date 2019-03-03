import { Logger } from "log4js";

const sqlite3 = require('sqlite3').verbose();

const config = require('../../../dist/server/config-loader');

export class Authorizer {

    private logger: Logger;
    private db;
    private config;

    constructor(logger: Logger) {
        this.config = config.config;
        this.db = new sqlite3.Database(config.config.settingsDb.path);
        this.logger = logger;
    }

    authenticate(email: string, password: string) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let query = `SELECT * 
                            FROM 'users' 
                            WHERE email LIKE '${email}' AND password LIKE '${password}'
                            LIMIT 1`;
                this.logger.debug(query);
                this.db.all(
                    query, 
                    (err, rows) => {
                        if (err) {
                            this.logger.error(err.message);
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            });
        }) 
    }

    authorize(userId: number, hash: string) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM 'users' WHERE id = '${userId}' AND token LIKE '${hash} AND token_expiration > datetime('now')'`;
                this.logger.debug(query);
                this.db.all(
                    query, 
                    (err, rows) => {
                        if (err) {
                            this.logger.error(err.message);
                            reject(err);
                        }
                        this.refreshToken(userId, hash);
                        
                        resolve(rows);
                    }
                );
        });
    } 

    refreshToken(userId: number, hash: string) {

    }
};
