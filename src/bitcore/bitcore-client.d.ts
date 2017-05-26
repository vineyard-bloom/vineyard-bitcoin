import { TransactionSource } from "../types";
export interface BitcoreConfig {
    bwsUrl: string;
    walletFile: string;
}
export declare class BitcoreClient {
    private client;
    private isOpen;
    bitcoreConfig: BitcoreConfig;
    private openWallet();
    constructor(bitcoreConfig: BitcoreConfig);
    start(): Promise<void>;
    checkStart<T>(action: () => Promise<T>): Promise<T>;
    getHistory(skip: number, limit?: number): Promise<TransactionSource[]>;
    createAddress(): Promise<string>;
}
