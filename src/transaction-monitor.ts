import {BitcoinClient, TransactionSource} from './bitcoinrpc-client'
import {TransactionService} from "./transaction-service";
import {Cron} from "../utility/cron";
import {Transaction, TransactionStatus} from "../model";
import {Collection} from "vineyard-ground";
import * as BlueBirdPromise from 'bluebird'
import {bitcoinToSatoshis} from "../logic/conversions";

export type TransactionDelegate = (transaction: Transaction) => Promise<Transaction>

export class TransactionMonitor {
    private bitcoinClient;
    private transactionService: TransactionService;
    private minimumConfirmations: number = 2;

    constructor(bitcoinClient: BitcoinClient, transactionService: TransactionService) {
        this.transactionService = transactionService;
        this.bitcoinClient = new BitcoinClient();
    }

    private convertStatus(source: TransactionSource) {
        return source.confirmations >= this.minimumConfirmations
            ? TransactionStatus.accepted
            : TransactionStatus.pending
    }

    private saveNewTransaction(source: TransactionSource) {
        let promise = this.transactionService.add({
            index: source.index,
            address: source.address,
            status: this.convertStatus(source),
            amount: bitcoinToSatoshis(source.amount),
            timeReceived: source.time,
            txid: source.txid
        });
        if (source.confirmations >= this.minimumConfirmations)
            promise = promise.then(transaction => this.transactionService.onConfirm(transaction))

        return promise
            .catch(error => console.error('Error saving transaction', error))
    }

    private saveNewTransactions(transactions: TransactionSource []): Promise<any> {
        return BlueBirdPromise.each(transactions, transaction => this.saveNewTransaction(transaction))
    }

    private gatherNewTransactions(): Promise<any> {
        return this.transactionService.getLastBlock()
            .then(lastBlock => this.bitcoinClient.getHistory(lastBlock)
                .then(transactions => transactions.length == 0
                    ? Promise.resolve()
                    : this.saveNewTransactions(transactions)
                        .then(() => this.transactionService.setLastBlock(transactions[transactions.length - 1].blockhash)))
            )
    }

    private confirmExistingTransaction(transaction: Transaction): Promise<Transaction> {
        return this.transactionService.setStatus(transaction, TransactionStatus.accepted)
            .then(transaction => this.transactionService.onConfirm(transaction))
    }

    private updatePendingTransaction(transaction: Transaction): Promise<any> {
        return this.bitcoinClient.getTransaction(transaction.txid)
            .then(source => source.confirmations >= this.minimumConfirmations
                ? this.confirmExistingTransaction(transaction)
                : Promise.resolve())
    }

    private updatePendingTransactions(): Promise<any> {
        return this.transactionService.listPending()
            .then(transactions => BlueBirdPromise.each(transactions, t => this.updatePendingTransaction(t)
                )
            )
    }

    update(): Promise<any> {
        return this.updatePendingTransactions()
            .then(() => this.gatherNewTransactions())
    }
}

export class TransactionMonitorCron {
    monitor: TransactionMonitor;
    private cron: Cron;

    constructor(monitor: TransactionMonitor, interval?: number) {
        this.monitor = monitor;
        this.cron = new Cron(() => monitor.update(), "Transaction Monitor", interval)
    }

    start() {
        this.cron.start()
    }

    stop() {
        this.cron.stop()
    }
}
