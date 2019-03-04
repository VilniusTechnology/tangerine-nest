export declare class RoutesModuleBase {
    ROUTE_PREFIX: string;
    restapi: any;
    logger: any;
    constructor(logger: any);
    getFullRoute(route: string): string;
    listRoutes(): any;
}
