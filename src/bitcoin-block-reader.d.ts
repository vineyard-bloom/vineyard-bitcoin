import { blockchain } from 'vineyard-blockchain';
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
    private client;
    constructor(client: AsyncBitcoinRpcClient);
    getHeighestBlockIndex(): Promise<number>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>>;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
