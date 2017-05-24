"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcore_client_1 = require("./bitcore-client");
var address_source_fixture_1 = require("../../test/fixtures/address-source-fixture");
var config = require('../../config/secrets.json');
var RemoteAddressSource = (function () {
    function RemoteAddressSource(bitcoinClient) {
        this.bitcoreClient = new bitcore_client_1.BitcoreClient();
        this.bitcoinClient = bitcoinClient;
    }
    RemoteAddressSource.prototype.createAddress = function () {
        var _this = this;
        return this.bitcoreClient.createAddress()
            .then(function (address) { return _this.bitcoinClient.importAddress(address)
            .catch(function (error) {
            // Importing the address is simply a backup in case the address is not already being watched.
            // If it turns out the address is being watched then the importing code can be removed.
            console.error(error, error.stack);
            return address;
        }); });
    };
    return RemoteAddressSource;
}());
function getAddressSource(bitcoinClient) {
    // Allow the option to use bitcoind for local testing.
    if (config.addressSource === 'bitcoind')
        return bitcoinClient;
    if (config.addressSource === 'stub')
        return new address_source_fixture_1.AddressSourceFixture();
    return new RemoteAddressSource(bitcoinClient);
}
exports.getAddressSource = getAddressSource;
//# sourceMappingURL=address-source.js.map