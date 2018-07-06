import { BigNumber } from 'bignumber.js'
import { blockchain } from "vineyard-blockchain/src/blockchain"
import TransactionInput = blockchain.TransactionInput
import TransactionOutput = blockchain.TransactionOutput
import { Network } from "bitcoinjs-lib"

export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };

export enum TransactionStatus {
  pending,
  accepted,
  rejected,
}

export type TxId = string
export interface BitcoinRPCBlock {
  tx: TxId[]
  hash: string
  height: number
  time: number //in epoch ms
}

export interface BasicTransaction {
  txid: TxId
  status: TransactionStatus
  index: number
  address: string
  satoshis: number
  timeReceived: any
}

export type RawRPCSerializedTransaction = string
export interface RawRPCDeserializedTransaction {
  txid: TxId,
  blocktime: number,
  vin: TransactionInput[],
  vout: TransactionOutput[],
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

export interface BitcoinConfig {
  port?: number
  user: string
  pass: string
  timeout?: number
  host?: string
  network?: Network
  transactionChunkSize?: number
}

export interface BitcoinConfig2 {
  port?: number
  username: string
  password: string
  timeout?: number
  host?: string
  network?: Network
  transactionChunkSize?: number
}

export interface AsyncBitcoinRpcClient {
  getBlockCount(): Promise<number>
  getBlockHash(index: number): Promise<string>
  getBlock(hash: string): Promise<BitcoinRPCBlock>
  getTransaction(txid: string): Promise<BasicTransaction>
  getRawTransaction(txid: string, returnDeserialized?: boolean): Promise<RawRPCSerializedTransaction | RawRPCDeserializedTransaction>
  getBlockchainInfo(): Promise<object>
  getNewAddress(): Promise<object>
  generate(qty: number): Promise<object>
  getBlockCount(): Promise<number>
}

export const Defaults = {
  TRANSACTION_CHUNK_SIZE: 10
}
