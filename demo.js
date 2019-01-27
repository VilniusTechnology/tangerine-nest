const LedServer = require('./dist/server/led-server').LedServer;

let ledServer = new LedServer();
ledServer.launch();
