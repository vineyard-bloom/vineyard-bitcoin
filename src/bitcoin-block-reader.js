"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_functions_1 = require("./client-functions");
const Client = require('bitcoin-core');
class BitcoinBlockReader {
    constructor(client) {
        this.client = client;
    }
    getHeighestBlockIndex() {
        return this.client.getBlockCount();
    }
    getFullBlock(index) {
        return client_functions_1.getMultiTransactionBlock(this.client, index);
    }
    static createFromConfig(config) {
        return new BitcoinBlockReader(new Client(config));
    }
}
exports.BitcoinBlockReader = BitcoinBlockReader;
//# sourceMappingURL=bitcoin-block-reader.js.map