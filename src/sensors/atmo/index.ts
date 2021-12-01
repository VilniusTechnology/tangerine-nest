import {AtmoBme280Sensor} from "./atmo-bme280";
import {AtmoMqttSensor} from "./atmo-mqtt";
import {AtmoMockSensor} from "./atmo-mock";

export const AtmoSensors: any = {
    AtmoBme280Sensor,
    AtmoMqttSensor,
    AtmoMockSensor,
};