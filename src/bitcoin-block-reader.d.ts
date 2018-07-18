import { blockchain } from 'vineyard-blockchain';
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { Network } from "bitcoinjs-lib";
export declare type FullMultiTransactionBlock = blockchain.BlockBundle<blockchain.Block, blockchain.Transaction>;
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.Block, blockchain.Transaction> {
    private client;
    private network;
    private transactionChunkSize;
    constructor(client: AsyncBitcoinRpcClient, network: Network, transactionChunkSize?: number);
    getHeighestBlockIndex(): Promise<number>;
    getBlockBundle(index: number): Promise<blockchain.BlockBundle<blockchain.Block, blockchain.Transaction>>;
    private incrementDatadogCounters;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
