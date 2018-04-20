import { blockchain } from 'vineyard-blockchain';
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { Network } from "bitcoinjs-lib";
export declare class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
    private client;
    private network;
    constructor(client: AsyncBitcoinRpcClient, network: Network);
    getHeighestBlockIndex(): Promise<number>;
    getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>>;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
