import { Logger } from "log4js";
import { RoutesModuleBase } from '../routes-module-base';
import * as bodyParser from "body-parser";
import {SensorModule} from "./sensor-module";
import {Container} from "../container";


export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = '';

    public config;
    public logger: Logger;
    public sensorModule: SensorModule;

    constructor(logger: Logger, container: Container, config) {
        super(logger);

        this.logger = logger;
        this.config = config;
        this.sensorModule = container.get('SensorModule');

        this.routes();
    }

    routes() {
        this.restapi.all('/sensors-all', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /sensors-all');
            this.sensorModule.read().then((response) => {
                res.write(JSON.stringify(response));
                res.end();
            }).catch((error) => {
                this.logger.error(error);
            });
        });

        this.restapi.all(
            this.getFullRoute('/sensor/fake'),
            bodyParser.json(),
            (req, res) => {
                setTimeout(() => {
                    res.write('null');
                    res.end();
                }, 100);
            }
        );
    }
}