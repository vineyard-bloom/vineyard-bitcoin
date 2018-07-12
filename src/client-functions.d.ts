import { AsyncBitcoinRpcClient, BitcoinRPCBlock, Omit, TxId } from "./types";
import { blockchain } from "vineyard-blockchain";
import { Network } from "bitcoinjs-lib";
import ScriptPubKey = blockchain.ScriptPubKey;
export declare const liveGenesisTxid = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
export declare function getBlockByIndex(client: AsyncBitcoinRpcClient, index: number): Promise<BitcoinRPCBlock>;
export declare function getMultiTransactions(client: AsyncBitcoinRpcClient, transactionIds: TxId[], blockIndex: number, network: Network, chunkSize: number): Promise<blockchain.MultiTransaction[]>;
export declare function getMultiTransactionWithBlockIndex(client: AsyncBitcoinRpcClient, txid: TxId, network: Network, blockIndex: number): Promise<blockchain.MultiTransaction>;
export declare function getMultiTransaction(client: AsyncBitcoinRpcClient, txid: TxId, network: Network): Promise<Omit<blockchain.MultiTransaction, 'blockIndex'>>;
export declare function bitcoinToBlockchainBlock(block: BitcoinRPCBlock): blockchain.Block;
export declare function getMultiTransactionBlock(client: AsyncBitcoinRpcClient, index: number, network: Network, transactionChunkSize: number): Promise<blockchain.BlockBundle<blockchain.Block, blockchain.Transaction>>;
export declare function addressFromOutScript(scriptPubKey: ScriptPubKey, network: Network): string;
