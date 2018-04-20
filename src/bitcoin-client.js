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
const blockchain_1 = require("vineyard-blockchain/src/blockchain");
const client_functions_1 = require("./client-functions");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const util_1 = require("util");
const Client = require('bitcoin-core');
const bitcoin = require('bitcoin');
const bitcoin_utility_1 = require("vineyard-blockchain/src/bitcoin-utility");
const BigNumber = require("bignumber.js");
class BitcoinClient {
    constructor(bitcoinConfig) {
        const { network } = bitcoinConfig, callbackConfig = __rest(bitcoinConfig, ["network"]);
        this.client = new bitcoin.Client(callbackConfig);
        const { user: username, pass: password } = callbackConfig, asyncConfig = __rest(callbackConfig, ["user", "pass"]);
        this.asyncClient = new Client(Object.assign({ username, password }, asyncConfig));
        this.network = network || bitcoinjs_lib_1.networks.bitcoin;
    }
    getClient() {
        return this.client;
    }
    getAsyncClient() {
        return this.asyncClient;
    }
    getTransactionStatus(txid) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.getTransaction(txid);
            if (transaction.confirmations == -1)
                return blockchain_1.blockchain.TransactionStatus.rejected;
            if (transaction.confirmations == 0)
                return blockchain_1.blockchain.TransactionStatus.pending;
            else {
                return blockchain_1.blockchain.TransactionStatus.accepted;
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
                timeMined: new Date(lastBlock.time * 1000)
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
    getNextBlockInfo(blockIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextBlockIndex = util_1.isNullOrUndefined(blockIndex) ? 0 : blockIndex + 1;
            const blockHash = yield this.getBlockHash(nextBlockIndex);
            if (!blockHash)
                return;
            const nextBlock = yield this.getBlock(blockHash);
            return {
                hash: nextBlock.hash,
                index: nextBlock.height,
                timeMined: new Date(nextBlock.time * 1000)
            };
        });
    }
    getFullBlock(blockindex) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockHash = yield this.asyncClient.getBlockHash(blockindex);
            if (!blockHash) {
                console.warn(`Queried for blockhash for block index ${blockindex} but got none.`);
                return undefined;
            }
            const fullBlock = yield this.asyncClient.getBlock(blockHash);
            let fullTransactions = yield this.getFullTransactions(fullBlock.tx, blockindex);
            return {
                hash: fullBlock.hash,
                index: fullBlock.height,
                timeMined: new Date(fullBlock.time * 1000),
                transactions: fullTransactions
            };
        });
    }
    getFullTransactions(txids, blockIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleTxs = [];
            const multiTxs = yield client_functions_1.getMultiTransactions(this.asyncClient, txids, blockIndex);
            multiTxs.forEach(mtx => {
                const { txid, outputs, status, timeReceived } = mtx;
                outputs.forEach((output) => {
                    const { scriptPubKey, amount } = output;
                    singleTxs.push({
                        txid,
                        timeReceived,
                        to: bitcoin_utility_1.addressFromOutScriptHex(scriptPubKey.hex, this.network),
                        from: "",
                        amount: new BigNumber(value),
                        blockIndex,
                        status
                    });
                });
            });
            return singleTxs;
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