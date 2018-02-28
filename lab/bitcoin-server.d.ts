export interface BitcoinServerConfig {
    path: string;
    logging: boolean;
}
export declare class BitcoinServer {
    private status;
    private stdout;
    private stderr;
    private childProcess;
    private config;
    constructor(config: BitcoinServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
}
