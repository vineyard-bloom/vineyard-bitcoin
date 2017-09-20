export declare class BitcoinServer {
    private status;
    private stdout;
    private stderr;
    private childProcess;
    start(): Promise<void>;
    stop(): Promise<{}>;
}
