
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

export interface TransactionOutput {
  address: string
}

export interface TransactionSource {
  index: number
  confirmations: number
  address: string
  status: string
  txid: string
  time: number
  amount: number
  outputs: TransactionOutput []
}