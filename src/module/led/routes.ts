import { LedModuleManager } from './led/led-module-manager';
import { RequestProcessor } from './../../server/request-processor';
import { RoutesModuleBase } from "../routes-module-base";
import * as url from 'url';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";

export class Routes extends RoutesModuleBase {

    public readonly ROUTE_PREFIX = 'led';
    public logger: Logger;
    private requestProcessor: RequestProcessor;

    constructor(logger: Logger, ledModuleManager: LedModuleManager) {
        super(logger);
        this.logger = logger;
        this.requestProcessor = new RequestProcessor(ledModuleManager, this.logger);
        
        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute(''), bodyParser.json(), (req, res) => {
            this.logger.debug('LED Incomming: ', req.url);

            let query = url.parse(req.url, true).query;
            this.requestProcessor.manageModes(query);
            let ledStateObj = this.requestProcessor.returnState(query);
            this.requestProcessor.prepareResponse(res, ledStateObj);
        });
    }
}