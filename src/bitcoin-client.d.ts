import { blockchain } from "vineyard-blockchain/src/blockchain";
import { AsyncBitcoinRpcClient, BitcoinConfig, BitcoinRPCBlock, BitcoinTransactionSource } from "./types";
import { BaseBlock, ExternalSingleTransaction as ExternalTransaction, FullBlock, ReadClient } from "vineyard-blockchain";
import { Network } from "bitcoinjs-lib";
export interface BlockList {
    transactions: BitcoinTransactionSource[];
    lastBlock: string;
}
export declare class BitcoinClient implements ReadClient<ExternalTransaction> {
    private readonly client;
    private readonly asyncClient;
    private readonly network;
    constructor(bitcoinConfig: BitcoinConfig);
    getClient(): any;
    getAsyncClient(): AsyncBitcoinRpcClient;
    getTransactionStatus(txid: string): Promise<blockchain.TransactionStatus>;
    getLastBlock(): Promise<BaseBlock>;
    getBlockHash(blockHeight: number): Promise<string>;
    getBlockIndex(): Promise<number>;
    getBlockCount(): Promise<number>;
    getNextBlockInfo(blockIndex: number | undefined): Promise<BaseBlock | undefined>;
    getFullBlock(blockindex: number): Promise<FullBlock<ExternalTransaction> | undefined>;
    private getFullTransactions(txids, blockIndex);
    getHistory(lastBlock: string): Promise<BlockList>;
    listTransactions(): Promise<BitcoinTransactionSource[]>;
    getTransaction(txid: string): Promise<BitcoinTransactionSource>;
    getBlock(blockhash: string): Promise<BitcoinRPCBlock>;
    importAddress(address: string, rescan?: boolean): Promise<string>;
    getInfo(): Promise<any>;
    listAddresses(): Promise<string[][]>;
    createAddress(): Promise<string>;
    createTestAddress(): Promise<string>;
    generate(amount: number): Promise<number>;
    send(amount: number, address: any): Promise<string>;
}
export declare function parseAddress(pubKeyHex: string, network: Network): string | undefined;
