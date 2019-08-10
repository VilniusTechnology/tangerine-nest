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
        },
        {
            type: 'input',
            name: 'dbPath',
            message: 'Enter path to Your database: ',
            initial: process.cwd() + '/mandarinas-settings',
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
    const cc = new ConfigCopy(logger);
    cc.installConfigs();

    // Install DB's
    const quiestion = new Confirm('Are you sure that You want to update application user? \n This would result in current data loss if application was allready installed !!!');
    quiestion.ask((answer) => {
        if (answer) {
            setupDb(data.username, data.email, data.password, data.dbPath);
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

function setupDb(username, email, pasword, dbPath) {
    return new Promise((resolve, reject) => {
        // Reset DB.
        const dbr = new DbReloader(logger, dbPath);
        dbr.performReload().then(() => {
            dbr.createUser(username, email, pasword);

            // Check and if needed load fixtures.
            const quiestion = new Confirm('Do You want to fill DB with DEMO data ?');
            quiestion.ask((answer) => {
                if (answer) {
                    loadFixtures(dbPath);
                }
            });
        });
    });
}

function loadFixtures(dbPath) {
    const pathToFixtures = `/fixtures/fixtures.json`;
    const fl = new FixtureLoader(logger, dbPath);
    fl.setup();
    fl.loadFixture(pathToFixtures);
}

function validate(response) {
    if (response !== undefined && response.length > 4) {
        return true;
    }

    return false;
}