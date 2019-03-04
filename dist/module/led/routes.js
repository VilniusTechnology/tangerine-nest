"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_processor_1 = require("./../../server/request-processor");
const routes_module_base_1 = require("../routes-module-base");
const url = require("url");
const bodyParser = require("body-parser");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger, ledModuleManager) {
        super(logger);
        this.ROUTE_PREFIX = '';
        this.logger = logger;
        this.requestProcessor = new request_processor_1.RequestProcessor(ledModuleManager, this.logger);
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
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map