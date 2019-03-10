const config = require('../dist/server/config-loader');
let JsonEffectExecutor = require('../dist/module/effector/effector/json-effect-executor').JsonEffectExecutor;

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.config.logger.level;

const converter = new JsonEffectExecutor(config.config, logger);

     json = `
        {
            "options": {
                "loop": true
            },
            "effects": [
              {
                "type": "fadeUp",
                "color": "green",
                "from": 0,
                "to": 3,
                "timeout": 1,
                "step": 1,
                "effects": [
                    {
                        "type": "fadeDown",
                        "color": "green",
                        "from": 3,
                        "to": 0,
                        "timeout": 1,
                        "step": 1
                    }
                ]
              },
              {
                "type": "fadeUp",
                "color": "blue",
                "from": 0,
                "to": 3,
                "timeout": 1,
                "step": 1,
                "effects": []
              }
            ]
        }
        `;

converter.performJson(json);
