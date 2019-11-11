'use strict';

const log4js = require('log4js');
const Confirm = require('prompt-confirm');
const { prompt } = require('enquirer');


const ConfigCopy = require('./dist/module/system/system/install/config-copy').ConfigCopy;
const DbReloader = require('./dist/module/system/system/install/db/db-reloader').DbReloader;
const FixtureLoader = require('./dist/module/system/system/install/db/fixture-loader').FixtureLoader;

const linuxUser = require('linux-user');

var logger = log4js.getLogger();
logger.level = 'debug';

// loadFixtures('/Users/lukas.mikelionis/Projects/tangerine-nest/mandarinas-settings');

startInstall();

function startInstall() {
     // Check and if needed load fixtures.
     const quiestion = new Confirm('Do You want to fill DB with DEMO data ?');
     quiestion.ask((answer) => {
         if (answer) {
            logger.info(process.cwd() + '/mandarinas-settings');
             loadFixtures(process.cwd() + '/mandarinas-settings');
         }
     }); 
}

function loadFixtures(dbPath) {
    const pathToFixtures = `/fixtures/fixtures-timed-mode.json`;
    const fl = new FixtureLoader(logger, dbPath);
    fl.setup();
    fl.loadFixture(pathToFixtures);

    fl.db.all("SELECT * FROM light_time_programs", [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row);
        });
      });
}
