import { blockchain } from "vineyard-blockchain/src/blockchain"
import { AsyncBitcoinRpcClient, BitcoinConfig, BitcoinRPCBlock, BitcoinTransactionSource } from "./types";
import {
  BaseBlock,
  ExternalSingleTransaction as ExternalTransaction,
  FullBlock,
  ReadClient,
  Resolve
} from "vineyard-blockchain";
import { addressFromOutScriptHex, getMultiTransactions } from "./client-functions"
import { Network, networks } from "bitcoinjs-lib"
import { isNullOrUndefined } from "util"

const Client = require('bitcoin-core')
const bitcoin = require('bitcoin')
import TransactionOutput = blockchain.TransactionOutput

export interface BlockList {
  transactions: BitcoinTransactionSource[]
  lastBlock: string
}

export class BitcoinClient implements ReadClient<ExternalTransaction> {
  private readonly client: any
  private readonly asyncClient: AsyncBitcoinRpcClient
  private readonly network: Network

  constructor(bitcoinConfig: BitcoinConfig) {
    const { network, ...callbackConfig } = bitcoinConfig
    this.client = new bitcoin.Client(callbackConfig)

    const { user: username, pass: password, ...asyncConfig } = callbackConfig
    this.asyncClient = new Client({ username, password, ...asyncConfig })

    this.network = network || networks.bitcoin
  }

  getClient() {
    return this.client
  }

  getAsyncClient(): AsyncBitcoinRpcClient {
    return this.asyncClient
  }

  async getTransactionStatus(txid: string): Promise<blockchain.TransactionStatus> {
    const transaction: BitcoinTransactionSource = await this.getTransaction(txid)
    if (transaction.confirmations == -1) return blockchain.TransactionStatus.rejected
    if (transaction.confirmations == 0) return blockchain.TransactionStatus.pending
    else {
      return blockchain.TransactionStatus.accepted
    }
  }

  async getLastBlock(): Promise<BaseBlock> {
    const blockHeight: number = await this.getBlockCount()
    const blockHash: string = await this.getBlockHash(blockHeight)
    const lastBlock: BitcoinRPCBlock = await this.getBlock(blockHash)
    return {
      hash: lastBlock.hash,
      index: lastBlock.height,
      timeMined: new Date(lastBlock.time * 1000)
    }
  }

