"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
class BitcoinNode {
    constructor() {
        this.client = require('bitcoin-core');
    }
    waitUntilRunning() {
        const poll = () => {
            childProcess.exec('bitcoin-cli getinfo', function (error, stdout, stderr) {
                if (error) {
                    // console.log('not yet', stderr)
                    setTimeout(poll, 100);
                }
                else {
                    console.log('Bitcoind is now running');
                }
            });
        };
        setTimeout(poll, 3000);
    }
    getClient() {
        return this.client;
    }
    start() {
        childProcess.exec('bitcoind -regtest=1 -rpcuser=root -rpcpassword=test -txindex=1 -disablewallet=1');
        return this.waitUntilRunning();
    }
    //set timeout
    stop() {
        childProcess.exec('bitcoin-cli -regtest -rpcuser=root -rpcpassword=test stop');
    }
}
exports.BitcoinNode = BitcoinNode;
//# sourceMappingURL=bitcoin-node.js.map