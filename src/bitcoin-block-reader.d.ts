import { blockchain } from 'vineyard-blockchain';
import { BitcoinConfig2, BitcoinRpcClient } from "./types";
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
    private client;
    constructor(client: BitcoinRpcClient);
    getHeighestBlockIndex(): Promise<number>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined>;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
