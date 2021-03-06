// import { DB_PATH } from './../../server/config';
import * as Moment from 'moment';
import * as MomentRange from 'moment-range';
import * as _ from 'lodash';
import { Logger } from 'log4js';

const sqlite3 = require('sqlite3').verbose();

export class TimedLightRegulator {

    private pwmDriver;
    private timer;
    private dbPath: string;
    private logger: Logger;

    constructor(config: any, pwmDriver, logger: Logger) {
        this.pwmDriver = pwmDriver;
        this.timer = {};
        this.logger = logger;
        this.dbPath = config.database.path;
    }

    clearTimersIntervals() {
        this.logger.debug('Will clearTimersIntervals');
        clearInterval(this.timer);
    }

    checkIntervalsAndAjustLightSetting() {
        this.performCheck();
        this.timer = setInterval(() => { 
            this.performCheck();
        }, 5000);
    }

    performCheck() {
        let intervalsPromise = this.getTimeModesIntervals(); 
        intervalsPromise.then((intervals: []) => {
            let intervalsIds = [];
            _.forEach(intervals, (value: any) => {
                intervalsIds.push(value.title);
            });

            this.checkIntervals(intervals);
        });
    }

    checkIntervals(intervals) {
        _.forEach(intervals, (interval) => {
            let {title, from, to, settings} = interval;
            if (this.isTimeInCurrentRange(from, to)) {
                this.logger.debug(`In interval: `, JSON.stringify(interval));
                this.setColors(settings);
            }
        });
    };

    isTimeInCurrentRange(from, to) {
        const moment = MomentRange.extendMoment(Moment);

        const current_date = moment().format('YYYY-MM-DD');
        const current_date_time = moment();

        // this.logger.error(`current_date_time: ${current_date_time}`);

        const start = moment(current_date + ' ' + from);
        // this.logger.error(`start: ${start}`);
        const end = moment(current_date + ' ' + to);
        // this.logger.error(`end: ${end}`);

        const range = moment.range(start, end);

        if (range.contains(current_date_time)) {
            return true;
        }
    }

    getTimeModesIntervals() {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Will load DB for time intervals from: ${this.dbPath}`);

            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    return this.logger.error('getTimeModesIntervals DB error: ', err.message);
                }
            });
            db.serialize(() => {
                const query = "SELECT * FROM light_time_programs";

                db.all(query, (err, rows) => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(err.message);
                    } 
                    resolve(rows);
                });
            });
        });
    }

    setColors(colors) {
        // console.log('colors', colors);
        try {
            let jsonObject = JSON.parse(colors);

            this.logger.debug(`Will setColors: ${colors}`);

            _.forEach(jsonObject, (value, key) => {
                // console.log('KV: ', key, value);
                this.pwmDriver.setColor(key, value);
            });
            this.pwmDriver.setColor('warmWhite', 0);
            this.pwmDriver.setColor('coldWhite', 0);
        } catch (e) {

        }
    }
};
