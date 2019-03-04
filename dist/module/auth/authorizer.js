"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
const config = require('../../../dist/server/config-loader');
class Authorizer {
    constructor(logger) {
        this.config = config.config;
        this.db = new sqlite3.Database(config.config.settingsDb.path, (err) => {
            if (err) {
                return this.logger.error(`Authorizer DB error on path: ${config.config.settingsDb.path}: `, err.message);
            }
            this.logger.debug('Authorizer loaded DB OK.');
        });
        this.logger = logger;
    }
    authenticate(email, password) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let query = `SELECT * 
                            FROM 'users' 
                            WHERE email LIKE '${email}' AND password LIKE '${password}'
                            LIMIT 1`;
                this.logger.debug(query);
                this.db.all(query, (err, rows) => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    authorize(userId, hash) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM 'users' WHERE id = '${userId}' AND token LIKE '${hash} AND token_expiration > datetime('now')'`;
            this.logger.debug(query);
            this.db.all(query, (err, rows) => {
                if (err) {
                    this.logger.error(err.message);
                    reject(err);
                }
                this.refreshToken(userId, hash);
                resolve(rows);
            });
        });
    }
    refreshToken(userId, hash) {
    }
}
exports.Authorizer = Authorizer;
;
//# sourceMappingURL=authorizer.js.map