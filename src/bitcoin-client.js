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
const axios_1 = require("axios");
class BitcoinClient {
    constructor(config) {
        this.config = config;
    }
    getBlock(hash) {
        return this._rpcCall('getblock', hash);
    }
    getBlockHash(index) {
        return this._rpcCall('getblockhash', index);
    }
    getRawTransaction(txid) {
        return this._rpcCall('getrawtransaction', txid, true);
    }
    _rpcCall(methodName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const authData = {
                'user': this.config.user,
                'pass': this.config.pass
            };
            const auth = 'Basic ' + new Buffer(`${authData.user}:${authData.pass}`).toString('base64');
            const data = {
                'method': methodName,
                'params': [...args],
                'id': 'jsonrpc'
            };
            const url = `http://${this.config.host}:${this.config.port}`;
            const bitcoinAxios = axios_1.default.create({
                baseURL: url,
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                }
            });
            const response = yield bitcoinAxios.post(url, data)
                .catch(err => {
                console.error('Error in rpc client: ' + err);
                throw new Error(err);
            });
            return response.data.result;
        });
    }
}
exports.BitcoinClient = BitcoinClient;
//# sourceMappingURL=bitcoin-client.js.map