  getBlockHash(blockHeight: number): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.getBlockHash(blockHeight, (err: any, blockHash: string) => {
        resolve(blockHash)
      })
    })
  }

  getBlockIndex(): Promise<number> {
    return new Promise((resolve: Resolve<number>, reject) => {
      this.client.getBlockCount((err: any, blockCount: number) => {
        if (err) {
          reject(err)
        } else {
          resolve(blockCount)
        }
      })
    })
  }

  getBlockCount(): Promise<number> {
    return new Promise((resolve: Resolve<number>, reject) => {
      this.client.getBlockCount((err: any, blockCount: number) => {
        if (err) {
          reject(err)
        } else {
          resolve(blockCount)
        }
      })
    })
  }

  async getNextBlockInfo(blockIndex: number | undefined): Promise<BaseBlock | undefined> {
    const nextBlockIndex = isNullOrUndefined(blockIndex) ? 0 : blockIndex + 1
    const blockHash: string = await this.getBlockHash(nextBlockIndex)
    if (!blockHash)
      return

    const nextBlock: BitcoinRPCBlock = await this.getBlock(blockHash)
    return {
      hash: nextBlock.hash,
      index: nextBlock.height,
      timeMined: new Date(nextBlock.time * 1000)
    }
  }

  async getFullBlock(blockindex: number): Promise<FullBlock<ExternalTransaction> | undefined> {
    const blockHash = await this.asyncClient.getBlockHash(blockindex)
    if (!blockHash) {
      console.warn(`Queried for blockhash for block index ${blockindex} but got none.`)
      return undefined
    }

    const fullBlock: BitcoinRPCBlock = await this.asyncClient.getBlock(blockHash)
    let fullTransactions = await this.getFullTransactions(fullBlock.tx, blockindex)
    return {
      hash: fullBlock.hash,
      index: fullBlock.height,
      timeMined: new Date(fullBlock.time * 1000),
      transactions: fullTransactions
    }
  }

  private async getFullTransactions(txids: string[], blockIndex: number): Promise<ExternalTransaction[]> {
    const singleTxs = [] as ExternalTransaction[]
    const multiTxs = await getMultiTransactions(this.asyncClient, txids, blockIndex, this.network)

    multiTxs.forEach( mtx => {
      const { txid, outputs, status, timeReceived } = mtx

      outputs.forEach( (output: TransactionOutput) => {
        const { scriptPubKey, valueSat, address } = output
        singleTxs.push(
          {
            txid,
            timeReceived,
            to: address,
            from: "",
            amount: valueSat,
            blockIndex,
            status
          }
        )
      })
    })

    return singleTxs
  }

  getHistory(lastBlock: string): Promise<BlockList> {
    return new Promise((resolve: Resolve<BlockList>, reject) => {
      this.client.listSinceBlock(lastBlock || "", 1, true, (err: any, info: any) => {
        if (err)
          reject(err);
        else {
          // const transactions = info.transactions
          // const lastTransaction = transactions[transactions.length - 1]

          resolve({
            transactions: info.transactions.filter((t: any) => t.category == 'receive'),
            lastBlock: info.lastblock //lastTransaction ? lastTransaction.blockhash : null
          })
        }
      })
    })
  }

  listTransactions(): Promise<BitcoinTransactionSource[]> {
    return new Promise((resolve: Resolve<BitcoinTransactionSource[]>, reject) => {
      this.client.listTransactions('', 100, 0, true, (err: any, transactions: BitcoinTransactionSource[]) => {
        if (err)
          reject(err);
        else
          resolve(transactions)
      })
    })
  }

  getTransaction(txid: string): Promise<BitcoinTransactionSource> {
    return new Promise((resolve: Resolve<BitcoinTransactionSource>, reject) => {
      this.client.getTransaction(txid, true, (err: any, transaction: BitcoinTransactionSource) => {
        resolve(transaction)
      })
    })
  }

  getBlock(blockhash: string): Promise<BitcoinRPCBlock> {
    return new Promise((resolve: Resolve<BitcoinRPCBlock>, reject) => {
      this.client.getBlock(blockhash, (err: any, block: BitcoinRPCBlock) => {
        if (err)
          reject(err)
        else
          resolve(block)
      })
    })
  }

  importAddress(address: string, rescan: boolean = false): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.importAddress(address, "", rescan, (err: any, result: any) => {
        if (err)
          reject(err)
        else
          resolve(address);
      })
    })
  }

  getInfo(): Promise<any> {
    return new Promise((resolve: Resolve<any>, reject) => {
      this.client.getInfo((err: any, info: any) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  listAddresses(): Promise<string[][]> {
    return new Promise((resolve: Resolve<string[][]>, reject) => {
      this.client.listAddressGroupings((err: any, info: string[][]) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  createAddress(): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.getNewAddress((err: any, newAddress: string) => {
        if (err)
          reject(err)
        else
          resolve(newAddress);
      })
    })
  }

  createTestAddress(): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.getNewAddress((err: any, newAddress: string) => {
        if (err)
          reject(err);
        else
          return resolve(newAddress);
      })
    })
  }

  generate(amount: number): Promise<number> {
    return new Promise((resolve: Resolve<number>, reject) => {
      this.client.generate(amount, (err: any, amount: number) => {
        if (err)
          reject(err);
        resolve(amount);
      });
    })
  }

  send(amount: number, address: any): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.sendToAddress(address, amount, (err: any, txid: string) => {
        if (err)
          reject(err);
        resolve(txid);
      })
    })
  }
}