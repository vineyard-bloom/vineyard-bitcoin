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
const bignumber_js_1 = require("bignumber.js");
const vineyard_blockchain_1 = require("vineyard-blockchain");
const util_1 = require("util");
exports.liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
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
function getMultiTransactions(client, transactionIds, blockIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(transactionIds
            .filter(txid => txid !== exports.liveGenesisTxid)
            .map(txid => getMultiTransaction(client, txid).then(tx => { return Object.assign({}, tx, { blockIndex }); }).catch(e => {
            throw new Error(`Unable to acquire full multi transaction for ${txid}: ${e}`);
        })));
    });
}
exports.getMultiTransactions = getMultiTransactions;
// TODO: Consider the fee below, can we compute this?
function getMultiTransaction(client, txid) {
    return __awaiter(this, void 0, void 0, function* () {
        const raw = yield client.getRawTransaction(txid, true);
        return {
            txid: raw.txid,
            timeReceived: new Date(raw.blocktime * 1000),
            status: vineyard_blockchain_1.blockchain.TransactionStatus.unknown,
            fee: new bignumber_js_1.BigNumber(0),
            nonce: 0,
            inputs: raw.vin,
            outputs: raw.vout.filter(notOpReturn).map(ensureValueInSatoshis)
        };
    });
}
exports.getMultiTransaction = getMultiTransaction;
const notOpReturn = (out) => out.scriptPubKey.type !== 'nulldata';
const ensureValueInSatoshis = (out) => {
    const valueSat = util_1.isNullOrUndefined(out.valueSat) ? new bignumber_js_1.BigNumber(out.value).times(1e8) : new bignumber_js_1.BigNumber(out.valueSat);
    return Object.assign({}, out, { valueSat });
};
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
        return {
            hash: fullBlock.hash,
            index: fullBlock.height,
            timeMined: new Date(fullBlock.time * 1000),
            transactions: transactions
        };
    });
}
exports.getMultiTransactionBlock = getMultiTransactionBlock;
//# sourceMappingURL=client-functions.js.map