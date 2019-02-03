const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/madcatzx/projects/tangerine-nest/mandarinas-settings');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';


let queryDrop = `DROP TABLE 'light_time_programs'`;
db.run(queryDrop, {}, (e) => {
        if (e) {
            logger.error(queryDrop, e);   
        }  

        const queryCreate = `CREATE TABLE 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
        db.run(queryCreate, {}, (e) => {
            if (e) {
                logger.error(queryCreate, e);
            }  
        });
    }
);

queryDrop = `DROP TABLE 'home_data'`;
db.run(queryDrop, {}, (e) => {
    if (e) {
        logger.error(queryDrop, e);   
    } 

    const queryCreate = `CREATE TABLE 'home_data' (
        'id' int, 
        'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
        'light' text, 
        'temperature' text, 
        'humidity' text, 
        'pressure' text)`;
    db.run(queryCreate, {}, (e) => {
        if (e) {
            logger.error(queryCreate, e);
        } 
    });
});
