import { BitcoinRpcClient, BitcoinTransactionSource, Block, RawTransaction } from "./types";
import { blockchain } from 'vineyard-blockchain'

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

export async function getMultiTransactions(client: any, transactions: string[], blockIndex: number): Promise<blockchain.MultiTransaction[]> {
  // let fullTransactions: blockchain.MultiTransaction[] = []
  // for (let transaction of transactions) {
  //
  //   // let result = await getTransaction(client, transaction)
  //   // if (result) {
  //   //   const receiveDetail = result.details.find(detail => detail.category === 'receive')
  //   //   if (receiveDetail) {
  //   //     fullTransactions.push({
  //   //       txid: result.txid,
  //   //       to: receiveDetail.address,
  //   //       from: "",
  //   //       amount: new BigNumber(receiveDetail.amount).abs(),
  //   //       timeReceived: new Date(result.timereceived * 1000),
  //   //       block: Number(result.blockindex),
  //   //       status: TransactionStatus.pending,
  //   //       confirmations: result.confirmations
  //   //     })
  //   //   }
  //   // }
  // }
  // return fullTransactions
  return Promise.all(transactions.map(async (t) => {
    console.log('t', t)
    const raw = await client.getRawTransaction(t, true)
    return {
      txid: raw.txid,
        timeReceived: new Date(raw.blocktime * 1000),
      status: undefined,
      fee: 0,
      nonce: undefined,
      blockIndex: blockIndex,
      inputs: [],
      outputs: [],
      original: raw
    }
  }))
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