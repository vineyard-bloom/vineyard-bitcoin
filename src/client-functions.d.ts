import { BitcoinRpcClient, Block } from "./types";
import { blockchain } from 'vineyard-blockchain';
export declare const liveGenesisTxid = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
export declare function getBlockByIndex(client: any, index: number): Promise<Block>;
export declare function getMultiTransactions(client: any, transactions: string[], blockIndex: number): Promise<blockchain.MultiTransaction[]>;
export declare function bitcoinToBlockchainBlock(block: Block): blockchain.Block;
export declare function getMultiTransactionBlock(client: BitcoinRpcClient, index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined>;
