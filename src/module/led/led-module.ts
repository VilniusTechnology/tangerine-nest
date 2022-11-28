import { ModuleBase } from '../module-base';
import { Routes } from './routes';
import { LightRegulator } from '../../controller/regulator/light-regulator';
import { TimedLightRegulator } from '../../controller/regulator/timed-light-regulator';
import { Pca9685RgbCctDriverManager } from "../../driver/pca9685-rgb-cct-driver-manager";
import { Logger } from "log4js";
import { FaderAdvanced } from '../effector/effector/fader-advanced';
import { LedModuleManager } from './led/led-module-manager';
import { RequestProcessor } from "./request-processor";
import {Container} from "../container";

export class LedModule extends ModuleBase {

    public static readonly AUTO_MODE_CODE = 0;
    public static readonly MANUAL_MODE_CODE = 1;
    public static readonly TIMED_MODE_CODE = 2;
    public static readonly CHECK_MODE_CODE = 3;

    public fader: FaderAdvanced;
    public logger: Logger;
    public ledModuleManager: LedModuleManager;
    public container;

    protected pwmManager: Pca9685RgbCctDriverManager;
    protected colors;
    protected config;
    protected lightSource;
    protected mqttClient;
    protected requestProcessor;

    protected timedRegulator: TimedLightRegulator;
    protected lightRegulator;

    constructor(config: any, logger: Logger, container) {

        super(logger, container);

        this.config = config;
        this.logger = logger;

        this.logger.debug('LedModule was constructed.');
    }

    init(container: Container) {
        this.logger.info('Will init Led Module!');

        this.container = container;

        return new Promise((resolve, reject) => {
            container.add('LedModule', this);

            this.launch();

            resolve({'module': 'LedModule', container: this});
        });
    }

    launch() {
        this.logger.debug('Will launch LedModule');
        this.resolveDependencies();

        // try {
        //     this.resolveDependencies();
        // } catch (e) {
        //     this.logger.warn('LedModule was not launched.');
        //     return false;
        // }
        
        this.requestProcessor.loadSavedState();

        this.pwmManager.setup().then((response) => {
            this.logger.debug('PwmManager is UP!');

            this.pwmManager.setLedMode(LedModule.MANUAL_MODE_CODE);
            this.logger.debug(
                'pwmManager LedMode set to: '
                + LedModule.MANUAL_MODE_CODE
            );

            this.fader = new FaderAdvanced(this.pwmManager, this.logger);

            this.logger.info('LedModule fully initialized ');
        }).catch( (err) => {
            this.logger.error(`PWM driver setup error!`);
        });

        this.launchMqtts();
    }

    launchMqtts() {
        this.mqttClient = this.container.get('MqttModule').getClient();
        const topicSub = this.mqttClient.buildTopic('led');
        this.mqttClient.subscribeToTopic(
            topicSub,
            (topic, message) => {
             if (topic == topicSub) {
                 const qr = message.toString();
                 if (this.validateJSONPayload(qr)) {
                     this.logger.debug('Request fom MQTT');
                     this.requestProcessor.perform(JSON.parse(qr));
                 }
             }

        });
    }

    validateJSONPayload(qr: string) {
        try {
            JSON.parse(qr);
        } catch (e) {
            this.logger.warn('LedModule got wrong JSON: ' + qr);
            return false;
        }

        return true;
    }

    resolveDependencies() {
        this.pwmManager = new Pca9685RgbCctDriverManager(this.config, this.logger);
        this.fader = new FaderAdvanced(this.pwmManager, this.logger);
        this.colors = this.pwmManager.getState();

        try {
            this.lightSource = this.container.get('SensorModule').getSensor('lightSensor');
        } catch (e) {
            this.lightSource = null;
        }
        
        this.lightRegulator = new LightRegulator(
            this.fader,
            this.lightSource,
            this.logger,
            this.config
        );

        this.timedRegulator = new TimedLightRegulator(
            this.config.ledTimer,
            this.pwmManager,
            this.logger
        );
        this.ledModuleManager = new LedModuleManager(
            this.config,
            this.logger,
            this.pwmManager,
            this.lightRegulator,
            this.fader
        );

        this.requestProcessor = new RequestProcessor(
            this.ledModuleManager,
            this.logger,
            this.config
        );
    }

    getFader() {
        return this.fader;
    }

    getRoutesForRegistration() {
        return new Routes(this.logger, this.requestProcessor, this.config).listRoutes();
    }

    getRgbCctLedDriver() {
        return this.ledModuleManager.getRgbCctLedDriver();
    }

    getManager() {
        return this.ledModuleManager;
    }

    getTimedRegulator() {
        return this.timedRegulator;
    }
}
