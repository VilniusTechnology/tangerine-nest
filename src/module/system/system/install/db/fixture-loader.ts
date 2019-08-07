import { Logger } from "log4js";
import * as fs from "fs";
import * as _ from 'lodash';
import { sqlite3 } from "sqlite3";

const sqlite3 = require('sqlite3').verbose();

export class FixtureLoader {
    public logger: Logger;
    public dbPath: string;
    public db;

    constructor(logger: Logger, dbPath: string) {
        this.dbPath = dbPath;
        this.logger = logger;   
    }

    public setup() {
        this.db = new sqlite3.Database(this.dbPath, (err: Error) => {
            if (err) {
                return this.logger.error(`FIXTURE LOADER DB error on path: ${this.dbPath}: `, err.message);
            }
            this.logger.debug('FIXTURE LOADER loaded DB OK.');
        })
    }

    public loadFixture(path: string) {
        const fixtures = this.readFromFile(path);
        fixtures.forEach( (table) => {
            this.insertEntry(table, table.table);
        });
    }

    private readFromFile(path: string) {
        const basePath = process.cwd();
        const fullPath = basePath + path;

        try {
            let content = fs.readFileSync(fullPath);
            return JSON.parse(content.toString()).fixtures;
        } catch (err) {
            this.logger.error(err.message);
        }
    }

    private buildPreparedColumnString(row) {
        let keyString = '(';
        _.forEach(row, (value, column) => {
            keyString =  keyString + "'" + column + "'" + ', ';
        });
        keyString = keyString.slice(0, -2);
        keyString = keyString + ')';

        return keyString;
    }

    private buildPreparedValueString(row) {
        let valueString = '(';
        _.forEach(row, (value) => {
            valueString =  valueString + "'" + value + "'" + ', ';
        });
        valueString = valueString.slice(0, -2);
        valueString = valueString + ')';

        return valueString;
    }

    private insertEntry(table: any, tableName: string) {
        table.entries.forEach((row) => {
            const keyString = this.buildPreparedColumnString(row);
            const valueString = this.buildPreparedValueString(row);

            const insertQuery = `INSERT INTO '${tableName}' ${keyString} VALUES ${valueString}`;
            
            this.logger.debug(insertQuery);

            this.db.run(insertQuery, {}, (e: Error) => {
                if (e) {
                    this.logger.error(e.message);
                } 
            });
        });
    }
}
