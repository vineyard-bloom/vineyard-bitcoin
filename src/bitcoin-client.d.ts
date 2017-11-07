import { TransactionSource } from "./types";
import { FullBlock, BlockInfo, TransactionStatus } from "vineyard-blockchain";
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
    getClient(): any;
    getTransactionStatus(txid: string): Promise<TransactionStatus>;
    getLastBlock(): Promise<BlockInfo>;
    getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BlockInfo>;
    getFullBlock(block: BlockInfo): Promise<FullBlock>;
    getHistory(lastBlock: string): Promise<BlockList>;
    listTransactions(): Promise<any>;
    getTransaction(txid: string): Promise<TransactionSource>;
    importAddress(address: string, rescan?: boolean): Promise<{}>;
    getInfo(): Promise<{}>;
    listAddresses(): Promise<{}>;
    createAddress(): Promise<{}>;
    createTestAddress(): Promise<string>;
    generate(amount: number): Promise<any>;
    send(amount: number, address: any): Promise<string>;
}
