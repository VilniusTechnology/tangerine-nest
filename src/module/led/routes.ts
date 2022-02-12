import { RoutesModuleBase } from "../routes-module-base";
import * as url from 'url';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import {RequestProcessor} from "./request-processor";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = 'led';
    public logger: Logger;
    public config;
    private requestProcessor: RequestProcessor;

    constructor(logger: Logger, requestProcessor: RequestProcessor, config) {
        super(logger);
        this.logger = logger;
        this.requestProcessor = requestProcessor;
        
        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute(''), bodyParser.json(), (req, res) => {
            this.logger.debug('LED Incomming: ' + req.url);

            let query = url.parse(req.url, true).query;
            this.requestProcessor.manageModes(query, res);
        });

        this.restapi.all(
            this.getFullRoute('/healthcheck'),
            bodyParser.json(),
            (req, res) => {
                this.requestProcessor.respondState(res);
            }
        );
    }
}