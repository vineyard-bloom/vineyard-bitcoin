"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require('util');
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
function getBlockByIndex(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield client.getBlockHash(index);
        return client.getBlock(hash);
    });
}
exports.getBlockByIndex = getBlockByIndex;
// export function getTransaction(client: BitcoinRpcClient, txid: string): Promise<BitcoinTransactionSource> {
//   return promisify(client.getTransaction.bind(client))(txid)
// }
// export function getRawTransaction(client: BitcoinRpcClient, txid: string): Promise<RawTransaction> {
//   return promisify(client.getRawTransaction.bind(client))(txid)
// }
function getMultiTransactions(client, transactions, blockIndex) {
    return __awaiter(this, void 0, void 0, function* () {
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
        return Promise.all(transactions.map((t) => __awaiter(this, void 0, void 0, function* () {
            console.log('t', t);
            const raw = yield client.getRawTransaction(t, true);
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
            };
        })));
    });
}
exports.getMultiTransactions = getMultiTransactions;
function bitcoinToBlockchainBlock(block) {
    return {
        hash: block.hash,
        index: block.height,
        timeMined: new Date(block.time),
    };
}
exports.bitcoinToBlockchainBlock = bitcoinToBlockchainBlock;
function getMultiTransactionBlock(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullBlock = yield getBlockByIndex(client, index);
        let transactions = yield getMultiTransactions(client, fullBlock.tx, index);
        let newFullBlock = {
            hash: fullBlock.hash,
            index: fullBlock.height,
            timeMined: new Date(fullBlock.time * 1000),
            transactions: transactions
        };
        return newFullBlock;
    });
}
exports.getMultiTransactionBlock = getMultiTransactionBlock;
//# sourceMappingURL=client-functions.js.map