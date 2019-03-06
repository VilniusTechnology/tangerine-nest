import { LedModule } from './../led/led-module';
import { Disk } from './system/server-hardware/disk';
import { Memory } from './system/server-hardware/memory';
import { Os } from './system/server-hardware/os';
import { Cpu } from './system/server-hardware/cpu';
import { Logger } from "log4js";
import * as bodyParser from "body-parser";
import { RoutesModuleBase } from '../routes-module-base';

export class Routes extends RoutesModuleBase{

    public readonly ROUTE_PREFIX = '';

    public logger: Logger;
    public ledModule: LedModule;

    constructor(logger: Logger, container) {
        super(logger);

        this.logger = logger;
        this.ledModule = container()['LedModule'];
        this.routes();
    }

    routes() {
        this.restapi.all(this.getFullRoute('/'), bodyParser.json(), (req, res) => {
            this.logger.debug('On route to: /');

            const cpu = new Cpu();
            const os = new Os();
            const mem = new Memory();
            const dsk = new Disk();
            
            const cpuProm = cpu.getData();
            const oosProm = os.getData();
            const memProm = mem.getData();
            const dskProm = dsk.getData();

            Promise.all([
                cpuProm,
                oosProm,
                memProm,
                dskProm
            ]).then( (responses) => {
                const respJson = {
                    system: {
                        os: responses[1],
                        cpu: responses[0],
                        mem: responses[2],
                        // disk: {},
                    },
                    led: this.ledModule.getRgbCctLedDriver().getFullState(),
                    sensors: {},
                    modules: {},
                }
                res.write(JSON.stringify(respJson));
                res.end();
            });

            
        });
    }
}