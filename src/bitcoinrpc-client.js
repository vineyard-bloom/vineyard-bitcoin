"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoin = require("bitcoin");
var config = require('../../config/secrets');
var BitcoinClient = (function () {
    function BitcoinClient() {
        this.client = new bitcoin.Client(config.bitcoin);
    }
    BitcoinClient.prototype.getHistory = function (lastBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.client.listSinceBlock(lastBlock || "", function (err, transactions) {
                if (err)
                    reject(new Error(err));
                else
                    resolve(transactions.transactions.filter(function (t) { return t.category == 'receive' || t.category == 'immature'; }));
            });
        });
    };
    BitcoinClient.prototype.getTransaction = function (txid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.client.getTransaction(txid, true, function (err, transaction) {
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
                    resolve(result);
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
            return _this.client.getNewAddress(function (err, newAddress) {
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
//# sourceMappingURL=bitcoinrpc-client.js.map