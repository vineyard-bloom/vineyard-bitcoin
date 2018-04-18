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
const conversions_1 = require("./conversions");
const vineyard_blockchain_1 = require("vineyard-blockchain");
const BigNumber = require("bignumber.js");
class BitcoinClient {
    constructor(bitcoinConfig) {
        this.client = new bitcoin.Client(bitcoinConfig);
    }
    getClient() {
        return this.client;
    }
    getTransactionStatus(txid) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.getTransaction(txid);
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
        return __awaiter(this, void 0, void 0, function* () {
            const blockHeight = yield this.getBlockCount();
            const blockHash = yield this.getBlockHash(blockHeight);
            const lastBlock = yield this.getBlock(blockHash);
            return {
                hash: lastBlock.hash,
                index: lastBlock.height,
                timeMined: new Date(lastBlock.time * 1000),
                currency: 1
            };
        });
    }
    getBlockHash(blockHeight) {
        return new Promise((resolve, reject) => {
            this.client.getBlockHash(blockHeight, (err, blockHash) => {
                resolve(blockHash);
            });
        });
    }
    getBlockIndex() {
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
        return __awaiter(this, void 0, void 0, function* () {
            const nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0;
            const blockHash = yield this.getBlockHash(nextBlockIndex);
            if (!blockHash) {
                return;
            }
            const nextBlock = yield this.getBlock(blockHash);
            return {
                hash: nextBlock.hash,
                index: nextBlock.height,
                timeMined: new Date(nextBlock.time * 1000),
                currency: 1
            };
        });
    }
    getFullBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullBlock = yield this.getBlock(block.hash);
            let fullTransactions = yield this.getFullTransactions(fullBlock.tx);
            let newFullBlock = {
                hash: fullBlock.hash,
                index: fullBlock.height,
                timeMined: new Date(fullBlock.time * 1000),
                transactions: fullTransactions
            };
            return newFullBlock;
        });
    }
    getFullTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullTransactions = [];
            for (let transaction of transactions) {
                let result = yield this.getTransaction(transaction);
                if (!result)
                    continue;
                const receiveDetail = result.details.find(detail => detail.category === 'receive');
                if (receiveDetail) {
                    const amountToSatoshis = conversions_1.bitcoinToSatoshis(receiveDetail.amount);
                    fullTransactions.push({
                        txid: result.txid,
                        to: receiveDetail.address,
                        from: "",
                        amount: new BigNumber(amountToSatoshis).abs(),
                        timeReceived: new Date(result.timereceived * 1000),
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
            this.client.getBlock(blockhash, (err, block) => {
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