import { blockchain } from 'vineyard-blockchain';
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.MultiTransaction> {
    private client;
    getHeighestBlockIndex(): Promise<number>;
    getBlockInfo(index: number): Promise<blockchain.Block | undefined>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined>;
}
