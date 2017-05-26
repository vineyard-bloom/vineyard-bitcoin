"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcore_client_1 = require("./bitcore/bitcore-client");
var BitcoreAddressSource = (function () {
    function BitcoreAddressSource(bitcoinClient, bitcoreConfig) {
        this.bitcoinClient = bitcoinClient;
        this.bitcoreClient = new bitcore_client_1.BitcoreClient(bitcoreConfig);
    }
    BitcoreAddressSource.prototype.createAddress = function () {
        var _this = this;
        return this.bitcoreClient.createAddress()
            .then(function (address) { return _this.bitcoinClient.importAddress(address); });
    };
    return BitcoreAddressSource;
}());
exports.BitcoreAddressSource = BitcoreAddressSource;
//# sourceMappingURL=bitcore-address-source.js.map