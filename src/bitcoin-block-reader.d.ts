import { blockchain } from 'vineyard-blockchain';
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { Network } from "bitcoinjs-lib";
export declare type FullMultiTransactionBlock = blockchain.FullBlock<blockchain.MultiTransaction>;
export declare class BitcoinBlockReader implements blockchain.BlockReader<FullMultiTransactionBlock> {
    private client;
    private network;
    constructor(client: AsyncBitcoinRpcClient, network: Network);
    getHeighestBlockIndex(): Promise<number>;
    getFullBlock(index: number): Promise<FullMultiTransactionBlock>;
    static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader;
}
