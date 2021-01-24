import { Logger } from 'log4js';
import { Routes } from './routes';
import { ModuleBase } from '../module-base';

const config = require('../../../dist/server/config-loader');

export class EffectsRepo {

    public config;
    public logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;

        this.logger.debug('EffectsRepo initialized.');
    }

    retrieveEffectsList() {
        return [
            {title:'Zalia balta', key:'GW'},
            {title:'Rgb Fade', key:'RgbFade'},
        ];
    }
}
