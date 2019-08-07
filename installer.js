const sqlite3 = require('sqlite3').verbose();

var log4js = require('log4js');
var logger = log4js.getLogger();

const config = require('./dist/server/config-loader');

logger.level = config.config.logger.level;

const { prompt } = require('enquirer');
const linuxUser = require('linux-user');

const Confirm = require('prompt-confirm');
const quiestion = new Confirm('Are you sure that You want to install TANGERINE NEST applicatoin? \n This would result in current data loss if application was allready installed !!!');
quiestion.ask((answer) => {
    if (answer) {
        moveOn();
    } 
});

function moveOn() {
    const questions = [
        {
            type: 'input',
            name: 'username',
            message: 'What is your ADMIN username?'
        },
        {
            type: 'input',
            name: 'email',
            message: 'What is your ADMIN email?'
        },
        {
            type: 'password',
            name: 'password',
            message: 'What is your ADMIN password?'
        },
        {
            type: 'password',
            name: 'password-sys',
            message: 'What will be system user password?'
        }
    ];
    
    prompt(questions)
    .then( (answers) => {
        //   console.log('Answers:', answers)
        install(answers);
    })
    .catch(console.error);
    
}

function install(data) {

    const password = 'pwd';

    console.log(linuxUser);

    // Create "tangerinn" user.
    linuxUser.addUser('tangerinn', function (err, user) {
        if(err) {
          return console.error(err);
        }
        console.log(user);

        linuxUser.setPassword('tangerinn', password, function (err, user) {
            if(err) {
              return console.error(err);
            }
            console.log(user);

            // cp config/production/config.js.dist config/production/config.js

            // Install DB's
            setupDb();

            // Resolve automated processes.
            setupAutomatedProcesses();
        });
    });
}

function prepareConfigs() {
    
}

function setupAutomatedProcesses() {
    // Install server.
    // Install data collector.
    // Install OPENPIXEL.
}

function setupDb() {
    const quiestion = new Confirm('Do You want to fill DB with DEMO data ?');
    quiestion.ask((answer) => {
        if (answer) {
            loadFixtures();
        }
    });
}

function loadFixtures() {

}