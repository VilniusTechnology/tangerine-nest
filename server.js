// process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'production';

const TangerineNestServer = require('./dist/server/tangerine-nest-server').TangerineNestServer;

let tangerineNestServer = new TangerineNestServer();
tangerineNestServer.launch();
