"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_functions_1 = require("./client-functions");
var Client = require('bitcoin-core');
var BitcoinBlockReader = /** @class */ (function () {
    function BitcoinBlockReader(client) {
        this.client = client;
    }
    BitcoinBlockReader.prototype.getHeighestBlockIndex = function () {
        return this.client.getBlockCount();
    };
    BitcoinBlockReader.prototype.getFullBlock = function (index) {
        return client_functions_1.getMultiTransactionBlock(this.client, index);
    };
    BitcoinBlockReader.createFromConfig = function (config) {
        return new BitcoinBlockReader(new Client(config));
    };
    return BitcoinBlockReader;
}());
exports.BitcoinBlockReader = BitcoinBlockReader;
