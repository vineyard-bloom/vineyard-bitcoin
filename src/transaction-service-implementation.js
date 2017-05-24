"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../model");
var conversions_1 = require("../logic/conversions");
var TransactionServiceImplementation = (function () {
    function TransactionServiceImplementation(model, currencyConverter) {
        this.model = model;
        this.currencyConverter = currencyConverter;
    }
    TransactionServiceImplementation.prototype.add = function (transaction) {
        var _this = this;
        return this.model.Account.first_or_null({ bitcoinAddress: transaction.address })
            .then(function (account) {
            if (!account) {
                throw new Error("No account with a bitcoinAddress of '" + transaction.address + "'");
            }
            else {
                return _this.model.Transaction.first_or_null({ txid: transaction.txid })
                    .then(function (existing) {
                    if (existing)
                        return Promise.resolve(existing);
                    var usd = _this.currencyConverter.btc_to_usd(conversions_1.satoshisToBitcoin(transaction.amount));
                    var salt = _this.currencyConverter.usd_to_salt(usd);
                    var timeReceived = new Date(transaction.timeReceived * 1000);
                    return _this.model.Transaction.create({
                        account: account,
                        satoshis: transaction.amount,
                        usd: usd,
                        salt: salt,
                        txid: transaction.txid,
                        address: transaction.address,
                        status: transaction.status,
                        timeReceived: timeReceived,
                        index: transaction.index
                    })
                        .then(function (t) { return t; });
                });
            }
        });
    };
    TransactionServiceImplementation.prototype.setStatus = function (transaction, status) {
        return this.model.Transaction.update(transaction, {
            status: status
        });
    };
    TransactionServiceImplementation.prototype.onConfirm = function (transaction) {
        var sql = "\nUPDATE accounts\nSET salt = salt + :amount\nWHERE id = :id\n";
        var id = typeof transaction.account == 'string'
            ? transaction.account
            : transaction.account.id;
        return this.model.db.query(sql, {
            replacements: {
                amount: transaction.salt,
                id: id
            }
        });
    };
    TransactionServiceImplementation.prototype.getLastBlock = function () {
        return this.model.Bitcoin.first_or_null()
            .then(function (record) { return record ? record.lastblock : ''; });
    };
    TransactionServiceImplementation.prototype.listPending = function () {
        return this.model.Transaction.filter({
            status: model_1.TransactionStatus.pending
        }).exec();
    };
    TransactionServiceImplementation.prototype.setLastBlock = function (value) {
        var _this = this;
        return this.model.Bitcoin.first_or_null()
            .then(function (record) { return record
            ? _this.model.Bitcoin.update(record, { lastblock: value })
            : _this.model.Bitcoin.create({ lastblock: value }); });
    };
    return TransactionServiceImplementation;
}());
exports.TransactionServiceImplementation = TransactionServiceImplementation;
//# sourceMappingURL=transaction-service-implementation.js.map