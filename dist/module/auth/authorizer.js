"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt-nodejs");
const jwt = require('jwt-simple');
const sqlite3 = require('sqlite3').verbose();
const config = require('../../../dist/server/config-loader');
class Authorizer {
    constructor(logger) {
        this.secret = 'xxx';
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
                let query = `SELECT id, email, name, password
                            FROM 'users' 
                            WHERE email LIKE '${email}'
                            LIMIT 1`;
                this.db.all(query, (err, rows) => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(err);
                    }
                    bcrypt.compare(password, rows[0].password, (err, res) => {
                        if (res) {
                            this.setToken(email)
                                .then((response) => {
                                resolve({ id: rows[0].id, email: rows[0].email, name: rows[0].name, token: response });
                            });
                        }
                        else {
                            reject(false);
                        }
                    });
                });
            });
        });
    }
    setToken(email) {
        return new Promise((resolve, reject) => {
            const token = this.generateToken();
            let query = `UPDATE 'users' SET token = '${token}', token_expiration = datetime('now', '60 minutes') WHERE email LIKE '${email}'`;
            this.db.run(query, {}, (e) => {
                if (e) {
                    let err = { query: query, message: e.message };
                    this.logger.error(err);
                    reject(err);
                }
                resolve(token);
            });
        });
    }
    authorize(email, hash) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM 'users' WHERE email LIKE '${email}' AND token LIKE '${hash}' AND token_expiration > datetime('now')`;
            this.db.all(query, (err, rows) => {
                // Some DB error.
                if (err) {
                    this.logger.error(err.message);
                    reject(err);
                }
                // Not authorized.
                if (rows.length == 0) {
                    reject(false);
                }
                this.refreshToken(email, hash).then(() => {
                    resolve(rows);
                });
            });
        });
    }
    refreshToken(email, token) {
        return new Promise((resolve, reject) => {
            const token = this.generateToken();
            let query = `UPDATE 'users' SET token_expiration = datetime('now', '+60 minutes') WHERE email LIKE '${email}' AND token LIKE '${token}'`;
            this.db.run(query, {}, (e) => {
                if (e) {
                    let err = { query: query, message: e.message };
                    this.logger.error(err);
                    reject(err);
                }
                resolve(true);
            });
        });
    }
    generateToken() {
        const token = jwt.encode({ secret: this.secret }, this.secret);
        return token;
    }
    cleanupTokens() {
        return false;
    }
}
exports.Authorizer = Authorizer;
;
//# sourceMappingURL=authorizer.js.map