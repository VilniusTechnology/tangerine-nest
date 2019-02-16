const Bme280Sensor = require('../dist/sensors/bme280').Bme280Sensor;
const LightLvlSensor = require('../dist/sensors/light-source').LightSourceSensor;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/madcatzx/projects/tangerine-nest/mandarinas-settings');

var log4js = require('log4js');

setTimeout(function() {
   logSensors();
}, 1000 * 60 * 5);

function logSensors() {
    var logger = log4js.getLogger();
    logger.level = 'debug';
    
    bme280Sensor = new Bme280Sensor(null, null);
    bme280Sensor.init().then( () => {
        const pr1 = bme280Sensor.read();
    
        lightLvlSensor = new LightLvlSensor();
        lightLvlSensor.init();
        const pr2 = lightLvlSensor.read();
    
        Promise.all([
                pr1, 
                pr2
            ])
        .then(data => {
            console.log('Atmosphere temperature_C: ', data[0].temperature_C);
            console.log('Atmosphere humidity: ', data[0].humidity);
            console.log('Atmosphere pressure_hPa: ', data[0].pressure_hPa);
            console.log('Light: ', data[1].light_lvl);
    
            const inputData = [
                data[1].light_lvl,
                data[0].temperature_C,
                data[0].humidity,
                data[0].pressure_hPa,
            ];
    
            db.run(
                `INSERT INTO 'home_data' ('light', 'temperature', 'humidity', 'pressure') VALUES(?,?,?,?)`, 
                inputData, 
                (err) => {
                    if (err) {
                        logger.info(err)
                    }
                    logger.info('Data was inserted')
                }
            );
    
            db.serialize(() => {
                db.all("SELECT * FROM `home_data`", (err, rows) => {
                    console.log(rows);
                });
            });
        });
    });
}
