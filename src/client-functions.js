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
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
exports.liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
function getBlockByIndex(client, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield client.getBlockHash(index);
        return client.getBlock(hash);
    });
}
exports.getBlockByIndex = getBlockByIndex;
function getMultiTransactions(client, transactionIds, blockIndex, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = [];
        let result = [];
        //break transactionIds array into chunks of n
        for (let i = 0; i < transactionIds.length; i += 10) {
            chunks.push(transactionIds.slice(i, i + 10));
        }
        //only resolve n async calls by looping through chunks
        for (let chunk of chunks) {
            const promises = chunk.map(tx => getMultiTransactionWithBlockIndex(client, tx, network, blockIndex));
            const newItems = yield Promise.all(promises);
            result = result.concat(newItems);
        }
        return result;
    });
}
exports.getMultiTransactions = getMultiTransactions;
function getMultiTransactionWithBlockIndex(client, txid, network, blockIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = Object.assign({}, yield getMultiTransaction(client, txid, network), { blockIndex });
        return transaction;
    });
}
exports.getMultiTransactionWithBlockIndex = getMultiTransactionWithBlockIndex;
// TODO: Consider the fee below, can we compute this?
function getMultiTransaction(client, txid, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const raw = yield client.getRawTransaction(txid, true);
        return {
            txid: raw.txid,
            timeReceived: new Date(raw.blocktime * 1000),
            status: vineyard_blockchain_1.blockchain.TransactionStatus.unknown,
            fee: new bignumber_js_1.BigNumber(0),
            nonce: 0,
            inputs: raw.vin,
            outputs: raw.vout.filter(notOpReturn).map(ensureValueInSatoshis).map(populateAddress(network))
        };
    });
}
exports.getMultiTransaction = getMultiTransaction;
const populateAddress = network => out => Object.assign(out, { address: addressFromOutScript(out.scriptPubKey, network) });
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
function getMultiTransactionBlock(client, index, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullBlock = yield getBlockByIndex(client, index);
        let transactions = yield getMultiTransactions(client, fullBlock.tx, index, network);
        return {
            hash: fullBlock.hash,
            index: fullBlock.height,
            timeMined: new Date(fullBlock.time * 1000),
            transactions: transactions
        };
    });
}
exports.getMultiTransactionBlock = getMultiTransactionBlock;
function addressFromOutScript(scriptPubKey, network) {
    try {
        return bitcoinjs_lib_1.address.fromOutputScript(new Buffer(scriptPubKey.hex, "hex"), network);
    }
    catch (e) {
        console.log(`Unable to parse address from output script. Trying p2pk parse.`);
    }
    try {
        const pubKey = scriptPubKey.asm.split(' ')[0];
        return bitcoinjs_lib_1.ECPair.fromPublicKeyBuffer(new Buffer(pubKey, 'hex'), network).getAddress();
    }
    catch (e) {
        console.warn(`Unable to parse address as p2pk: ${scriptPubKey.asm}: ${e}`);
        return 'UNABLE TO PARSE: ' + scriptPubKey.hex;
    }
}
exports.addressFromOutScript = addressFromOutScript;
//# sourceMappingURL=client-functions.js.map