import {BitcoinClient} from "./bitcoin-client";
import {BitcoreClient, BitcoreConfig} from "./bitcore/bitcore-client";
import {AddressSource} from "./types";

export class BitcoreAddressSource implements AddressSource {
  bitcoreClient: BitcoreClient
  bitcoinClient: BitcoinClient

  constructor(bitcoinClient: BitcoinClient, bitcoreConfig: BitcoreConfig) {
    this.bitcoinClient = bitcoinClient
    this.bitcoreClient = new BitcoreClient(bitcoreConfig)
  }

  createAddress(): Promise<string> {
    return this.bitcoreClient.createAddress()
      .then(address => this.bitcoinClient.importAddress(address)
        .then(() => address))
  }
}
