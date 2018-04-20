"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function satoshisToBitcoin(value) {
    return value * 0.00000001;
}
exports.satoshisToBitcoin = satoshisToBitcoin;
function bitcoinToSatoshis(value) {
    return value * 100000000;
}
exports.bitcoinToSatoshis = bitcoinToSatoshis;
