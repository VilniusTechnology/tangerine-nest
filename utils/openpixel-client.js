var ClientStream = require('openpixelcontrol-stream').OpcClientStream;
var net = require('net');

const config = require('../dist/server/config-loader');

var opts = require('nomnom')
    .options({
        host: {
            position: 0,
            required: true,
            help: 'host'
        },
        port: {
            abbr: 'p',
            default: 7890,
            help: 'port number'
        },
        channel: {
            abbr: 'c',
            default: 0,
            help: 'OPC channel'
        }
    }).parse();


var socket = net.createConnection(opts.port, opts.host, function() {
    var client = new ClientStream();

    client.pipe(socket);

    var offset = 0;
    // const pixels = config.config.neopixel.led_count;
    console.log('led_count: ', config.config.neopixel.led_count);
    const pixels = 5;
    var data = new Uint32Array(pixels);

    const red = rgb2Int(255, 0, 0);
    const green = rgb2Int(0, 255, 0);
    const blue = rgb2Int(0, 0, 255);
    const yellow = rgb2Int(250, 218, 94);
    const turquise = rgb2Int(0, 100, 100);
    const violet = rgb2Int(155, 0, 100);
    const orange = rgb2Int(253, 106, 2);

    let colors = [
        red,
        green,
        blue,
        yellow,
        turquise,
        violet,
        orange,
    ]

    // let i = 0;
    let a = 0;
    let startCounter = 0;

    for (var i = 0; i < pixels; i++) {
        data[i] = rgb2Int(1, 0, 0);
    }

    console.log('Channel options: ');
    console.log(opts.channel);
    console.log('Will dispatch data: ');
    console.log(data);

    client.setPixelColors(opts.channel, data);

    // setInterval(function () {
    //     console.log(startCounter);
    //     a = startCounter;
    //     for (var i = 0; i < pixels; i++) {
    //         data[i] = colors[a];
    //         a = closedCounter(a, 7);
    //     }
    //     startCounter = closedCounter(startCounter);

    //     client.setPixelColors(opts.channel, data);
    // }, 1000);

    setInterval(function () {
        for (var i = 0; i < pixels; i++) {
            data[a] = colorwheel((offset + i) % 256);
            offset = (offset + 1) % 256;
            a = closedCounter(a);
            console.log(a);
        }
        console.log('--- --- ---');

        client.setPixelColors(opts.channel, data);
        
    }, 100);
    

    // setInterval(function () {
    //     for (var i = 0; i < pixels; i++) {
    //         // data[i] = colorwheel((offset + i) % 256);
    //         data[i] = rgb2Int(255, 0, 0);
    //     }

    //     client.setPixelColors(opts.channel, data);
    //     offset = (offset + 1) % 256;
    // }, 100);
});

function closedCounter(i, limit = 5) {
    i++;
    if (i >= limit) {
        return 0;
    }
    return i;
}


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
