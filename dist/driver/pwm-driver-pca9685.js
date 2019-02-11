"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pca9685_1 = require("pca9685");
const tangerine_nest_local_light_driver_1 = require("tangerine-nest-local-light-driver");
class PwmDriverPca9685 extends tangerine_nest_local_light_driver_1.PwmDriverFacade {
    constructor(config, logger) {
        super();
        this.config = {};
        this.logger = logger;
        this.logger.debug('PCA9685 config loaded: ', config.address, config.frequency);
        this.config = config;
    }
    init() {
        return new Promise((resolve, reject) => {
            this.driver = new pca9685_1.default(this.config, (err) => {
                if (err) {
                    this.logger.error(`Error initializing PCA9685: ${err}`, err);
                    console.log(this.config, err);
                    // process.exit(-1);
                    reject({ err: err, config: this.config });
                }
                let msg = "PCA9685 Initialization done";
                this.logger.info(msg);
                resolve(msg);
            });
        });
    }
    setDutyCycle(colourPin, prepared_value) {
        this.driver.setDutyCycle(colourPin, prepared_value);
    }
}
exports.PwmDriverPca9685 = PwmDriverPca9685;
//# sourceMappingURL=pwm-driver-pca9685.js.map