"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { DB_PATH } from './../../server/config';
const Moment = require("moment");
const MomentRange = require("moment-range");
const _ = require("lodash");
const sqlite3 = require('sqlite3').verbose();
class TimedLightRegulator {
    constructor(config, pwmDriver, logger) {
        this.pwmDriver = pwmDriver;
        this.timer = {};
        this.logger = logger;
        this.dbPath = config.database.path;
    }
    ;
    clearTimersIntervals() {
        this.logger.log('debug', 'Will clearTimersIntervals');
        clearInterval(this.timer);
    }
    checkIntervalsAndAjustLightSetting() {
        this.performCheck();
        this.timer = setInterval(() => {
            this.performCheck();
        }, 60000);
    }
    ;
    performCheck() {
        let intervalsPromise = this.getTimeModesIntervals();
        intervalsPromise.then((intervals) => {
            let intervalsIds = [];
            _.forEach(intervals, (value) => {
                intervalsIds.push(value.title);
            });
            this.checkIntervals(intervals);
        });
    }
    checkIntervals(intervals) {
        _.forEach(intervals, (value) => {
            let { title, from, to, settings } = value;
            if (this.isTimeInCurrentRange(from, to)) {
                this.setColors(settings);
            }
        });
    }
    ;
    isTimeInCurrentRange(from, to) {
        const moment = MomentRange.extendMoment(Moment);
        const current_date_time = moment();
        const current_date = moment().format('YYYY-MM-DD');
        const start = moment(current_date + ' ' + from);
        const end = moment(current_date + ' ' + to);
        const range = moment.range(start, end);
        if (range.contains(current_date_time)) {
            // console.log('contains: ', range);
            return true;
        }
    }
    ;
    getTimeModesIntervals() {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Will load DB for time intervals from: ${this.dbPath}`);
            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    return this.logger.error('getTimeModesIntervals DB error: ', err.message);
                }
            });
            db.serialize(() => {
                db.all("SELECT * FROM light_time_programs", (err, rows) => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(err.message);
                    }
                    resolve(rows);
                });
            });
        });
    }
    ;
    setColors(colors) {
        // console.log('colors', colors);
        try {
            let jsonObject = JSON.parse(colors);
            _.forEach(jsonObject, (value, key) => {
                // console.log('KV: ', key, value);
                this.pwmDriver.setColor(key, value);
            });
            this.pwmDriver.setColor('warmWhite', 0);
            this.pwmDriver.setColor('coldWhite', 0);
        }
        catch (e) {
        }
    }
    ;
}
exports.TimedLightRegulator = TimedLightRegulator;
;
//# sourceMappingURL=timed-light-regulator.js.map