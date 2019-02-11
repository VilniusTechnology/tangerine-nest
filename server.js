// process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'production';

const LedServer = require('./dist/server/led-server').LedServer;

let ledServer = new LedServer();
ledServer.launch();
