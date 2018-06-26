import { BitcoinServer } from "./bitcoin-server";
import { BitcoinClient } from "../src";
export interface BitcoinLabConfig {
    walletPath: string;
}
export declare class BitcoinLab {
    server: BitcoinServer;
    client: BitcoinClient;
    config: BitcoinLabConfig;
    constructor(config: BitcoinLabConfig, client: BitcoinClient, server?: BitcoinServer);
    private deleteLock();
    deleteWallet(): Promise<any>;
    importAddress(address: string): Promise<any>;
    start(): Promise<any>;
    stop(): Promise<any>;
    reset(): Promise<any>;
    generate(blockCount: number): Promise<void>;
    send(address: string, amount: number): Promise<void>;
    sendMany(addressAmounts: any): Promise<void>;
}
