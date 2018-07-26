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
const request = require("request-promise");
class BitcoinClient {
    constructor(config) {
        this.config = config;
    }
    getBlock(hash) {
        return this.rpcCall('getblock', hash);
    }
    getBlockHash(index) {
        return this.rpcCall('getblockhash', index);
    }
    getRawTransaction(txid) {
        return this.rpcCall('getrawtransaction', txid, true);
    }
    rpcCall(methodName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = {
                'user': this.config.user,
                'pass': this.config.pass
            };
            const body = {
                'method': methodName,
                'params': [...args],
                'id': 'jsonrpc'
            };
            const options = {
                method: 'POST',
                uri: `http://${this.config.host}:${this.config.port}`,
                auth: auth,
                json: true,
                body: body
            };
            const response = yield request(options);
            if (response.error !== null) {
                throw new Error(response.error);
            }
            return response.result;
        });
    }
}
exports.BitcoinClient = BitcoinClient;
//# sourceMappingURL=bitcoin-client.js.map