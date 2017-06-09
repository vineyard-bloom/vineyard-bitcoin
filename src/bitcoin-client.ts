import * as bitcoin from 'bitcoin'
import {TransactionSource} from "./types";

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
  private client

  constructor(bitcoinConfig: BitcoinConfig) {
    this.client = new bitcoin.Client(bitcoinConfig)
  }

  getHistory(lastBlock: string): Promise<BlockList> {
    return new Promise((resolve, reject) => {
      this.client.listSinceBlock(lastBlock || "", 1, true, (err, info) => {
        if (err)
          reject(new Error(err));
        else {
          const transactions = info.transactions
          // const lastTransaction = transactions[transactions.length - 1]

          resolve({
            transactions: info.transactions.filter(t => t.category == 'receive' || t.category == 'immature'),
            lastBlock: info.lastblock //lastTransaction ? lastTransaction.blockhash : null
          })
        }
      })
    })
  }

  listTransactions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.listTransactions('', 100, 0, true, (err, transactions) => {
        if (err)
          reject(new Error(err));
        else
          resolve(transactions)
      })
    })
  }

  getTransaction(txid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.getTransaction(txid, true, (err, transaction) => {
        if (err)
          reject(err)
        else
          resolve(transaction)
      })
    })
  }

  importAddress(address: string, rescan: boolean = false) {
    return new Promise((resolve, reject) => {
      this.client.importAddress(address, "", rescan, (err, result) => {
        if (err)
          reject(err)
        else
          resolve(address);
      })
    })
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      this.client.getInfo((err, info) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  listAddresses() {
    return new Promise((resolve, reject) => {
      this.client.listAddressGroupings((err, info) => {
        if (err)
          reject(err)
        else
          resolve(info);
      })
    })
  }

  createAddress() {
    return new Promise((resolve, reject) => {
      this.client.getNewAddress((err, newAddress) => {
        if (err)
          reject(err)
        else
          resolve(newAddress);
      })
    })
  }

  createTestAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getNewAddress((err, newAddress) => {
        if (err)
          reject(err);
        else
          return resolve(newAddress);
      })
    })
  }

  generate(amount: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.generate(amount, (err, amount) => {
        if (err)
          reject(err);
        resolve(amount);
      });
    })
  }

  send(amount: number, address: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.sendToAddress(address, amount, (err, txid) => {
        if (err)
          reject(err);
        resolve(txid);
      })
    })
  }
}
