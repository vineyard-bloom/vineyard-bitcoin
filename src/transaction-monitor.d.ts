import { BitcoinClient } from './bitcoin-client';
import { BasicTransaction, TransactionService } from "./types";
export declare type TransactionDelegate<Transaction extends BasicTransaction> = (transaction: Transaction) => Promise<Transaction>;
export declare class TransactionMonitor<Transaction extends BasicTransaction> {
    private bitcoinClient;
    private transactionService;
    private minimumConfirmations;
    constructor(bitcoinClient: BitcoinClient, transactionService: TransactionService<Transaction>);
    private convertStatus(source);
    private saveNewTransaction(source);
    private saveNewTransactions(transactions);
    private confirmExistingTransaction(transaction);
    private updatePendingTransaction(transaction);
    gatherNewTransactions(): Promise<any>;
    updatePendingTransactions(): Promise<any>;
    update(): Promise<any>;
}
