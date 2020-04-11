import Pca9685Driver from "pca9685";
import { Logger } from 'log4js';
import { PwmDriverFacade } from "tangerine-nest-local-light-driver";

export class PwmDriverPca9685 extends PwmDriverFacade {

    private driver: Pca9685Driver;
    private logger: Logger;
    public config: any = {};

    constructor(config: any, logger: Logger) {
        super();

        this.logger = logger;
        this.logger.debug('PCA9685 config loaded: ', config.address, config.frequency);
        this.config = config;
    }

    public init() {
        return new Promise((resolve, reject) => {
            this.driver = new Pca9685Driver(this.config, (err) => {
                if (err) {
                    this.logger.error(`Error initializing PCA9685: ${err}`, err);
                    // process.exit(-1);
                    reject({err: err, config: this.config});
                }
                let msg = "PCA9685 Initialization done";
                this.logger.info(msg);
                resolve(msg);
            });
        });
    }

    public setDutyCycle(colourPin, prepared_value, colorName = '') {
        // this.logger.debug(`Will set color: ${colorName}, colourPin: ${colourPin}, prepared_value: ${prepared_value}`);
        this.driver.setDutyCycle(colourPin, prepared_value);
    }
}