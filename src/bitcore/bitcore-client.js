"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require('bitcore-wallet-client');
// var utils = require('./cli-utils');
var fs = require('fs');
function die(err) {
    if (err) {
        if (err.code && err.code == 'ECONNREFUSED') {
            console.error('Bitcore Service error', 'Could not connect to Bicore Wallet Service');
        }
        else {
            console.error('Bitcore Service error', err);
        }
        process.exit(1);
    }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var BitcoreClient = /** @class */ (function () {
    function BitcoreClient(bitcoreConfig) {
        this.isOpen = false;
        this.bitcoreConfig = bitcoreConfig;
        this.client = new Client({
            baseUrl: this.bitcoreConfig.bwsUrl,
            // baseUrl: 'fakefakefake.gov',
            verbose: false,
        });
        var wallet = fs.readFileSync(this.bitcoreConfig.walletFile, 'utf8');
        this.client.import(wallet, {});
    }
    BitcoreClient.prototype.openWallet = function () {
        var _this = this;
        this.isOpen = true;
        console.log('Connecting to bitcore wallet.');
        return new Promise(function (resolve, reject) {
            _this.client.openWallet(function (err, ret) {
                die(err);
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
        return this.checkStart(function () { return new Promise(function (resolve, reject) {
            // const options: any = {skip: skip - 1}
            // if (typeof limit === 'number')
            //     options.limit = limit
            _this.client.getTxHistory({}, function (err, transactions) {
                die(err);
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
        return this.checkStart(function () { return new Promise(function (resolve, reject) {
            var options = {
                ignoreMaxGap: true
            };
            _this.client.createAddress(options, function (err, record) {
                die(err);
                resolve(record.address);
            });
        }); });
    };
    return BitcoreClient;
}());
exports.BitcoreClient = BitcoreClient;
//# sourceMappingURL=bitcore-client.js.map
