"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin_server_1 = require("./bitcoin-server");
const src_1 = require("../src");
const child_process = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
class BitcoinLab {
    constructor(config, client, server = new bitcoin_server_1.BitcoinServer()) {
        this.config = config;
        this.client = client;
        this.server = server;
    }
    deleteLock() {
        return new Promise((resolve, reject) => {
            fs.unlink(this.config.walletPath + '/' + '.lock', function (result, error, stdout, stderr) {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }
    deleteWallet() {
        console.log('Deleting regtest bitcoin wallet');
        return this.deleteLock()
            .then(() => new Promise((resolve, reject) => {
            rimraf(this.config.walletPath, function (error, stdout, stderr) {
                if (error)
                    reject(error);
                else
                    resolve(stdout);
            });
        }));
    }
    importAddress(address) {
        return this.client.importAddress(address);
    }
    start() {
        return this.server.start();
    }
    stop() {
        return this.server.stop();
    }
    reset() {
        return this.deleteWallet();
        // return this.stop()
        // .then(() => this.deleteWallet())
        // .then(() => this.start())
    }
    generate(blockCount) {
        return new Promise((resolve, reject) => {
            this.client.getClient().generate(blockCount, (error) => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
    send(address, amount) {
        return new Promise((resolve, reject) => {
            this.client.getClient().sendToAddress(address, src_1.satoshisToBitcoin(amount), (error) => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
    sendMany(addressAmounts) {
        return new Promise((resolve, reject) => {
            for (var i in addressAmounts) {
                addressAmounts[i] = src_1.satoshisToBitcoin(addressAmounts[i]);
            }
            this.client.getClient().sendMany('', addressAmounts, (error) => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
}
exports.BitcoinLab = BitcoinLab;
//# sourceMappingURL=bitcoin-lab.js.map