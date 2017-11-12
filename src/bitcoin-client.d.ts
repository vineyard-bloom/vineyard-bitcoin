import { BitcoinTransactionSource, Block } from "./types";
import { ExternalTransaction, FullBlock, BlockInfo, BaseBlock, TransactionStatus } from "vineyard-blockchain";
export interface BitcoinConfig {
    port?: number;
    user: string;
    pass: string;
    timeout?: number;
    host?: string;
}
export interface BlockList {
    transactions: BitcoinTransactionSource[];
    lastBlock: string;
}
export declare class BitcoinClient {
    private client;
    constructor(bitcoinConfig: BitcoinConfig);
    getClient(): any;
    getTransactionStatus(txid: string): Promise<TransactionStatus>;
    getLastBlock(): Promise<BaseBlock>;
    getBlockHash(blockHeight: number): Promise<string>;
    getBlockCount(): Promise<number>;
    getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BaseBlock>;
    getFullBlock(block: BlockInfo): Promise<FullBlock>;
    getFullTransactions(transactions: BitcoinTransactionSource[]): Promise<ExternalTransaction[]>;
    getHistory(lastBlock: string): Promise<BlockList>;
    listTransactions(): Promise<BitcoinTransactionSource[]>;
    getTransaction(txid: string): Promise<BitcoinTransactionSource>;
    getBlock(blockhash: string): Promise<Block>;
    importAddress(address: string, rescan?: boolean): Promise<string>;
    getInfo(): Promise<any>;
    listAddresses(): Promise<string[][]>;
    createAddress(): Promise<string>;
    createTestAddress(): Promise<string>;
    generate(amount: number): Promise<number>;
    send(amount: number, address: any): Promise<string>;
}
