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
const { promisify } = require('util');
function getBlockCount(client) {
    return promisify(client.getBlockCount.bind(client));
}
exports.getBlockCount = getBlockCount;
function getBlockHash(client, index) {
    return promisify(client.getBlockHash.bind(client, index));
}
exports.getBlockHash = getBlockHash;
function getBlockByHash(client, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield promisify(client.getBlockHash.bind(client, hash));
    });
}
exports.getBlockByHash = getBlockByHash;
function getBlockByIndex(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield getBlockHash(client, index);
        return getBlockByHash(client, hash);
    });
}
exports.getBlockByIndex = getBlockByIndex;
function getTransaction(client, txid) {
    return promisify(client.getTransaction.bind(client, txid));
}
exports.getTransaction = getTransaction;
function getFullTransactions(client, transactions) {
    return __awaiter(this, void 0, void 0, function* () {
        let fullTransactions = [];
        for (let transaction of transactions) {
            let result = yield getTransaction(client, transaction);
            if (result) {
                const receiveDetail = result.details.find(detail => detail.category === 'receive');
                if (receiveDetail) {
                    fullTransactions.push({
                        txid: result.txid,
                        to: receiveDetail.address,
                        from: "",
                        amount: new BigNumber(receiveDetail.amount).abs(),
                        timeReceived: new Date(result.timereceived * 1000),
                        block: Number(result.blockindex),
                        status: TransactionStatus.pending,
                        confirmations: result.confirmations
                    });
                }
            }
        }
        return fullTransactions;
    });
}
exports.getFullTransactions = getFullTransactions;
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
        let fullTransactions = yield getFullTransactions(client, fullBlock.tx);
        let newFullBlock = {
            hash: fullBlock.hash,
            index: fullBlock.height,
            timeMined: new Date(fullBlock.time * 1000),
            transactions: fullTransactions
        };
        return newFullBlock;
    });
}
exports.getMultiTransactionBlock = getMultiTransactionBlock;
//# sourceMappingURL=client-functions.js.map