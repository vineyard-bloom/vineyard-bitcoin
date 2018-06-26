import {BitcoinClient} from './bitcoin-client'

const BlueBirdPromise = require('bluebird')
import {bitcoinToSatoshis} from "./conversions";
import {BasicTransaction, TransactionService, BitcoinTransactionSource, TransactionStatus} from "./types";

export type TransactionDelegate<Transaction extends BasicTransaction> =
  (transaction: Transaction) => Promise<Transaction>

export class TransactionMonitor<Transaction extends BasicTransaction> {
  private bitcoinClient: BitcoinClient
  private transactionService: TransactionService<Transaction>;
  private minimumConfirmations: number = 2;

  constructor(bitcoinClient: BitcoinClient, transactionService: TransactionService<Transaction>) {
    this.transactionService = transactionService;
    this.bitcoinClient = bitcoinClient;
  }

  private convertStatus(source: BitcoinTransactionSource) {
    return source.confirmations >= this.minimumConfirmations
      ? TransactionStatus.accepted
      : TransactionStatus.pending
  }

  private saveNewTransaction(source: BitcoinTransactionSource): Promise<Transaction | undefined> {
    return this.transactionService.add({
      index: source.index,
      address: source.address,
      status: this.convertStatus(source),
      amount: bitcoinToSatoshis(source.amount),
      timeReceived: source.time,
      txid: source.txid
    })
      .then(result => result.isNew && source.confirmations >= this.minimumConfirmations
        ? this.transactionService.onConfirm(result.transaction)
        : Promise.resolve(result.transaction)
      )
      .catch(error => {
        console.error('Error saving transaction', error, source)
        return undefined
      })
  }

  private saveNewTransactions(transactions: BitcoinTransactionSource []): Promise<any> {
    return BlueBirdPromise.each(transactions, (transaction: BitcoinTransactionSource) => this.saveNewTransaction(transaction))
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
      .then(source => (source.confirmations >= this.minimumConfirmations
        ? this.confirmExistingTransaction(transaction)
        : Promise.resolve(undefined)) as Promise<Transaction | undefined>)
  }

  gatherNewTransactions(): Promise<any> {
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

  updatePendingTransactions(): Promise<any> {
    return this.transactionService.listPending()
      .then(transactions => BlueBirdPromise.each(transactions,
        (t: Transaction) => this.updatePendingTransaction(t)
          .catch(e => console.error('Bitcoin Transaction Pending Error', e, t)
          )
        )
      )
  }

  update(): Promise<any> {
    return this.updatePendingTransactions()
      .then(() => this.gatherNewTransactions())
  }
}