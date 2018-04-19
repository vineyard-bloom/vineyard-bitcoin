import { AsyncBitcoinRpcClient, BitcoinRPCBlock, Omit, TxId } from "./types";
import { blockchain } from "vineyard-blockchain";
export declare const liveGenesisTxid = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
export declare function getBlockByIndex(client: AsyncBitcoinRpcClient, index: number): Promise<BitcoinRPCBlock>;
export declare function getMultiTransactions(client: AsyncBitcoinRpcClient, transactionIds: TxId[], blockIndex: number): Promise<blockchain.MultiTransaction[]>;
export declare function getMultiTransaction(client: AsyncBitcoinRpcClient, txid: TxId): Promise<Omit<blockchain.MultiTransaction, 'blockIndex'>>;
export declare function bitcoinToBlockchainBlock(block: BitcoinRPCBlock): blockchain.Block;
export declare function getMultiTransactionBlock(client: AsyncBitcoinRpcClient, index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>>;
