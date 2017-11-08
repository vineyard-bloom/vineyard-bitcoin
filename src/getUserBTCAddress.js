"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcore = require('bitcore-lib');
function getAddress(id, xpub) {
    const HDPubKey = new bitcore.HDPublicKey(xpub);
    const derivedKey = HDPubKey.derive('m/' + id);
    const pubKey = derivedKey.toObject().publicKey;
    const compressedPK = bitcore.PublicKey(pubKey);
    return compressedPK.toAddress().toString();
}
exports.getAddress = getAddress;
class AddressGenerator {
    constructor(xpub) {
        this.xpub = xpub;
    }
    getAddress(id) {
        return Promise.resolve(getAddress(id, this.xpub));
    }
}
exports.AddressGenerator = AddressGenerator;
//# sourceMappingURL=getUserBTCAddress.js.map