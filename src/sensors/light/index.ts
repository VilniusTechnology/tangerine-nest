import {LightSourceSensorBH1750} from "./light-source-bh1750";
import {LightSourceSensorUN} from "./light-source-un";
import {LightSourceSensorMqtt} from "./light-source-mqtt";
import {LightSourceSensorMock} from "./light-source-mock";

export const LightSources: any = {
    LightSourceSensorBH1750,
    LightSourceSensorUN,
    LightSourceSensorMock,
    LightSourceSensorMqtt,
};