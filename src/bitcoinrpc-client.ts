import * as bitcoin from 'bitcoin'
const config = require('../../config/secrets');

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

export class BitcoinClient {
    private client

    constructor() {
        this.client = new bitcoin.Client(config.bitcoin)
    }

    getHistory(lastBlock: string): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.client.listSinceBlock(lastBlock || "", (err, transactions) => {
                if (err)
                    reject(new Error(err));
                else
                    resolve(transactions.transactions.filter(t=>t.category == 'receive' || t.category == 'immature'))
            })
        })
    }

    getTransaction(txid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.client.getTransaction(txid, true, (err, transaction) => {
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
                    resolve(result);
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
            return this.client.getNewAddress((err, newAddress) => {
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
