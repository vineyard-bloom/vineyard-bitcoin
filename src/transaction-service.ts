import {Transaction, TransactionStatus} from "../model"

export interface NewTransaction {
    address: string
    index: number
    txid: string
    status: TransactionStatus
    amount: number
    timeReceived
}

export interface TransactionService {
    add(transaction: NewTransaction): Promise<Transaction>
    onConfirm(transaction: Transaction): Promise<Transaction>
    setStatus(transaction: Transaction, status:TransactionStatus): Promise<Transaction>
    getLastBlock():Promise<string>
    listPending(): Promise<Transaction []>
    setLastBlock(value:string):Promise<void>
}
