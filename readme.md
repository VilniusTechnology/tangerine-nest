# Tangerine Nest smartHome automator (IOT)

This software is used for hobby home automation project. It was created for educational purposes, as home automation, hobby project.
Currently, only LED lighting module and sensor data module are supported.

## Current Hardware compatability

Rasberry Pi

As PWM driver is used - PCA9685

Atmospheric sensor - BME280

Light intensity sensor

Mandatory hardware is: **Rasberry Pi** and **PCA9685**.

#### Module LED 

Custom color light
Adaptive lighting
Timed modes
OpenPixel (WS2812)

#### Module Sensor Data
Atmospheric data
Light intensity data


## Setup

1. Connect [hardware](docs/hardware.md).

2. Prepare [rasberry Pi](docs/rasberry.md).

3. Install tangerine NEST

```bash
npm install

rm -rf dist/

npm run build

node server.js

http://localhost:8081/?red=90&green=15&blue=150
```
4. (Optional) Setup [client](https://github.com/VilniusTechnology/orange-home-automator-ui).

## Configuration

Update Tangerine Nest home automator by setting most important settings:

They can be changed depending on environment in file: `config/{environment}/config.js`

```javascript

...
// Must not use emulator if running on Rasbbery Pi
useEmulator: false,
...

...
// Your rasberry IP
ledControllerAddress: 'http://{ip.of.your.rasbbery_host}:8080/',
...

...
// Your emulator probably will be running on localhost
ledEmulatorAdress: 'http://localhost:8081',
...

... 
logger: {
    // For first launches of application debug level is ok, 
    // but latter it might give too much information output.
    level: 'debug', // Set to info or error when finish configuring application
},

...
// Specify databases paths
database: {
    path: process.env.LED_TIMER_DB_PATH || '/path/to/your/project',
},
...

```

Development environment is intended for emulator mode, or if you can develop using couple of Rasbbery Pi, one as dev and other always running as server for your home automation.

You should notice, that when developing you basicaly breaking your home automator.


### LED module settings:

driver_type: `i2c` OR `local`

driver:

address: i2c device adddress.

frequency: PWM signal frequency.

debug: set true if you need more verbose info.

contours:

currently only main countour is supported.
Each color has its correspondign pin connected to PCA9685 mapped.

## Launching an UI (Client app)

Use [these](https://github.com/VilniusTechnology/orange-home-automator-ui) instructions to launch UI.

## Running in emulated mode
