import { Logger } from 'log4js';

export class JsonEffectFactory {
    private logger: Logger;

    constructor(config: any, logger: Logger) {
        this.logger = logger;
    }

    public convert(json: string) {
        const header = `
                const FaderAdvancedDown = require('../../../../dist/module/effector/effector/fader-advanced-down').FaderAdvancedDown;
                const FaderAdvancedUp = require('../../../../dist/module/effector/effector/fader-advanced-up').FaderAdvancedUp;
            `;
        const object = JSON.parse(json);

        const effects = this.transpile(object);

        return header + effects.join('');
    }

    public transpile(object) { 
        let effects = [];
        object.effects.forEach((value) => {
            const eff = this.buildEffect(value);
            effects.push(eff);
        });

        return effects;
    }

    private isEffectDataValid(effectData: any) {  
        if(!this.isNumeric(effectData.from)) {
            return false;
        }

        if(!this.isNumeric(effectData.to)) {
            return false;
        }

        if(!this.isNumeric(effectData.timeout)) {
            return false;
        }

        if(!this.isNumeric(effectData.step)) {
            return false;
        }

        if(!this.validateColorName(effectData.color)) {
            return false;
        }

        return true;
    }

    private validateColorName(color: string) {
        const colors = [
            'red',
            'green',
            'blue',
            'coldWhite',
            'warmWhite',
        ];

        if (colors.indexOf(color) != -1) {
            return true;
        }

        return false;
    }

    private isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    public buildEffect(effectData: any) {
        let effect = null;

        if(!this.isEffectDataValid(effectData)) {
            throw new Error('Effect data is invalid !!!'); 
        }

        if (effectData.type == 'fadeUp') {
            effect = `
                    new FaderAdvancedUp(pwmManager, logger)
                    .fadeUp(${effectData.from}, ${effectData.to}, '${effectData.color}', ${effectData.timeout}, ${effectData.step})
            `
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
