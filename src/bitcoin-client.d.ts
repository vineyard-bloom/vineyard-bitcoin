import { TransactionSource } from "./types";
export interface BitcoinConfig {
    port?: number;
    user: string;
    pass: string;
    timeout?: number;
    host?: string;
}
export interface BlockList {
    transactions: TransactionSource[];
    lastBlock: string;
}
export declare class BitcoinClient {
    private client;
    constructor(bitcoinConfig: BitcoinConfig);
    getHistory(lastBlock: string): Promise<BlockList>;
    listTransactions(): Promise<any>;
    getTransaction(txid: string): Promise<any>;
    importAddress(address: string, rescan?: boolean): Promise<{}>;
    getInfo(): Promise<{}>;
    listAddresses(): Promise<{}>;
    createAddress(): Promise<{}>;
    createTestAddress(): Promise<string>;
    generate(amount: number): Promise<any>;
    send(amount: number, address: any): Promise<string>;
}
