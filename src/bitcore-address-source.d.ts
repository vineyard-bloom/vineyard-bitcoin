import { BitcoinClient } from "./bitcoin-client";
import { BitcoreClient, BitcoreConfig } from "./bitcore/bitcore-client";
import { AddressSource } from "./types";
export declare class BitcoreAddressSource implements AddressSource {
    bitcoreClient: BitcoreClient;
    bitcoinClient: BitcoinClient;
    constructor(bitcoinClient: BitcoinClient, bitcoreConfig: BitcoreConfig);
    createAddress(): Promise<string>;
}
