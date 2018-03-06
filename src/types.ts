import {BigNumber} from 'bignumber.js'

export interface AddressSource {
  createAddress(): Promise<string>
}

export enum TransactionStatus {
  pending,
  accepted,
  rejected,
}

export interface NewTransaction {
  address: string
  index: number
  txid: string
  status: TransactionStatus
  amount: number
  timeReceived: any
}

export interface Block {
  tx: BitcoinTransactionSource[]
  hash: string
  height: number 
  time: number
}

export interface BlockService {
  getLastBlock():Promise<string>
  setLastBlock(value:string):Promise<void>
}

export interface BasicTransaction {
  txid:string
  status: TransactionStatus
  index: number
  address: string
  satoshis: number
  timeReceived: any
}

export interface AddTransactionResult<Transaction extends BasicTransaction> {
  transaction:Transaction
  isNew:boolean
}

export interface TransactionService<Transaction extends BasicTransaction> extends BlockService {
  add(transaction: NewTransaction): Promise<AddTransactionResult<Transaction>>
  onConfirm(transaction: Transaction): Promise<Transaction>
  setStatus(transaction: Transaction, status:TransactionStatus): Promise<Transaction>
  listPending(): Promise<Transaction []>
}

export interface TransactionDetails {
  address: string
  txid: string
  amount: BigNumber
  category: string
}

export interface BitcoinTransactionSource {
  index: number
  confirmations: number
  address: string
  txid: string
  time: number
  amount: number
  details: TransactionDetails[]
  timereceived: number
  blockindex: string
}