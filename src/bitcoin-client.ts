const bitcoin = require('bitcoin')
import {TransactionSource, Block} from "./types";
import {ExternalTransaction, FullBlock, BlockInfo, TransactionStatus} from "vineyard-blockchain";


export interface BitcoinConfig {
  port?: number
  user: string
  pass: string
  timeout?: number
  host?: string
}

export interface BlockList {
  transactions: TransactionSource[]
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
    return this.getTransaction(txid).then((transaction: TransactionSource) => {
      if(transaction.confirmations == -1) return TransactionStatus.rejected
      if(transaction.confirmations == 0 ) return TransactionStatus.pending 
      else {
        return TransactionStatus.accepted 
      }
    })
  }

  getLastBlock(): Promise<BlockInfo> {
    return this.client.getBlock(this.client.getBlockCount(), (err: any, lastBlock: Block) => {
      return {
        hash: lastBlock.hash,
        index: lastBlock.height,
        timeMined: lastBlock.time
      }
    })
  }

  getNextBlockInfo(previousBlock: BlockInfo | undefined): Promise<BlockInfo> {
    const nextBlockIndex = previousBlock ? previousBlock.index + 1 : 0  
    return this.client.getBlock(nextBlockIndex, (err: any, nextBlock: Block) => {
      return {
        hash: nextBlock.hash,
        index: nextBlock.height,
        timeMined: nextBlock.time
      }
    })
   }
 
   getFullBlock(block: BlockInfo): Promise<FullBlock> {
    return this.client.getBlock(block, (err: any, fullBlock: Block) => {
      return {
        hash: fullBlock.hash,
        index: fullBlock.height,
        timeMined: fullBlock.time,
        transactions: fullBlock.tx
      }
    })
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

  getTransaction(txid: string): Promise<TransactionSource> {
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
