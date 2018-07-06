import { AsyncBitcoinRpcClient } from "../src";
export declare class BitcoinNode {
    private stdout;
    private stderr;
    private childProcess;
    waitUntilRunning(client: AsyncBitcoinRpcClient): Promise<void>;
    start(client: AsyncBitcoinRpcClient): Promise<void>;
    stop(): Promise<void> | Promise<{}>;
}
