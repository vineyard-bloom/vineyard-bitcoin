"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcore = require("bitcore-lib");
function getAddress(id, xpub) {
    var HDPubKey = new bitcore.HDPublicKey(xpub);
    var derivedKey = HDPubKey.derive('m/' + id);
    var pubKey = derivedKey.toObject().publicKey;
    var compressedPK = bitcore.PublicKey(pubKey);
    return compressedPK.toAddress().toString();
}
exports.getAddress = getAddress;
var AddressGenerator = (function () {
    function AddressGenerator(xpub) {
        this.xpub = xpub;
    }
    AddressGenerator.prototype.getAddress = function (id) {
        return Promise.resolve(getAddress(id, this.xpub));
    };
    return AddressGenerator;
}());
exports.AddressGenerator = AddressGenerator;
//# sourceMappingURL=getUserBTCAddress.js.map