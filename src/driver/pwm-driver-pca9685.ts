import Pca9685Driver from "pca9685";
import { PwmDriverFacade } from 'mandarin-nest-local-light-driver';

export class PwmDriverPca9685 extends PwmDriverFacade {

    private driver: Pca9685Driver;
    public config: any = {};

    constructor(config: any) {
        super();

        this.driver = new Pca9685Driver(
            config, 
            (err) => {
                if (err) {
                    console.error("Error initializing PCA9685");
                    process.exit(-1);
                    // reject('fail');
                }
                let msg = "PCA9685 Initialization done";
                console.log(msg);
                // resolve(this.driver);
            }
        );
    }

    setDutyCycle(colourPin, prepared_value) {
        this.driver.setDutyCycle(colourPin, prepared_value);
    }
}