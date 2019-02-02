const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/madcatzx/projects/tangerine-nest/mandarinas-settings');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

try {
    const queryDrop = `DROP TABLE 'light_time_programs'`;
    db.run(queryDrop, {}, (e) => {
        logger.info(queryDrop, e);
    });
} catch (e) {
    logger.error(e);
}

try {
    const queryCreate = `CREATE TABLE 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
    db.run(queryCreate, {}, (e) => {
        logger.info(queryCreate, e);
    });
} catch (e) {
    logger.error(e);
}
