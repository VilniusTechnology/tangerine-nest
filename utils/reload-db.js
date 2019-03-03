const sqlite3 = require('sqlite3').verbose();

var log4js = require('log4js');
var logger = log4js.getLogger();

const config = require('../dist/server/config-loader');

logger.level = config.config.logger.level;

const Confirm = require('prompt-confirm');
const prompt = new Confirm('Are you sure that You want to reload DB? \n This would result in current data loss !!!');
prompt.ask((answer) => {
    if (answer) {
        performReload();
    } 
});

function performReload() {
    const db = new sqlite3.Database(config.config.settingsDb.path);

    let queryDrop = `DROP TABLE IF EXISTS 'light_time_programs'`;
    db.run(queryDrop, {}, (e) => {
            if (e) {
                logger.error(queryDrop + "\n", e.message);
            }  

            const queryCreate = `CREATE TABLE IF NOT EXISTS 'light_time_programs' (id int, title text, 'from' text, 'to' text, settings text)`;
            db.run(queryCreate, {}, (e) => {
                if (e) {
                    logger.error(queryCreate + "\n", e.message);
                }  
            });
        }
    );

    queryDrop = `DROP TABLE IF EXISTS 'home_data'`;
    db.run(queryDrop, {}, (e) => {
        if (e) {
            logger.error(queryDrop + "\n", e.message);
        } 
    
        const queryCreate = `CREATE TABLE 'home_data' (
            'id' int, 
            'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
            'light' text, 
            'temperature' text, 
            'humidity' text, 
            'pressure' text
        )`;
        db.run(queryCreate, {}, (e) => {
            if (e) {
                logger.error(queryCreate + "\n", e.message);
            } 
        });
    });


    queryDrop = `DROP TABLE IF EXISTS 'users'`;
    db.run(queryDrop, {}, (e) => {
        if (e) {
            logger.error(queryDrop + "\n", e.message); 
        } 

        logger.info(queryDrop + "\n"); 
    
        const queryCreate = `CREATE TABLE  IF NOT EXISTS 'users' (
            'id' INTEGER PRIMARY KEY, 
            'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP, 
            'name' TEXT, 
            'password' TEXT, 
            'email' TEXT,
            'token' TEXT,
            'token_expiration' DATETIME
        )`;
        db.run(queryCreate, {}, (e) => {
            if (e) {
                logger.error(queryCreate + "\n", e.message);
            }
            logger.info(queryCreate + "\n");

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
                    'SUPER USER',
                    'test@test.com',
                    'test',
                    'token-test',
                    datetime('now', '60 minutes')
                )`;

                db.run(insertQuery, {}, (e) => {
                    if (e) {
                        logger.error(insertQuery + "\n", e.message);
                    } 
                });

        });
    });

    // let languages = ['C++', 'Python', 'Java', 'C#', 'Go'];
    // // construct the insert statement with multiple placeholders
    // // based on the number of rows
    // let placeholders = languages.map((language) => '(?)').join(',');
    // let sql = 'INSERT INTO langs(name) VALUES ' + placeholders;
    
    // // output the INSERT statement
    // console.log(sql);
    
    // db.run(sql, languages, function(err) {
    //     if (err) {
    //         return console.error(err.message);
    //     }
    //     console.log(`Rows inserted ${this.changes}`);
    // });
    
    // // close the database connection
    // db.close();
}

