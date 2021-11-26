import { Logger } from "log4js";
import { RoutesModuleBase } from '../routes-module-base';
import * as bodyParser from "body-parser";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = '';

    public config;
    public logger: Logger;

    constructor(logger: Logger, container, config) {
        super(logger);

        this.logger = logger;
        this.config = config;
        this.routes();
    }

    routes() {
        this.restapi.all(
            this.getFullRoute('/mqtt/fake'),
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