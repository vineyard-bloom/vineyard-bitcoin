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
const bitcoin = require('bitcoin');
const vineyard_blockchain_1 = require("vineyard-blockchain");
class BitcoinClient {
    constructor(bitcoinConfig) {
        this.client = new bitcoin.Client(bitcoinConfig);
    }
    getClient() {
        return this.client;
    }
    getTransactionStatus(txid) {
        return this.getTransaction(txid).then((transaction) => {
            if (transaction.confirmations == -1)
                return vineyard_blockchain_1.TransactionStatus.rejected;
            if (transaction.confirmations == 0)
                return vineyard_blockchain_1.TransactionStatus.pending;
            else {
                return vineyard_blockchain_1.TransactionStatus.accepted;
            }
        });
    }
    getLastBlock() {
        return this.getBlockCount().then((blockHeight) => {
            return this.getBlockHash(blockHeight).then((blockHash) => {
                return this.getBlock(blockHash).then((lastBlock) => {
                    return {
                        hash: lastBlock.hash,
                        index: lastBlock.height,
                        timeMined: new Date(lastBlock.time),
                        currency: 'BTC00000-0000-0000-0000-000000000000'
                    };
                });
            });
        });
    }
    getBlockHash(blockHeight) {
        return new Promise((resolve, reject) => {
            this.client.getBlockHash(blockHeight, (err, blockHash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockHash);
                }
            });
        });
    }
    getBlockCount() {
        return new Promise((resolve, reject) => {
            this.client.getBlockCount((err, blockCount) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockCount);
                }
            });
        });
    }
    getNextBlockInfo(previousBlock) {
        const nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0;
        return this.getBlockHash(nextBlockIndex).then(blockHash => {
            return this.getBlock(blockHash).then((nextBlock) => {
                return {
                    hash: nextBlock.hash,
                    index: nextBlock.height,
                    timeMined: new Date(nextBlock.time),
                    currency: 'BTC00000-0000-0000-0000-000000000000'
                };
            });
        });
    }
    getFullBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBlock(block.hash).then((fullBlock) => __awaiter(this, void 0, void 0, function* () {
                let fullTransactions = yield this.getFullTransactions(fullBlock.tx);
                let newFullBlock = {
                    hash: fullBlock.hash,
                    index: fullBlock.height,
                    timeMined: new Date(fullBlock.time),
                    transactions: fullTransactions
                };
                return newFullBlock;
            }));
        });
    }
    getFullTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullTransactions = [];
            for (let transaction of transactions) {
                let result = yield this.getTransaction(transaction.txid);
                if (!result)
                    return fullTransactions;
                for (let detail of result.details) {
                    fullTransactions.push({
                        txid: result.txid,
                        to: detail.address,
                        from: "",
                        amount: detail.amount.absoluteValue(),
                        timeReceived: new Date(result.timereceived),
                        block: result.blockindex,
                        status: vineyard_blockchain_1.TransactionStatus.pending,
                        confirmations: result.confirmations
                    });
                }
            }
            return fullTransactions;
        });
    }
    getHistory(lastBlock) {
        return new Promise((resolve, reject) => {
            this.client.listSinceBlock(lastBlock || "", 1, true, (err, info) => {
                if (err)
                    reject(err);
                else {
                    // const transactions = info.transactions
                    // const lastTransaction = transactions[transactions.length - 1]
                    resolve({
                        transactions: info.transactions.filter((t) => t.category == 'receive'),
                        lastBlock: info.lastblock //lastTransaction ? lastTransaction.blockhash : null
                    });
                }
            });
        });
    }
    listTransactions() {
        return new Promise((resolve, reject) => {
            this.client.listTransactions('', 100, 0, true, (err, transactions) => {
                if (err)
                    reject(err);
                else
                    resolve(transactions);
            });
        });
    }
    getTransaction(txid) {
        return new Promise((resolve, reject) => {
            this.client.getTransaction(txid, true, (err, transaction) => {
                resolve(transaction);
            });
        });
    }
    getBlock(blockhash) {
        return new Promise((resolve, reject) => {
            this.client.getBlock(blockhash, 2, (err, block) => {
                if (err)
                    reject(err);
                else
                    resolve(block);
            });
        });
    }
    importAddress(address, rescan = false) {
        return new Promise((resolve, reject) => {
            this.client.importAddress(address, "", rescan, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(address);
            });
        });
    }
    getInfo() {
        return new Promise((resolve, reject) => {
            this.client.getInfo((err, info) => {
                if (err)
                    reject(err);
                else
                    resolve(info);
            });
        });
    }
    listAddresses() {
        return new Promise((resolve, reject) => {
            this.client.listAddressGroupings((err, info) => {
                if (err)
                    reject(err);
                else
                    resolve(info);
            });
        });
    }
    createAddress() {
        return new Promise((resolve, reject) => {
            this.client.getNewAddress((err, newAddress) => {
                if (err)
                    reject(err);
                else
                    resolve(newAddress);
            });
        });
    }
    createTestAddress() {
        return new Promise((resolve, reject) => {
            this.client.getNewAddress((err, newAddress) => {
                if (err)
                    reject(err);
                else
                    return resolve(newAddress);
            });
        });
    }
    generate(amount) {
        return new Promise((resolve, reject) => {
            this.client.generate(amount, (err, amount) => {
                if (err)
                    reject(err);
                resolve(amount);
            });
        });
    }
    send(amount, address) {
        return new Promise((resolve, reject) => {
            this.client.sendToAddress(address, amount, (err, txid) => {
                if (err)
                    reject(err);
                resolve(txid);
            });
        });
    }
}
exports.BitcoinClient = BitcoinClient;
//# sourceMappingURL=bitcoin-client.js.map