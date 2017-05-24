"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require('bitcore-wallet-client');
var utils = require('./cli-utils');
var fs = require('fs');
var bitcoreSecrets = require('../../config/secrets.json').bitcore;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var BitcoreClient = (function () {
    function BitcoreClient() {
        this.isOpen = false;
        this.client = new Client({
            baseUrl: bitcoreSecrets.bwsUrl,
            // baseUrl: 'fakefakefake.gov',
            verbose: false,
        });
        var wallet = fs.readFileSync(bitcoreSecrets.walletFile, 'utf8');
        this.client.import(wallet, {});
    }
    BitcoreClient.prototype.openWallet = function () {
        var _this = this;
        this.isOpen = true;
        console.log('Connecting to bitcore wallet.');
        return new Promise(function (resolve) {
            _this.client.openWallet(function (err, ret) {
                utils.die(err);
                console.log('Now connected to bitcore wallet.');
                resolve(ret);
            });
        });
    };
    // This is now obsolete.
    BitcoreClient.prototype.start = function () {
        return this.isOpen
            ? new Promise(function (r) { return r(); })
            : this.openWallet();
    };
    BitcoreClient.prototype.checkStart = function (action) {
        return this.isOpen
            ? action()
            : this.openWallet()
                .then(function () { return action(); });
    };
    BitcoreClient.prototype.getHistory = function (skip, limit) {
        var _this = this;
        return this.checkStart(function () { return new Promise(function (resolve) {
            // const options: any = {skip: skip - 1}
            // if (typeof limit === 'number')
            //     options.limit = limit
            _this.client.getTxHistory({}, function (err, transactions) {
                utils.die(err);
                // if (skip > 0)
                //     transactions.unshift()
                // for (let i = 0; i < transactions.length; ++i) {
                //     transactions[i].index = i + skip
                // }
                resolve(transactions);
            });
        }); });
    };
    // getTransaction(txid: string): Promise<TransactionSource> {
    //     return this.getHistory(index, 1)
    //         .then(transactions => transactions [0])
    // }
    BitcoreClient.prototype.createAddress = function () {
        var _this = this;
        return this.checkStart(function () { return new Promise(function (resolve) {
            _this.client.createAddress({}, function (err, record) {
                utils.die(err);
                resolve(record.address);
            });
        }); });
    };
    return BitcoreClient;
}());
exports.BitcoreClient = BitcoreClient;
//# sourceMappingURL=bitcore-client.js.map