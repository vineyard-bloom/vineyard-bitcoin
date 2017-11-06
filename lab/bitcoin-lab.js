"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoin_server_1 = require("./bitcoin-server");
var src_1 = require("../src");
var child_process = require('child_process');
var fs = require('fs');
var rimraf = require('rimraf');
var BitcoinLab = /** @class */ (function () {
    function BitcoinLab(config, client, server) {
        if (server === void 0) { server = new bitcoin_server_1.BitcoinServer(); }
        this.config = config;
        this.client = client;
        this.server = server;
    }
    BitcoinLab.prototype.deleteLock = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.unlink(_this.config.walletPath + '/' + '.lock', function (result, error, stdout, stderr) {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    };
    BitcoinLab.prototype.deleteWallet = function () {
        var _this = this;
        console.log('Deleting regtest bitcoin wallet');
        return this.deleteLock()
            .then(function () { return new Promise(function (resolve, reject) {
            rimraf(_this.config.walletPath, function (error, stdout, stderr) {
                if (error)
                    reject(error);
                else
                    resolve(stdout);
            });
        }); });
    };
    BitcoinLab.prototype.importAddress = function (address) {
        return this.client.importAddress(address);
    };
    BitcoinLab.prototype.start = function () {
        return this.server.start();
    };
    BitcoinLab.prototype.stop = function () {
        return this.server.stop();
    };
    BitcoinLab.prototype.reset = function () {
        return this.deleteWallet();
        // return this.stop()
        // .then(() => this.deleteWallet())
        // .then(() => this.start())
    };
    BitcoinLab.prototype.generate = function (blockCount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getClient().generate(blockCount, function (error) {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    };
    BitcoinLab.prototype.send = function (address, amount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.getClient().sendToAddress(address, src_1.satoshisToBitcoin(amount), function (error) {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    };
    BitcoinLab.prototype.sendMany = function (addressAmounts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var i in addressAmounts) {
                addressAmounts[i] = src_1.satoshisToBitcoin(addressAmounts[i]);
            }
            _this.client.getClient().sendMany('', addressAmounts, function (error) {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    };
    return BitcoinLab;
}());
exports.BitcoinLab = BitcoinLab;
//# sourceMappingURL=bitcoin-lab.js.map