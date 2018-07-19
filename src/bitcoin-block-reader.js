"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const client_functions_1 = require("./client-functions");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const hot_shots_1 = require("hot-shots");
const dogstatsd = new hot_shots_1.StatsD();
const Client = require('bitcoin-core');
class BitcoinBlockReader {
    constructor(client, network, transactionChunkSize = types_1.Defaults.TRANSACTION_CHUNK_SIZE) {
        this.client = client;
        this.network = network;
        this.transactionChunkSize = transactionChunkSize;
    }
    getHeighestBlockIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            dogstatsd.increment('bitcoin.rpc.getblockcount');
            return this.client.getBlockCount();
        });
    }
    getBlockBundle(index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.incrementDatadogCounters();
            return client_functions_1.getMultiTransactionBlock(this.client, index, this.network, this.transactionChunkSize);
        });
    }
    incrementDatadogCounters() {
        dogstatsd.increment('bitcoin.rpc.getrawtransaction');
        dogstatsd.increment('bitcoin.rpc.getblockhash');
        dogstatsd.increment('bitcion.rpc.getblock');
    }
    static createFromConfig(config) {
        const { network, transactionChunkSize } = config, blockReaderConfig = __rest(config, ["network", "transactionChunkSize"]);
        return new BitcoinBlockReader(new Client(blockReaderConfig), network || bitcoinjs_lib_1.networks.bitcoin, transactionChunkSize);
    }
}
exports.BitcoinBlockReader = BitcoinBlockReader;
//# sourceMappingURL=bitcoin-block-reader.js.map