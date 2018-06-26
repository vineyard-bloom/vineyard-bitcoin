"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlueBirdPromise = require('bluebird');
const conversions_1 = require("./conversions");
const types_1 = require("./types");
class TransactionMonitor {
    constructor(bitcoinClient, transactionService) {
        this.minimumConfirmations = 2;
        this.transactionService = transactionService;
        this.bitcoinClient = bitcoinClient;
    }
    convertStatus(source) {
        return source.confirmations >= this.minimumConfirmations
            ? types_1.TransactionStatus.accepted
            : types_1.TransactionStatus.pending;
    }
    saveNewTransaction(source) {
        return this.transactionService.add({
            index: source.index,
            address: source.address,
            status: this.convertStatus(source),
            amount: conversions_1.bitcoinToSatoshis(source.amount),
            timeReceived: source.time,
            txid: source.txid
        })
            .then(result => result.isNew && source.confirmations >= this.minimumConfirmations
            ? this.transactionService.onConfirm(result.transaction)
            : Promise.resolve(result.transaction))
            .catch(error => {
            console.error('Error saving transaction', error, source);
            return undefined;
        });
    }
    saveNewTransactions(transactions) {
        return BlueBirdPromise.each(transactions, (transaction) => this.saveNewTransaction(transaction));
    }
    confirmExistingTransaction(transaction) {
        transaction.status = types_1.TransactionStatus.accepted;
        return this.transactionService.setStatus(transaction, types_1.TransactionStatus.accepted)
            .then(newTransaction => {
            return this.transactionService.onConfirm(transaction);
        });
    }
    updatePendingTransaction(transaction) {
        return this.bitcoinClient.getTransaction(transaction.txid)
            .then(source => (source.confirmations >= this.minimumConfirmations
            ? this.confirmExistingTransaction(transaction)
            : Promise.resolve(undefined)));
    }
    gatherNewTransactions() {
        return this.transactionService.getLastBlock()
            .then(lastBlock => this.bitcoinClient.getHistory(lastBlock)
            .then(blocklist => (blocklist.transactions.length == 0
            ? Promise.resolve()
            : this.saveNewTransactions(blocklist.transactions))
            .then(() => blocklist.lastBlock
            ? this.transactionService.setLastBlock(blocklist.lastBlock)
            : Promise.resolve())));
    }
    updatePendingTransactions() {
        return this.transactionService.listPending()
            .then(transactions => BlueBirdPromise.each(transactions, (t) => this.updatePendingTransaction(t)
            .catch(e => console.error('Bitcoin Transaction Pending Error', e, t))));
    }
    update() {
        return this.updatePendingTransactions()
            .then(() => this.gatherNewTransactions());
    }
}
exports.TransactionMonitor = TransactionMonitor;
//# sourceMappingURL=transaction-monitor.js.map