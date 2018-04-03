import { BitcoinRpcClient, Block } from "./types";
import { blockchain } from 'vineyard-blockchain'
import { BigNumber } from "bignumber.js"

export const liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'

const { promisify } = require('util')

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

export async function getBlockByIndex(client: any, index: number): Promise<Block> {
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

export async function getMultiTransactions(client: any, transactions: string[], blockIndex: number): Promise<blockchain.MultiTransaction[]> {
  const promises = transactions
    .filter(t => t !== liveGenesisTxid)
    .map(async (t) => {
      console.log('t', t)
      const raw = await client.getRawTransaction(t, true)
      return {
        txid: raw.txid,
        timeReceived: new Date(raw.blocktime * 1000),
        status: blockchain.TransactionStatus.unknown,
        fee: new BigNumber(0),
        nonce: 0,
        blockIndex: blockIndex,
        inputs: raw.vin,
        outputs: raw.vout,
        original: raw
      }
    })
  return Promise.all(promises)
}

export function bitcoinToBlockchainBlock(block: Block): blockchain.Block {
  return {
    hash: block.hash,
    index: block.height,
    timeMined: new Date(block.time),
  }
}

export async function getMultiTransactionBlock(client: BitcoinRpcClient, index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined> {
  const fullBlock: Block = await getBlockByIndex(client, index)
  let transactions = await getMultiTransactions(client, fullBlock.tx as any, index)
  let newFullBlock = {
    hash: fullBlock.hash,
    index: fullBlock.height,
    timeMined: new Date(fullBlock.time * 1000),
    transactions: transactions
  }
  return newFullBlock
}