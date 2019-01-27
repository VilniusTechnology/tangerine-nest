export class SensorLightLevel {
    getLightLevelData (light_source) {
        return new Promise(function(resolve, reject) {
            var lightLvl = light_source.getLightLevel();
            lightLvl.then((lightLvlData) => { 
                resolve(lightLvlData);
            });
        }); 
    };
};