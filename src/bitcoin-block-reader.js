"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_functions_1 = require("./client-functions");
const Client = require('bitcoin-core');
class BitcoinBlockReader {
    constructor(client) {
        this.client = client;
    }
    getHeighestBlockIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getBlockCount();
        });
    }
    getFullBlock(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_functions_1.getMultiTransactionBlock(this.client, index);
        });
    }
    static createFromConfig(config) {
        return new BitcoinBlockReader(new Client(config));
    }
}
exports.BitcoinBlockReader = BitcoinBlockReader;
//# sourceMappingURL=bitcoin-block-reader.js.map