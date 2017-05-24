import {BitcoinClient} from "./bitcoinrpc-client";
import {BitcoreClient} from "./bitcore-client";
import {AddressSourceFixture} from "../../test/fixtures/address-source-fixture";
const config = require('../../config/secrets.json');

export interface AddressSource {
    createAddress(): Promise<string>
}

class RemoteAddressSource implements AddressSource {
    bitcoreClient = new BitcoreClient()
    bitcoinClient: BitcoinClient

    constructor(bitcoinClient: BitcoinClient) {
        this.bitcoinClient = bitcoinClient
    }

    createAddress(): Promise<string> {
        return this.bitcoreClient.createAddress()
            .then(address => this.bitcoinClient.importAddress(address)
                .catch(error => {
                    // Importing the address is simply a backup in case the address is not already being watched.
                    // If it turns out the address is being watched then the importing code can be removed.
                    console.error(error, error.stack)
                    return address
                })
            )
    }
}

export function getAddressSource(bitcoinClient: BitcoinClient): AddressSource {
    // Allow the option to use bitcoind for local testing.
    if (config.addressSource === 'bitcoind')
        return bitcoinClient

    if (config.addressSource === 'stub')
        return new AddressSourceFixture()

    return new RemoteAddressSource(bitcoinClient)
}