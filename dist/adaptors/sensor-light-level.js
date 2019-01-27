"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SensorLightLevel {
    getLightLevelData(light_source) {
        return new Promise(function (resolve, reject) {
            var lightLvl = light_source.getLightLevel();
            lightLvl.then((lightLvlData) => {
                resolve(lightLvlData);
            });
        });
    }
    ;
}
exports.SensorLightLevel = SensorLightLevel;
;
//# sourceMappingURL=sensor-light-level.js.map