const Bme280Sensor = require('../dist/sensors/bme280').Bme280Sensor;
const LightLvlSensor = require('../dist/sensors/light-source').LightSourceSensor;
const sqlite3 = require('sqlite3').verbose();

const config = require('../dist/server/config-loader');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.config.logger.level;

logger.warn(config.config.sensorData.database.path);

// const db = new sqlite3.Database(config.config.sensorData.database.path, (err) => {
//     if (err) {
//         return logger.error(`DataCollector DB error on path: ${config.config.settingsDb.path}: `, err.message);
//     }
//     logger.debug('DataCollector loaded DB OK.');
// });


setTimeout(function() {
   logSensors();
}, 1000);

function logSensors() {
    
    logger.level = config.config.logger.level;

    lightLvlSensor = new LightLvlSensor();
    lightLvlSensor.init();
    const pr2 = lightLvlSensor.read();
    pr2.then((lvl) => {
        console.log('Current Light lvl: ', lvl);
    });
}
