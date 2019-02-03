var ParseStream = require('openpixelcontrol-stream').OpcParseStream;
var net = require('net');
var ws281x = require('rpi-ws281x-native');

console.log('Starting...')

var server = net.createServer(function(conn) {

    console.log('Server was created...');

    var parser = new ParseStream({
        channel: 1,
        dataFormat: ParseStream.DataFormat.UINT32_ARRAY
    });

    parser.on('setpixelcolors', function(data) {
        console.log(data);
        console.log('Got REQUEST - should process setpixelcolors...');
        console.log(data);

        ws281x.render(data);
    });

    conn.pipe(parser);
});

ws281x.init(100);
server.listen(7890);
