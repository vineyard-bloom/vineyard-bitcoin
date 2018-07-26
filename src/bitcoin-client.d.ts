import { BitcoinConfig, BitcoinRPCBlock, RawRPCSerializedTransaction } from './types';
export declare class BitcoinClient {
    readonly config: BitcoinConfig;
    constructor(config: BitcoinConfig);
    getBlock(hash: string): Promise<BitcoinRPCBlock>;
    getBlockHash(index: number): Promise<string>;
    getRawTransaction(txid: string): Promise<RawRPCSerializedTransaction>;
    private rpcCall;
}
