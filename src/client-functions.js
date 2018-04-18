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
const vineyard_blockchain_1 = require("vineyard-blockchain");
const bignumber_js_1 = require("bignumber.js");
exports.liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
const { promisify } = require('util');
// export function getBlockCount(client: BitcoinRpcClient): Promise<number> {
//   return promisify(client.getBlockCount.bind(client))()
// }
//
// export function getBlockHash(client: BitcoinRpcClient, index: number): Promise<string> {
//   return promisify(client.getBlockHash.bind(client))(index)
// }
//
// export async function getBlockByHash(client: BitcoinRpcClient, hash: string): Promise<Block> {
//   return await promisify(client.getBlockHash.bind(client))(hash)
// }
function getBlockByIndex(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield client.getBlockHash(index);
        return client.getBlock(hash);
    });
}
exports.getBlockByIndex = getBlockByIndex;
// export function getTransaction(client: BitcoinRpcClient, txid: string): Promise<BitcoinTransactionSource> {
//   return promisify(client.getTransaction.bind(client))(txid)
// }
// export function getRawTransaction(client: BitcoinRpcClient, txid: string): Promise<RawTransaction> {
//   return promisify(client.getRawTransaction.bind(client))(txid)
// }
// function convertInput(input: any): blockchain.TransactionInput {
//   return {
//
//   }
// }
//
// function convertOutput(output: any): blockchain.TransactionOutput {
//   return {
//
//   }
// }
function getMultiTransactions(client, transactions, blockIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = transactions
            .filter(t => t !== exports.liveGenesisTxid)
            .map((t) => __awaiter(this, void 0, void 0, function* () {
            console.log('t', t);
            const raw = yield client.getRawTransaction(t, true);
            return {
                txid: raw.txid,
                timeReceived: new Date(raw.blocktime * 1000),
                status: vineyard_blockchain_1.blockchain.TransactionStatus.unknown,
                fee: new bignumber_js_1.BigNumber(0),
                nonce: 0,
                blockIndex: blockIndex,
                inputs: raw.vin,
                outputs: raw.vout,
                original: raw
            };
        }));
        return Promise.all(promises);
    });
}
exports.getMultiTransactions = getMultiTransactions;
function bitcoinToBlockchainBlock(block) {
    return {
        hash: block.hash,
        index: block.height,
        timeMined: new Date(block.time),
    };
}
exports.bitcoinToBlockchainBlock = bitcoinToBlockchainBlock;
function getMultiTransactionBlock(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullBlock = yield getBlockByIndex(client, index);
        let transactions = yield getMultiTransactions(client, fullBlock.tx, index);
        let newFullBlock = {
            hash: fullBlock.hash,
            index: fullBlock.height,
            timeMined: new Date(fullBlock.time * 1000),
            transactions: transactions
        };
        return newFullBlock;
    });
}
exports.getMultiTransactionBlock = getMultiTransactionBlock;
//# sourceMappingURL=client-functions.js.map