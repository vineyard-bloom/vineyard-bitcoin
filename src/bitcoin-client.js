"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoin = require('bitcoin');
var vineyard_blockchain_1 = require("vineyard-blockchain");
var BitcoinClient = /** @class */ (function () {
    function BitcoinClient(bitcoinConfig) {
        this.client = new bitcoin.Client(bitcoinConfig);
    }
    BitcoinClient.prototype.getClient = function () {
        return this.client;
    };
    BitcoinClient.prototype.getTransactionStatus = function (txid) {
        return this.getTransaction(txid).then(function (transaction) {
            if (transaction.confirmations == -1)
                return vineyard_blockchain_1.TransactionStatus.rejected;
            if (transaction.confirmations == 0)
                return vineyard_blockchain_1.TransactionStatus.pending;
            else {
                return vineyard_blockchain_1.TransactionStatus.accepted;
            }
        });
    };
    BitcoinClient.prototype.getLastBlock = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.getBlockCount().then(function (blockHeight) {
                return _this.getBlockHash(blockHeight).then(function (blockHash) {
                    return _this.client.getBlock(String(blockHash), function (err, lastBlock) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            var newLastBlock = {
                                hash: lastBlock.hash,
                                index: lastBlock.height,
                                timeMined: new Date(lastBlock.time),
                                currency: 'BTC00000-0000-0000-0000-000000000000'
                            };
                            resolve(newLastBlock);
                        }
                    });
                });
            });
        });
    };
    BitcoinClient.prototype.getBlockHash = function (blockHeight) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.client.getBlockHash(blockHeight, function (err, blockHash) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockHash);
                }
            });
        });
    };
    BitcoinClient.prototype.getBlockCount = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.client.getBlockCount(function (err, blockCount) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockCount);
                }
            });
        });
    };
    BitcoinClient.prototype.getNextBlockInfo = function (previousBlock) {
        var _this = this;
        var nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0;
        return new Promise(function (resolve, reject) {
            return _this.getBlockHash(nextBlockIndex).then(function (blockHash) {
                return _this.client.getBlock(String(blockHash), function (err, nextBlock) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        var newNextBlock = {
                            hash: nextBlock.hash,
                            index: nextBlock.height,
                            timeMined: nextBlock.time
                        };
                        resolve(newNextBlock);
                    }
                });
            });
        });
    };
    BitcoinClient.prototype.getFullBlock = function (block) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.client.getBlock(String(block.hash), 2, function (err, fullBlock) {
                if (err) {
                    reject(err);
                }
                else {
                    var fullTransactions = _this.getFullTransactions(fullBlock.tx);
                    var newFullBlock = {
                        hash: fullBlock.hash,
                        index: fullBlock.height,
                        timeMined: fullBlock.time,
                        transactions: fullTransactions
                    };
                    resolve(newFullBlock);
                }
            });
        });
    };
    BitcoinClient.prototype.getFullTransactions = function (transactions) {
        var fullTransactions = [];
        for (var transaction in transactions) {
            this.client.getTransaction(transactions[transaction].txid, true, function (err, transaction) {
                if (err) {
                    return err;
                }
                else {
                    fullTransactions.push(transaction);
                }
            });
        }
        return fullTransactions;
    };
    BitcoinClient.prototype.getHistory = function (lastBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.listSinceBlock(lastBlock || "", 1, true, function (err, info) {
                if (err)
                    reject(new Error(err));
                else {
                    // const transactions = info.transactions
                    // const lastTransaction = transactions[transactions.length - 1]
                    resolve({
                        transactions: info.transactions.filter(function (t) { return t.category == 'receive'; }),
                        lastBlock: info.lastblock //lastTransaction ? lastTransaction.blockhash : null
                    });
                }
            });
        });
    };
    BitcoinClient.prototype.listTransactions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.listTransactions('', 100, 0, true, function (err, transactions) {
                if (err)
                    reject(new Error(err));
                else
                    resolve(transactions);
            });
        });
    };
    BitcoinClient.prototype.getTransaction = function (txid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getTransaction(txid, true, function (err, transaction) {
                if (err)
                    reject(err);
                else
                    resolve(transaction);
            });
        });
    };
    BitcoinClient.prototype.importAddress = function (address, rescan) {
        var _this = this;
        if (rescan === void 0) { rescan = false; }
        return new Promise(function (resolve, reject) {
            _this.client.importAddress(address, "", rescan, function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(address);
            });
        });
    };
    BitcoinClient.prototype.getInfo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getInfo(function (err, info) {
                if (err)
                    reject(err);
                else
                    resolve(info);
            });
        });
    };
    BitcoinClient.prototype.listAddresses = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.listAddressGroupings(function (err, info) {
                if (err)
                    reject(err);
                else
                    resolve(info);
            });
        });
    };
    BitcoinClient.prototype.createAddress = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getNewAddress(function (err, newAddress) {
                if (err)
                    reject(err);
                else
                    resolve(newAddress);
            });
        });
    };
    BitcoinClient.prototype.createTestAddress = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getNewAddress(function (err, newAddress) {
                if (err)
                    reject(err);
                else
                    return resolve(newAddress);
            });
        });
    };
    BitcoinClient.prototype.generate = function (amount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.generate(amount, function (err, amount) {
                if (err)
                    reject(err);
                resolve(amount);
            });
        });
    };
    BitcoinClient.prototype.send = function (amount, address) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.sendToAddress(address, amount, function (err, txid) {
                if (err)
                    reject(err);
                resolve(txid);
            });
        });
    };
    return BitcoinClient;
}());
exports.BitcoinClient = BitcoinClient;
//# sourceMappingURL=bitcoin-client.js.map