"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlueBirdPromise = require("bluebird");
var conversions_1 = require("./conversions");
var types_1 = require("./types");
var TransactionMonitor = (function () {
    function TransactionMonitor(bitcoinClient, transactionService) {
        this.minimumConfirmations = 2;
        this.transactionService = transactionService;
        this.bitcoinClient = bitcoinClient;
    }
    TransactionMonitor.prototype.convertStatus = function (source) {
        return source.confirmations >= this.minimumConfirmations
            ? types_1.TransactionStatus.accepted
            : types_1.TransactionStatus.pending;
    };
    TransactionMonitor.prototype.saveNewTransaction = function (source) {
        var _this = this;
        return this.transactionService.add({
            index: source.index,
            address: source.address,
            status: this.convertStatus(source),
            amount: conversions_1.bitcoinToSatoshis(source.amount),
            timeReceived: source.time,
            txid: source.txid
        })
            .then(function (result) { return result.isNew && source.confirmations >= _this.minimumConfirmations
            ? _this.transactionService.onConfirm(result.transaction)
            : Promise.resolve(result.transaction); })
            .catch(function (error) { return console.error('Error saving transaction', error, source); });
    };
    TransactionMonitor.prototype.saveNewTransactions = function (transactions) {
        var _this = this;
        return BlueBirdPromise.each(transactions, function (transaction) { return _this.saveNewTransaction(transaction); });
    };
    TransactionMonitor.prototype.confirmExistingTransaction = function (transaction) {
        var _this = this;
        transaction.status = types_1.TransactionStatus.accepted;
        return this.transactionService.setStatus(transaction, types_1.TransactionStatus.accepted)
            .then(function (newTransaction) {
            return _this.transactionService.onConfirm(transaction);
        });
    };
    TransactionMonitor.prototype.updatePendingTransaction = function (transaction) {
        var _this = this;
        return this.bitcoinClient.getTransaction(transaction.txid)
            .then(function (source) { return source.confirmations >= _this.minimumConfirmations
            ? _this.confirmExistingTransaction(transaction)
            : Promise.resolve(); });
    };
    TransactionMonitor.prototype.gatherNewTransactions = function () {
        var _this = this;
        return this.transactionService.getLastBlock()
            .then(function (lastBlock) { return _this.bitcoinClient.getHistory(lastBlock)
            .then(function (blocklist) { return (blocklist.transactions.length == 0
            ? Promise.resolve()
            : _this.saveNewTransactions(blocklist.transactions))
            .then(function () { return blocklist.lastBlock
            ? _this.transactionService.setLastBlock(blocklist.lastBlock)
            : Promise.resolve(); }); }); });
    };
    TransactionMonitor.prototype.updatePendingTransactions = function () {
        var _this = this;
        return this.transactionService.listPending()
            .then(function (transactions) { return BlueBirdPromise.each(transactions, function (t) { return _this.updatePendingTransaction(t)
            .catch(function (e) { return console.error('Bitcoin Transaction Pending Error', e, t); }); }); });
    };
    TransactionMonitor.prototype.update = function () {
        var _this = this;
        return this.updatePendingTransactions()
            .then(function () { return _this.gatherNewTransactions(); });
    };
    return TransactionMonitor;
}());
exports.TransactionMonitor = TransactionMonitor;
//# sourceMappingURL=transaction-monitor.js.map