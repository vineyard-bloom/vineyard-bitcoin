import {Model, Transaction, TransactionStatus} from "../model"
import {TransactionService, NewTransaction} from "./transaction-service"
import {CurrencyConverter} from "../logic/types";
import {satoshisToBitcoin} from "../logic/conversions";

export class TransactionServiceImplementation implements TransactionService {
    model: Model;
    currencyConverter: CurrencyConverter;

    constructor(model: Model, currencyConverter: CurrencyConverter) {
        this.model = model;
        this.currencyConverter = currencyConverter;
    }

    add(transaction: NewTransaction): Promise<Transaction> {
        return this.model.Account.first_or_null({bitcoinAddress: transaction.address})
            .then(account => {
                if (!account) {
                    throw new Error("No account with a bitcoinAddress of '" + transaction.address + "'")
                }
                else {
                    return this.model.Transaction.first_or_null({txid: transaction.txid})
                        .then(existing => {
                            if (existing)
                                return Promise.resolve(existing);

                            const usd = this.currencyConverter.btc_to_usd(satoshisToBitcoin(transaction.amount));
                            const salt = this.currencyConverter.usd_to_salt(usd);
                            const timeReceived = new Date(transaction.timeReceived * 1000);

                            return this.model.Transaction.create({
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
                                .then(t=> t)

                        })
                }
        })
    }

    setStatus(transaction: Transaction, status: TransactionStatus): Promise<Transaction> {
        return this.model.Transaction.update(transaction, {
            status: status
        })
    }

    onConfirm(transaction: Transaction): Promise<Transaction> {
        const sql = `
UPDATE accounts
SET salt = salt + :amount
WHERE id = :id
`;
        const id = typeof transaction.account == 'string'
            ? transaction.account
            : transaction.account.id;

        return this.model.db.query(sql, {
            replacements: {
                amount: transaction.salt,
                id: id
            }
        })
    }

    getLastBlock(): Promise<string> {
        return this.model.Bitcoin.first_or_null()
            .then(record => record ? record.lastblock : '')
    }

    listPending(): Promise<Transaction[]> {
        return this.model.Transaction.filter({
            status: TransactionStatus.pending
        }).exec()
    }

    setLastBlock(value: string): Promise<void> {
        return this.model.Bitcoin.first_or_null()
            .then(record => record
                ? this.model.Bitcoin.update(record, {lastblock: value})
                : this.model.Bitcoin.create({lastblock: value}))
    }
}