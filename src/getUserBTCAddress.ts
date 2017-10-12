const bitcore = require('bitcore-lib')

export function getAddress(id: string, xpub: string) {
    const HDPubKey = new bitcore.HDPublicKey(xpub);
    const derivedKey =  HDPubKey.derive('m/' + id);
    const pubKey = derivedKey.toObject().publicKey;
    const compressedPK = bitcore.PublicKey(pubKey);
    return compressedPK.toAddress().toString();
}

export class AddressGenerator {
    xpub: string;
    constructor(xpub: string) {
        this.xpub = xpub
    }

    getAddress(id: string) {
        return Promise.resolve(getAddress(id, this.xpub))
    }
}

