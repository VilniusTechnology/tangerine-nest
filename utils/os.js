var os = require('os');

console.log(os.cpus());
console.log('Total mem: ', os.totalmem());
console.log('Free mem: ',os.freemem());

var osUtils = require('os-utils');

osUtils.cpuUsage(function(v){
    console.log( 'CPU Usage (%): ' + v );
});
