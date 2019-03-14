'use strict';

const log4js = require('log4js');
const Confirm = require('prompt-confirm');
const { prompt } = require('enquirer');

const config = require('./dist/server/config-loader');
const ConfigCopy = require('./dist/module/system/system/install/config-copy').ConfigCopy;
const DbReloader = require('./dist/module/system/system/install/db/db-reloader').DbReloader;
const FixtureLoader = require('./dist/module/system/system/install/db/fixture-loader').FixtureLoader;

var logger = log4js.getLogger();
logger.level = config.config.logger.level;

loadFixtures();

// startInstall();

function startInstall() {
    const questions = [
        {
            type: 'input',
            name: 'username',
            message: 'What is your ADMIN username?',
            initial: 'admin',
            validate: validate
        },
        {
            type: 'input',
            name: 'email',
            message: 'What is your ADMIN email?',
            initial: 'test@test.com',
            validate: validate
        },
        {
            type: 'password',
            name: 'password',
            message: 'What is your ADMIN password?',
            initial: null,
            validate: validate
        }
    ];
    
    prompt(questions)
    .then( (answers) => {
        install(answers);
    })
    .catch(console.error); 
}

function install(data) {
    const cc = new ConfigCopy(logger, config);
    cc.installConfigs();

    // Install DB's
    const quiestion = new Confirm('Are you sure that You want to install TANGERINE NEST applicatoin? \n This would result in current data loss if application was allready installed !!!');
    quiestion.ask((answer) => {
        if (answer) {
            setupDb(data.username, data.email, data.password);
        } 
    }); 

    // Resolve automated processes.
    setupAutomatedProcesses();
}

function setupAutomatedProcesses() {
    // Install server.
    // Install data collector.
    // Install OPENPIXEL.
}

function setupDb(username, email, pasword) {
    return new Promise((resolve, reject) => {
        // Reset DB.
        const dbr = new DbReloader(logger, config);
        dbr.performReload().then(() => {
            dbr.createUser(username, email, pasword);

            // Check and if needed load fixtures.
            const quiestion = new Confirm('Do You want to fill DB with DEMO data ?');
            quiestion.ask((answer) => {
                if (answer) {
                    loadFixtures();
                }
            });
        });
    });
}

function loadFixtures() {
    const pathToFixtures = `/fixtures/fixtures.json`;
    const fl = new FixtureLoader(logger, config);
    fl.loadFixture(pathToFixtures);
}

function validate(response) {
    if (response !== undefined && response.length > 4) {
        return true;
    }

    return false;
}