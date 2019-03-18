"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disk_1 = require("./system/server-hardware/disk");
const memory_1 = require("./system/server-hardware/memory");
const os_1 = require("./system/server-hardware/os");
const cpu_1 = require("./system/server-hardware/cpu");
const bodyParser = require("body-parser");
const routes_module_base_1 = require("../routes-module-base");
class Routes extends routes_module_base_1.RoutesModuleBase {
    constructor(logger, container) {
        super(logger);
        this.ROUTE_PREFIX = '';
        this.logger = logger;
        this.ledModule = container()['LedModule'];
        this.routes();
    }
    routes() {
        this.restapi.all('/', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /');
            const cpu = new cpu_1.Cpu();
            const os = new os_1.Os();
            const mem = new memory_1.Memory();
            const dsk = new disk_1.Disk();
            const cpuProm = cpu.getData();
            const oosProm = os.getData();
            const memProm = mem.getData();
            const dskProm = dsk.getData();
            Promise.all([
                cpuProm,
                oosProm,
                memProm,
                dskProm
            ]).then((responses) => {
                const respJson = {
                    system: {
                        os: responses[1],
                        cpu: responses[0],
                        mem: responses[2],
                    },
                    led: this.ledModule.getRgbCctLedDriver().getFullState(),
                    sensors: {},
                    modules: {},
                };
                res.write(JSON.stringify(respJson));
                res.end();
            });
        });
        this.restapi.all('/healthcheck', bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /healthcheck');
            res.write('true');
            res.end();
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map