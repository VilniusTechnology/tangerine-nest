import {LightSources} from "./index";

export class LightSourceFactory {
    public config;
    public logger;
    public container;

    constructor(config: any, logger, container) {
        this.config = config;
        this.logger = logger;
        this.container = container;
    }

    public build(type) {
        const constructor = `LightSourceSensor${type}`;
        return new LightSources[constructor](this.config, this.logger, this.container);
    }
}