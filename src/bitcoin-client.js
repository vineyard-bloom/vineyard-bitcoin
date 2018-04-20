"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var blockchain_1 = require("vineyard-blockchain/src/blockchain");
var client_functions_1 = require("./client-functions");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var util_1 = require("util");
var Client = require('bitcoin-core');
var bitcoin = require('bitcoin');
var BitcoinClient = (function () {
    function BitcoinClient(bitcoinConfig) {
        var network = bitcoinConfig.network, callbackConfig = __rest(bitcoinConfig, ["network"]);
        this.client = new bitcoin.Client(callbackConfig);
        var username = callbackConfig.user, password = callbackConfig.pass, asyncConfig = __rest(callbackConfig, ["user", "pass"]);
        this.asyncClient = new Client(__assign({ username: username, password: password }, asyncConfig));
        this.network = network || bitcoinjs_lib_1.networks.bitcoin;
    }
    BitcoinClient.prototype.getClient = function () {
        return this.client;
    };
    BitcoinClient.prototype.getAsyncClient = function () {
        return this.asyncClient;
    };
    BitcoinClient.prototype.getTransactionStatus = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTransaction(txid)];
                    case 1:
                        transaction = _a.sent();
                        if (transaction.confirmations == -1)
                            return [2 /*return*/, blockchain_1.blockchain.TransactionStatus.rejected];
                        if (transaction.confirmations == 0)
                            return [2 /*return*/, blockchain_1.blockchain.TransactionStatus.pending];
                        else {
                            return [2 /*return*/, blockchain_1.blockchain.TransactionStatus.accepted];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BitcoinClient.prototype.getLastBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blockHeight, blockHash, lastBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockCount()];
                    case 1:
                        blockHeight = _a.sent();
                        return [4 /*yield*/, this.getBlockHash(blockHeight)];
                    case 2:
                        blockHash = _a.sent();
                        return [4 /*yield*/, this.getBlock(blockHash)];
                    case 3:
                        lastBlock = _a.sent();
                        return [2 /*return*/, {
                                hash: lastBlock.hash,
                                index: lastBlock.height,
                                timeMined: new Date(lastBlock.time * 1000)
                            }];
                }
            });
        });
    };
    BitcoinClient.prototype.getBlockHash = function (blockHeight) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getBlockHash(blockHeight, function (err, blockHash) {
                resolve(blockHash);
            });
        });
    };
    BitcoinClient.prototype.getBlockIndex = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getBlockCount(function (err, blockCount) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockCount);
                }
            });
        });
    };
    BitcoinClient.prototype.getBlockCount = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getBlockCount(function (err, blockCount) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(blockCount);
                }
            });
        });
    };
    BitcoinClient.prototype.getNextBlockInfo = function (blockIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var nextBlockIndex, blockHash, nextBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextBlockIndex = util_1.isNullOrUndefined(blockIndex) ? 0 : blockIndex + 1;
                        return [4 /*yield*/, this.getBlockHash(nextBlockIndex)];
                    case 1:
                        blockHash = _a.sent();
                        if (!blockHash)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.getBlock(blockHash)];
                    case 2:
                        nextBlock = _a.sent();
                        return [2 /*return*/, {
                                hash: nextBlock.hash,
                                index: nextBlock.height,
                                timeMined: new Date(nextBlock.time * 1000)
                            }];
                }
            });
        });
    };
    BitcoinClient.prototype.getFullBlock = function (blockindex) {
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, fullBlock, fullTransactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.asyncClient.getBlockHash(blockindex)];
                    case 1:
                        blockHash = _a.sent();
                        if (!blockHash) {
                            console.warn("Queried for blockhash for block index " + blockindex + " but got none.");
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, this.asyncClient.getBlock(blockHash)];
                    case 2:
                        fullBlock = _a.sent();
                        return [4 /*yield*/, this.getFullTransactions(fullBlock.tx, blockindex)];
                    case 3:
                        fullTransactions = _a.sent();
                        return [2 /*return*/, {
                                hash: fullBlock.hash,
                                index: fullBlock.height,
                                timeMined: new Date(fullBlock.time * 1000),
                                transactions: fullTransactions
                            }];
                }
            });
        });
    };
    BitcoinClient.prototype.getFullTransactions = function (txids, blockIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var singleTxs, multiTxs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        singleTxs = [];
                        return [4 /*yield*/, client_functions_1.getMultiTransactions(this.asyncClient, txids, blockIndex, this.network)];
                    case 1:
                        multiTxs = _a.sent();
                        multiTxs.forEach(function (mtx) {
                            var txid = mtx.txid, outputs = mtx.outputs, status = mtx.status, timeReceived = mtx.timeReceived;
                            outputs.forEach(function (output) {
                                var scriptPubKey = output.scriptPubKey, valueSat = output.valueSat, address = output.address;
                                singleTxs.push({
                                    txid: txid,
                                    timeReceived: timeReceived,
                                    to: address,
                                    from: "",
                                    amount: valueSat,
                                    blockIndex: blockIndex,
                                    status: status
                                });
                            });
                        });
                        return [2 /*return*/, singleTxs];
                }
            });
        });
    };
    BitcoinClient.prototype.getHistory = function (lastBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.listSinceBlock(lastBlock || "", 1, true, function (err, info) {
                if (err)
                    reject(err);
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
                    reject(err);
                else
                    resolve(transactions);
            });
        });
    };
    BitcoinClient.prototype.getTransaction = function (txid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getTransaction(txid, true, function (err, transaction) {
                resolve(transaction);
            });
        });
    };
    BitcoinClient.prototype.getBlock = function (blockhash) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getBlock(blockhash, function (err, block) {
                if (err)
                    reject(err);
                else
                    resolve(block);
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
