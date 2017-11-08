const bitcoin = require('bitcoin')
import {BitcoinTransactionSource, Block, TransactionDetails} from "./types";
import {ExternalTransaction, FullBlock, BlockInfo, Resolve, BaseBlock, TransactionStatus} from "vineyard-blockchain";

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

  getTransactionStatus(txid: string): Promise<TransactionStatus> {
    return this.getTransaction(txid).then((transaction: BitcoinTransactionSource) => {
      if(transaction.confirmations == -1) return TransactionStatus.rejected
      if(transaction.confirmations == 0 ) return TransactionStatus.pending 
      else {
        return TransactionStatus.accepted 
      }
    })
  }

  getLastBlock(): Promise<BaseBlock> {
    return new Promise((resolve: (value: PromiseLike<BaseBlock>|BaseBlock|undefined) => void, reject) => {
      return this.getBlockCount().then(blockHeight => {
        return this.getBlockHash(blockHeight).then(blockHash => {
          this.client.getBlock(String(blockHash), (err: any, lastBlock: Block) => {
            if(err) {
              reject(err)
            } else {
              let newLastBlock: BaseBlock = {
                hash: lastBlock.hash,
                index: lastBlock.height,
                timeMined: new Date(lastBlock.time),
                currency: 'BTC00000-0000-0000-0000-000000000000'
              }
              resolve(newLastBlock)
            }
          })
        })
      })
    })
  }

  getBlockHash(blockHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getBlockHash(blockHeight, (err: any, blockHash: string) => {
        if(err) {
          reject(err)
        } else {
          resolve(blockHash)
        }
      })
    })
  }

  getBlockCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.getBlockCount((err: any, blockCount: number) => {
        if(err) {
          reject(err)
        } else {
          resolve(blockCount)
        }
      })
    })
  }

  getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BlockInfo> {
    const nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0  
    return new Promise((resolve: any, reject: any) => {
        return this.getBlockHash(nextBlockIndex).then(blockHash => {
          this.client.getBlock(String(blockHash), (err: any, nextBlock: Block) => {
            if(err) {
              reject(err)
            } else {
              let newNextBlock = {
                hash: nextBlock.hash,
                index: nextBlock.height,
                timeMined: nextBlock.time
              }
              resolve(newNextBlock)
            }
          })
        })
    })
   }
 
  getFullBlock(block: BlockInfo): Promise<FullBlock> {
    return new Promise((resolve: any, reject: any) => {
        this.client.getBlock(String(block.hash), 2, (err: any, fullBlock: Block) => {
          if(err) {
            reject(err)
          } else {
            let fullTransactions = this.getFullTransactions(fullBlock.tx)
            let newFullBlock = {
              hash: fullBlock.hash,
              index: fullBlock.height,
              timeMined: fullBlock.time,
              transactions: fullTransactions
            }
            resolve(newFullBlock)
          }
        })
    })
  }

  async getFullTransactions(transactions: BitcoinTransactionSource[]): Promise<ExternalTransaction[]> {
      let fullTransactions: ExternalTransaction[] = []
       for (let transaction of transactions) {
       let result =  await this.getTransaction(transaction.txid)
          for(let detail of result.details) {
            fullTransactions.push({
              txid: detail.txid,
              to: detail.address,
              from: "",
              amount: detail.amount,
              timeReceived: new Date (transaction.timereceived),
              block: transaction.blockindex,
              status: TransactionStatus.pending,
              confirmations: transaction.confirmations
            }) 
          }
       }
       return fullTransactions
  }
 

  getHistory(lastBlock: string): Promise<BlockList> {
    return new Promise((resolve, reject) => {
      this.client.listSinceBlock(lastBlock || "", 1, true, (err: any, info: any) => {
        if (err)
          reject(new Error(err));
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

  listTransactions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.listTransactions('', 100, 0, true, (err: any, transactions: any) => {
        if (err)
          reject(new Error(err));
        else
          resolve(transactions)
      })
    })
  }

  getTransaction(txid: string): Promise<BitcoinTransactionSource> {
    return new Promise((resolve, reject) => {
      this.client.getTransaction(txid, true, (err: any, transaction: any) => {
        if (err)
          reject(err)
        else
          resolve(transaction)
      })
    })
  }

  importAddress(address: string, rescan: boolean = false) {
    return new Promise((resolve, reject) => {
      this.client.importAddress(address, "", rescan, (err: any, result: any) => {
        if (err)
          reject(err)
        else
          resolve(address);
      })
    })
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      this.client.getInfo((err: any, info: any) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  listAddresses() {
    return new Promise((resolve, reject) => {
      this.client.listAddressGroupings((err: any, info: any) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  createAddress() {
    return new Promise((resolve, reject) => {
      this.client.getNewAddress((err: any, newAddress: string) => {
        if (err)
          reject(err)
        else
          resolve(newAddress);
      })
    })
  }

  createTestAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getNewAddress((err: any, newAddress: string) => {
        if (err)
          reject(err);
        else
          return resolve(newAddress);
      })
    })
  }

  generate(amount: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.generate(amount, (err: any, amount: any) => {
        if (err)
          reject(err);
        resolve(amount);
      });
    })
  }

  send(amount: number, address: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.sendToAddress(address, amount, (err: any, txid: string) => {
        if (err)
          reject(err);
        resolve(txid);
      })
    })
  }
}
