import {BitcoinClient} from './bitcoin-client'
import * as BlueBirdPromise from 'bluebird'
import {bitcoinToSatoshis} from "./conversions";
import {BasicTransaction, TransactionService, TransactionSource, TransactionStatus} from "./types";

export type TransactionDelegate<Transaction extends BasicTransaction> =
  (transaction: Transaction) => Promise<Transaction>

export class TransactionMonitor<Transaction extends BasicTransaction> {
  private bitcoinClient;
  private transactionService: TransactionService<Transaction>;
  private minimumConfirmations: number = 2;

  constructor(bitcoinClient: BitcoinClient, transactionService: TransactionService<Transaction>) {
    this.transactionService = transactionService;
    this.bitcoinClient = bitcoinClient;
  }

  private convertStatus(source: TransactionSource) {
    return source.confirmations >= this.minimumConfirmations
      ? TransactionStatus.accepted
      : TransactionStatus.pending
  }

  private saveNewTransaction(source: TransactionSource): Promise<Transaction> {
    return this.transactionService.add({
      index: source.index,
      address: source.address,
      status: this.convertStatus(source),
      amount: bitcoinToSatoshis(source.amount),
      timeReceived: source.time,
      txid: source.txid
    })
      .then(transaction => source.confirmations >= this.minimumConfirmations && !transaction.status
        ? this.transactionService.onConfirm(transaction)
        : Promise.resolve(transaction)
      )
      .catch(error => console.error('Error saving transaction', error))
  }

  private saveNewTransactions(transactions: TransactionSource []): Promise<any> {
    return BlueBirdPromise.each(transactions, transaction => this.saveNewTransaction(transaction))
  }

  private gatherNewTransactions(): Promise<any> {
    return this.transactionService.getLastBlock()
      .then(lastBlock => this.bitcoinClient.getHistory(lastBlock)
        .then(blocklist => (blocklist.transactions.length == 0
            ? Promise.resolve()
            : this.saveNewTransactions(blocklist.transactions)
        )
          .then(() => blocklist.lastBlock
            ? this.transactionService.setLastBlock(blocklist.lastBlock)
            : Promise.resolve()
          ))
      )
  }

  private confirmExistingTransaction(transaction: Transaction): Promise<Transaction> {
    transaction.status = TransactionStatus.accepted
    return this.transactionService.setStatus(transaction, TransactionStatus.accepted)
      .then(newTransaction => {
        return this.transactionService.onConfirm(transaction)
      })
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