import { AsyncBitcoinRpcClient, BitcoinRPCBlock, Omit, RawRPCDeserializedTransaction, TxId } from "./types";
import { BigNumber } from "bignumber.js"
import { blockchain } from "vineyard-blockchain"
import TransactionOutput = blockchain.TransactionOutput
import { isNullOrUndefined } from "util"

export const liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'

// export function getBlockCount(client: BitcoinRpcClient): Promise<number> {
//   return promisify(client.getBlockCount.bind(client))()
// }
//
// export function getBlockHash(client: BitcoinRpcClient, index: number): Promise<string> {
//   return promisify(client.getBlockHash.bind(client))(index)
// }
//
// export async function getBlockByHash(client: BitcoinRpcClient, hash: string): Promise<Block> {
//   return await promisify(client.getBlockHash.bind(client))(hash)
// }

export async function getBlockByIndex(client: AsyncBitcoinRpcClient, index: number): Promise<BitcoinRPCBlock> {
  const hash = await client.getBlockHash(index)
  return client.getBlock(hash)
}

// export function getTransaction(client: BitcoinRpcClient, txid: string): Promise<BitcoinTransactionSource> {
//   return promisify(client.getTransaction.bind(client))(txid)
// }

// export function getRawTransaction(client: BitcoinRpcClient, txid: string): Promise<RawTransaction> {
//   return promisify(client.getRawTransaction.bind(client))(txid)
// }

// function convertInput(input: any): blockchain.TransactionInput {
//   return {
//
//   }
// }
//
// function convertOutput(output: any): blockchain.TransactionOutput {
//   return {
//
//   }
// }

export async function getMultiTransactions(client: AsyncBitcoinRpcClient, transactionIds: TxId[], blockIndex: number): Promise<blockchain.MultiTransaction[]> {
  return Promise.all(transactionIds
    .filter(txid => txid !== liveGenesisTxid)
    .map(txid => getMultiTransaction(client, txid).then( tx => { return {...tx, blockIndex }} ).catch(e => {
      throw new Error(`Unable to acquire full multi transaction for ${txid}: ${e}`)
    })))
}

// TODO: Consider the fee below, can we compute this?
export async function getMultiTransaction(client: AsyncBitcoinRpcClient, txid: TxId): Promise<Omit<blockchain.MultiTransaction, 'blockIndex'>>{
  const raw = await client.getRawTransaction(txid, true) as RawRPCDeserializedTransaction

  return {
    txid: raw.txid,
    timeReceived: new Date(raw.blocktime * 1000),
    status: blockchain.TransactionStatus.unknown,
    fee: new BigNumber(0),
    nonce: 0,
    inputs: raw.vin,
    outputs: raw.vout.filter(notOpReturn).map(ensureValueInSatoshis)
  }
}

const notOpReturn = (out: TransactionOutput) => out.scriptPubKey.type !== 'nulldata'
const ensureValueInSatoshis: (out: TransactionOutput) => TransactionOutput = (out) => {
  const valueSat = isNullOrUndefined(out.valueSat) ? new BigNumber(out.value).times(10e8) : new BigNumber(out.valueSat)
  return { ...out, valueSat }
}

export function bitcoinToBlockchainBlock(block: BitcoinRPCBlock): blockchain.Block {
  return {
    hash: block.hash,
    index: block.height,
    timeMined: new Date(block.time),
  }
}

export async function getMultiTransactionBlock(client: AsyncBitcoinRpcClient, index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>> {
  const fullBlock: BitcoinRPCBlock = await getBlockByIndex(client, index)
  let transactions = await getMultiTransactions(client, fullBlock.tx, index)
  return  {
    hash: fullBlock.hash,
    index: fullBlock.height,
    timeMined: new Date(fullBlock.time * 1000),
    transactions: transactions
  }
}