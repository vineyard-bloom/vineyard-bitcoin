import { blockchain } from 'vineyard-blockchain';
import { BitcoinConfig, BitcoinRpcClient } from "./types";
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.MultiTransaction> {
    private client;
    constructor(client: BitcoinRpcClient);
    getHeighestBlockIndex(): Promise<number>;
    getBlockInfo(index: number): Promise<blockchain.Block | undefined>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined>;
    static createFromConfig(config: BitcoinConfig): BitcoinBlockReader;
}
