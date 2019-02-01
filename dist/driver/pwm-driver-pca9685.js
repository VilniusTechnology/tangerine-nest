"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pca9685_1 = require("pca9685");
const mandarin_nest_local_light_driver_1 = require("mandarin-nest-local-light-driver");
class PwmDriverPca9685 extends mandarin_nest_local_light_driver_1.PwmDriverFacade {
    constructor(config) {
        super();
        this.config = {};
        this.driver = new pca9685_1.default(config, (err) => {
            if (err) {
                console.error("Error initializing PCA9685");
                process.exit(-1);
                // reject('fail');
            }
            let msg = "PCA9685 Initialization done";
            console.log(msg);
            // resolve(this.driver);
        });
    }
    setDutyCycle(colourPin, prepared_value) {
        this.driver.setDutyCycle(colourPin, prepared_value);
    }
}
exports.PwmDriverPca9685 = PwmDriverPca9685;
//# sourceMappingURL=pwm-driver-pca9685.js.map