"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pca9685_1 = require("pca9685");
const server_1 = require("mandarin-nest-local-light-driver/dist/server");
class PwmDriverPca9685 extends server_1.PwmDriverFacade {
    constructor() {
        super();
        this.config = {};
        this.driver = new pca9685_1.default(this.config, (err) => {
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