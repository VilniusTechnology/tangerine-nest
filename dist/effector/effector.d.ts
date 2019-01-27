import { Logger } from "log4js";
import { Fader } from "./fader";
export declare class Effector {
    private logger;
    private fader;
    constructor(fader: Fader, logger: Logger);
    execute(): void;
    zalgiris(): Promise<void>;
    terminate(): void;
}
