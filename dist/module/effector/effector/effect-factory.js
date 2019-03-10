"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EffectFactory {
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
        // this.logger.error('1:: object transpile: ', object);
        let effects = [];
        object.effects.forEach((value) => {
            const eff = this.buildEffect(value);
            // this.logger.error('eff: ', eff);
            effects.push(eff);
        });
        return effects;
    }
    buildEffect(effectData) {
        // this.logger.error('2:: buildEffect: ', effectData.type);
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
            // this.logger.debug('3:: effectData BEFORE TRANSPILE', effectData.effects);
            const transpiled = this.transpile(effectData);
            // this.logger.error('4:: transpiled:: ', transpiled);
            const afterMath = `.then((resolved) => {
                ${transpiled}
            })`;
            effect = effect + afterMath;
        }
        return effect;
    }
}
exports.EffectFactory = EffectFactory;
//# sourceMappingURL=effect-factory.js.map