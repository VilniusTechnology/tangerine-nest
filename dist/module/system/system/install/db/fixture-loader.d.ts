import { Logger } from "log4js";
export declare class FixtureLoader {
    logger: Logger;
    config: any;
    db: any;
    constructor(logger: any, config: any);
    loadFixture(path: string): void;
    private readFromFile;
    private buildPreparedColumnString;
    private buildPreparedValueString;
    private insertEntry;
}
