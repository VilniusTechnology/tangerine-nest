# Tangerine Nest smartHome automator (IOT)

This software is used for hobby home automation project. It was created for educational purposes, as home automation, hobby project.
For author to learn, and share knowledge with others: NodeJS, electronic basics, and home automation concepts, Arduino and Rasbbery Pi.

Currently, only LED lighting module and sensor data module are supported, more home automation features will be added, such as facial recognition.

## Current Hardware compatability (what You need to launch)

Rasberry Pi (some OrangePi models).

As PWM driver is used - PCA9685

Atmospheric sensor - BME280

Light intensity sensor - 

LED amplifier - 

Mandatory hardware is: **Rasberry Pi** and **PCA9685**.

#### Module LED 

    - Custom color light: simply choose what color and intensity your LED's will be light. (For LED strips or LED based floodlights, custom LED solutions).

    - Adaptive lighting: choose what light level (intensity of single color) shuld be at your managed room, depending on current conditions. (For LED strips or LED based floodlights, custom LED solutions).

    - Timed modes: choose what light intensity and|or colors will be in your room at specific time. Made for ambient wake up, by introducing different light color and intensity, depending on daytime, and your body needs for perfect wake up and go to sleep times.

    - Effects: hardcoded LED lighting effects (fading between colors and so on).

    - OpenPixel (WS2812): Used for controlling OpenPixel WS281x devices. For nice effects.


#### Module Sensor Data
Atmospheric data
Light intensity data


## Setup

1. Connect [hardware](docs/hardware.md).

2. Prepare [rasberry Pi](docs/rasberry.md).

3. Install tangerine NEST

```bash

ssh tangerine@tangerine.local

cd /home/tangerine

git clone git@github.com:VilniusTechnology/tangerine-nest.git && cd tangerine-nest

npm install

node install.js

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

## Launch

``NODE_ENV='production' node server.js``

## Develop

`` sh deploy-sync.sh `` will sync files with remote

## Launching an UI (Client app)

Use [these](https://github.com/VilniusTechnology/orange-home-automator-ui) instructions to launch UI.

## Running in emulated mode

As mentioned above, tangerine-nest can be ran in emulated mode.

This mode is not requiring any hardware to run it, but in UI such modules as LED are receiving output that was generated by tangerine-nest, and such things as effects could be tested.
