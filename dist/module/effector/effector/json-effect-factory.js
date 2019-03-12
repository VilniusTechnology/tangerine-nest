"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonEffectFactory {
    constructor(config, logger) {
        this.logger = logger;
    }
    convert(json) {
        const header = `
                const FaderAdvancedDown = require('../../../../dist/module/effector/effector/fader-advanced-down').FaderAdvancedDown;
                const FaderAdvancedUp = require('../../../../dist/module/effector/effector/fader-advanced-up').FaderAdvancedUp;
            `;
        const object = JSON.parse(json);
        const effects = this.transpile(object);
        return header + effects.join('');
    }
    transpile(object) {
        let effects = [];
        object.effects.forEach((value) => {
            const eff = this.buildEffect(value);
            effects.push(eff);
        });
        return effects;
    }
    buildEffect(effectData) {
        let effect = null;
        if (effectData.type == 'fadeUp') {
            effect = `
                    new FaderAdvancedUp(pwmManager, logger)
                    .fadeUp(${effectData.from}, ${effectData.to}, '${effectData.color}', ${effectData.timeout}, ${effectData.step})
            `;
        }
        if (effectData.type == 'fadeDown') {
            effect = `
                    new FaderAdvancedDown(pwmManager, logger)
                    .fadeDown(${effectData.from}, ${effectData.to}, '${effectData.color}', ${effectData.timeout}, ${effectData.step})  
            `;
        }
        if (effectData.effects !== undefined && effectData.effects.length > 0) {
            const transpiled = this.transpile(effectData);
            const afterMath = `.then((resolved) => {
                ${transpiled}
            })`;
            effect = effect + afterMath;
        }
        return effect;
    }
}
exports.JsonEffectFactory = JsonEffectFactory;
//# sourceMappingURL=json-effect-factory.js.map