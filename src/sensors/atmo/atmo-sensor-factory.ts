import {AtmoSensors} from "./index";

export class AtmoSensorFactory {
    public config;
    public logger;
    public container;

    constructor(config: any, logger, container) {
        this.config = config;
        this.logger = logger;
        this.container = container;
    }

    public build(type) {
        const constructor = `Atmo${type}Sensor`;
        return new AtmoSensors[constructor](this.config, this.logger, this.container);
    }
}