const sqlite3 = require('sqlite3').verbose();

var log4js = require('log4js');
var logger = log4js.getLogger();

const config = require('./dist/server/config-loader');

logger.level = config.config.logger.level;

const { prompt } = require('enquirer');

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
    // cp config/production/config.js.dist config/production/config.js
    // Install DB's
    setupAutomatedProcesses();
}

function setupAutomatedProcesses() {

}