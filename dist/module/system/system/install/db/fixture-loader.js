"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const sqlite3 = require('sqlite3').verbose();
class FixtureLoader {
    constructor(logger, dbPath) {
        this.dbPath = dbPath;
        this.logger = logger;
    }
    setup() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                return this.logger.error(`FIXTURE LOADER DB error on path: ${this.dbPath}: `, err.message);
            }
            this.logger.debug('FIXTURE LOADER loaded DB OK.');
        });
    }
    loadFixture(path) {
        const fixtures = this.readFromFile(path);
        fixtures.forEach((table) => {
            this.insertEntry(table, table.table);
        });
    }
    readFromFile(path) {
        const basePath = process.cwd();
        const fullPath = basePath + path;
        try {
            let content = fs.readFileSync(fullPath);
            return JSON.parse(content.toString()).fixtures;
        }
        catch (err) {
            this.logger.error(err.message);
        }
    }
    buildPreparedColumnString(row) {
        let keyString = '(';
        _.forEach(row, (value, column) => {
            keyString = keyString + "'" + column + "'" + ', ';
        });
        keyString = keyString.slice(0, -2);
        keyString = keyString + ')';
        return keyString;
    }
    buildPreparedValueString(row) {
        let valueString = '(';
        _.forEach(row, (value) => {
            valueString = valueString + "'" + value + "'" + ', ';
        });
        valueString = valueString.slice(0, -2);
        valueString = valueString + ')';
        return valueString;
    }
    insertEntry(table, tableName) {
        table.entries.forEach((row) => {
            const keyString = this.buildPreparedColumnString(row);
            const valueString = this.buildPreparedValueString(row);
            const insertQuery = `INSERT INTO '${tableName}' ${keyString} VALUES ${valueString}`;
            this.logger.debug(insertQuery);
            this.db.run(insertQuery, {}, (e) => {
                if (e) {
                    this.logger.error(e.message);
                }
            });
        });
    }
}
exports.FixtureLoader = FixtureLoader;
//# sourceMappingURL=fixture-loader.js.map