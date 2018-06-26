/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
import { blockchain } from "vineyard-blockchain/src/blockchain";
import TransactionInput = blockchain.TransactionInput;
import TransactionOutput = blockchain.TransactionOutput;
import { Network } from "bitcoinjs-lib";
export declare type Diff<T extends string, U extends string> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type Omit<T, K extends keyof T> = {
    [P in Diff<keyof T, K>]: T[P];
};
export interface AddressSource {
    createAddress(): Promise<string>;
}
export declare enum TransactionStatus {
    pending = 0,
    accepted = 1,
    rejected = 2,
}
export interface NewTransaction {
    address: string;
    index: number;
    txid: string;
    status: TransactionStatus;
    amount: number;
    timeReceived: any;
}
export declare type TxId = string;
export interface BitcoinRPCBlock {
    tx: TxId[];
    hash: string;
    height: number;
    time: number;
}
export interface BlockService {
    getLastBlock(): Promise<string>;
    setLastBlock(value: string): Promise<void>;
}
export interface BasicTransaction {
    txid: TxId;
    status: TransactionStatus;
    index: number;
    address: string;
    satoshis: number;
    timeReceived: any;
}
export declare type RawRPCSerializedTransaction = string;
export interface RawRPCDeserializedTransaction {
    txid: TxId;
    blocktime: number;
    vin: TransactionInput[];
    vout: TransactionOutput[];
}
export interface AddTransactionResult<Transaction extends BasicTransaction> {
    transaction: Transaction;
    isNew: boolean;
}
export interface TransactionService<Transaction extends BasicTransaction> extends BlockService {
    add(transaction: NewTransaction): Promise<AddTransactionResult<Transaction>>;
    onConfirm(transaction: Transaction): Promise<Transaction>;
    setStatus(transaction: Transaction, status: TransactionStatus): Promise<Transaction>;
    listPending(): Promise<Transaction[]>;
}
export interface TransactionDetails {
    address: string;
    txid: string;
    amount: BigNumber;
    category: string;
}
export interface BitcoinTransactionSource {
    index: number;
    confirmations: number;
    address: string;
    txid: string;
    time: number;
    amount: number;
    details: TransactionDetails[];
    timereceived: number;
    blockindex: string;
}
export interface BitcoinConfig {
    port?: number;
    user: string;
    pass: string;
    timeout?: number;
    host?: string;
    network?: Network;
    transactionChunkSize?: number;
}
export interface BitcoinConfig2 {
    port?: number;
    username: string;
    password: string;
    timeout?: number;
    host?: string;
    network?: Network;
    transactionChunkSize?: number;
}
export interface BitcoinRpcClient {
    getBlockCount(callback: (err: NodeJS.ErrnoException, count: number) => void): void;
    getBlockHash(index: number, callback: (err: NodeJS.ErrnoException, hash: string) => void): void;
    getBlock(hash: string, callback: (err: NodeJS.ErrnoException, block: BitcoinRPCBlock) => void): void;
    getTransaction(txid: string, callback: (err: NodeJS.ErrnoException, transaction: BasicTransaction) => void): void;
}
export interface AsyncBitcoinRpcClient {
    getBlockCount(): Promise<number>;
    getBlockHash(index: number): Promise<string>;
    getBlock(hash: string): Promise<BitcoinRPCBlock>;
    getTransaction(txid: string): Promise<BasicTransaction>;
    getRawTransaction(txid: string, returnDeserialized?: boolean): Promise<RawRPCSerializedTransaction | RawRPCDeserializedTransaction>;
}
export declare const Defaults: {
    TRANSACTION_CHUNK_SIZE: number;
};
