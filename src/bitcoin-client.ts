const bitcoin = require('bitcoin')
import {BitcoinTransactionSource, Block, TransactionDetails} from "./types";
import {ExternalSingleTransaction as ExternalTransaction, FullBlock, BlockInfo, Resolve, BaseBlock, TransactionStatus, SingleTransaction as Transaction} from "vineyard-blockchain";
const BigNumber = require("bignumber.js")

export interface BitcoinConfig {
  port?: number
  user: string
  pass: string
  timeout?: number
  host?: string
}

export interface BlockList {
  transactions: BitcoinTransactionSource[]
  lastBlock: string
}

export class BitcoinClient {
  private client: any

  constructor(bitcoinConfig: BitcoinConfig) {
    this.client = new bitcoin.Client(bitcoinConfig)
  }

  getClient() {
    return this.client
  }

  async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    const transaction: BitcoinTransactionSource = await this.getTransaction(txid) 
      if(transaction.confirmations == -1) return TransactionStatus.rejected
      if(transaction.confirmations == 0 ) return TransactionStatus.pending 
      else {
        return TransactionStatus.accepted 
      }
  }

  async getLastBlock(): Promise<BaseBlock> {
    const blockHeight: number = await this.getBlockCount()
    const blockHash: string = await this.getBlockHash(blockHeight)
    const lastBlock: Block = await this.getBlock(blockHash)
        return {
                hash: lastBlock.hash,
                index: lastBlock.height,
                timeMined: new Date(lastBlock.time),
                currency: 'BTC00000-0000-0000-0000-000000000000'
            }
  }

  getBlockHash(blockHeight: number): Promise<string> {
    return new Promise((resolve: Resolve<string>, reject) => {
      this.client.getBlockHash(blockHeight, (err: any, blockHash: string) => {
          resolve(blockHash)
        })
     })
  }

  getBlockCount(): Promise<number> {
    return new Promise((resolve: Resolve<number>, reject) => {
      this.client.getBlockCount((err: any, blockCount: number) => {
        if(err) {
          reject(err)
        } else {
          resolve(blockCount)
        }
      })
    })
  }

  async getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BaseBlock | undefined> {
    const nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0  
    const blockHash: string = await this.getBlockHash(nextBlockIndex)
      if(!blockHash) {return}
    const nextBlock: Block = await this.getBlock(blockHash)
      return {
        hash: nextBlock.hash,
        index: nextBlock.height,
        timeMined: new Date(nextBlock.time),
        currency: 'BTC00000-0000-0000-0000-000000000000'
      }
   }
 
  async getFullBlock(block: BlockInfo): Promise<FullBlock<ExternalTransaction>> {
    const fullBlock: Block = await this.getBlock(block.hash)
    let fullTransactions = await this.getFullTransactions(fullBlock.tx)
        let newFullBlock = {
              hash: fullBlock.hash,
              index: fullBlock.height,
              timeMined: new Date(fullBlock.time),
              transactions: fullTransactions
          }
        return newFullBlock 
  }

  async getFullTransactions(transactions: BitcoinTransactionSource[]): Promise<ExternalTransaction[]> {
      let fullTransactions: ExternalTransaction[] = []
       for (let transaction of transactions) {
       let result =  await this.getTransaction(transaction.txid)
          if(!result) return fullTransactions
          for(let detail of result.details) {
            fullTransactions.push({
              txid: result.txid,
              to: detail.address,
              from: "",
              amount: new BigNumber(detail.amount).abs(),
              timeReceived: new Date(result.timereceived),
              block: result.blockindex,
              status: TransactionStatus.pending,
              confirmations: result.confirmations
            }) 
          }
       }
       return fullTransactions
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

  getBlock(blockhash: string): Promise<Block> {
    return new Promise((resolve: Resolve<Block>, reject) => {
      this.client.getBlock(blockhash, 2, (err: any, block: Block) => {
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
