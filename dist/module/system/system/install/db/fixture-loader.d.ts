import { Logger } from "log4js";
export declare class FixtureLoader {
    logger: Logger;
    dbPath: string;
    db: any;
    constructor(logger: Logger, dbPath: string);
    setup(): void;
    loadFixture(path: string): void;
    private readFromFile;
    private buildPreparedColumnString;
    private buildPreparedValueString;
    private insertEntry;
}
