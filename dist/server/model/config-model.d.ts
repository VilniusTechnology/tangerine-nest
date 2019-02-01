export declare class LedServerConfig {
    driver_type: string;
    driver: LedServerDriver;
    contours: LedServerContourObj;
}
declare class LedServerDriver {
    i2c: any;
    address: any;
    frequency: number;
    debug: boolean;
}
declare class LedServerContourObj {
    main: LedServerContourData;
}
declare class LedServerContourData {
    red: number;
    green: number;
    blue: number;
    coldWhite: number;
    warmWhite: number;
}
export {};
