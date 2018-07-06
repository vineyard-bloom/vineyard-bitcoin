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
const child_process = require('child_process');
var Status;
(function (Status) {
    Status[Status["active"] = 0] = "active";
    Status[Status["inactive"] = 1] = "inactive";
})(Status || (Status = {}));
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
class BitcoinNode {
    waitUntilRunning(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const poll = () => __awaiter(this, void 0, void 0, function* () {
                const info = yield client.getBlockchainInfo();
                if (!info) {
                    yield sleep(1000);
                    yield poll();
                }
                else {
                    console.log('bitcoind connected');
                }
            });
            yield sleep(3000);
            yield poll();
        });
    }
    // getClient() {
    //   return this.client
    // }
    start(client) {
        console.log('Starting bitcoind');
        this.childProcess = child_process.exec('bitcoind -regtest=1 -rpcuser=root -rpcpassword=test -txindex=1');
        this.childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        this.childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        this.childProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        return this.waitUntilRunning(client);
    }
    stop() {
        if (!this.childProcess)
            return Promise.resolve();
        return new Promise((resolve, reject) => {
            this.childProcess.kill();
            this.childProcess.on('close', (code) => {
                resolve();
            });
        });
    }
}
exports.BitcoinNode = BitcoinNode;
//# sourceMappingURL=bitcoin-node.js.map