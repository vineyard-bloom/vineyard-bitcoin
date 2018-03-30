import { BitcoinConfig, BitcoinTransactionSource, Block } from "./types";
import { ExternalSingleTransaction as ExternalTransaction, FullBlock, BlockInfo, BaseBlock, TransactionStatus } from "vineyard-blockchain";
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
    getBlockIndex(): Promise<number>;
    getBlockCount(): Promise<number>;
    getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BaseBlock | undefined>;
    getFullBlock(block: BlockInfo): Promise<FullBlock<ExternalTransaction>>;
    getFullTransactions(transactions: string[]): Promise<ExternalTransaction[]>;
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
