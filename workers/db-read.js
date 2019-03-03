const Bme280Sensor = require('../dist/sensors/bme280').Bme280Sensor;
const LightLvlSensor = require('../dist/sensors/light-source').LightSourceSensor;

const sqlite3 = require('sqlite3').verbose();
const config = require('../dist/server/config-loader');

const db = new sqlite3.Database(config.config.sensorData.database.path);

var logger = require('log4js');
logger.level = config.config.logger.level;

db.serialize(() => {
    db.all("SELECT * FROM `home_data`", (err, rows) => {
        if (err) {
            logger.info(err.message)
        }
        logger.debug(rows);    
    });
});



