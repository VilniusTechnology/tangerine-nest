//process.env.NODE_ENV = 'development';
 process.env.NODE_ENV = 'production';

const LedServer = require('./dist/server/led-server').LedServer;

const Bme280Sensor = require('./dist/sensors/atmosphere/bme280').Bme280Sensor;

// let ledServer = new LedServer();
// ledServer.launch();

const bme = new Bme280Sensor({},{});

bme.init().then( (data) => {
    bme.read().then( (data) => {
        console.log(2, data);
    });
}).catch( (err) => {
    console.log(3, err);
});
