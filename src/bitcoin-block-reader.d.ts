import { blockchain } from 'vineyard-blockchain';
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { Network } from "bitcoinjs-lib";
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
    private client;
    private network;
    private transactionChunkSize;
    constructor(client: AsyncBitcoinRpcClient, network: Network, transactionChunkSize?: number);
    getHeighestBlockIndex(): Promise<number>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>>;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
