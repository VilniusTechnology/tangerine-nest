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
            this.logger.debug('LED Incomming: ', req.url);

            let query = url.parse(req.url, true).query;
            this.requestProcessor.manageModes(query);

            setTimeout(() => {
                this.respondState(res);
            }, 100);
        });

        this.restapi.all(
            this.getFullRoute('/healthcheck'),
            bodyParser.json(),
            (req, res) => {
                // this.respondState(res);
                setTimeout(() => {
                    this.respondState(res);
                }, 100);
            }
        );
    }


    respondState(res) {
        let ledStateObj = this.requestProcessor.returnState({});
        this.logger.debug('LED ledStateObj : ', ledStateObj);
        this.requestProcessor.prepareResponse(res, ledStateObj);
    }
}