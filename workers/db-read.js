const Bme280Sensor = require('../dist/sensors/bme280').Bme280Sensor;
const LightLvlSensor = require('../dist/sensors/light-source').LightSourceSensor;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/madcatzx/projects/tangerine-nest/mandarinas-settings');

var log4js = require('log4js');

db.serialize(() => {
    db.all("SELECT * FROM `home_data`", (err, rows) => {
        console.log(rows);
    });
});



