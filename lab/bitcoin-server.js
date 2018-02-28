"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require('child_process');
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["active"] = 1] = "active";
})(Status || (Status = {}));
function waitUntilRunning(path) {
    return new Promise((resolve, reject) => {
        const poll = () => {
            child_process.exec(path + 'bitcoin-cli -getinfo', function (error, stdout, stderr) {
                if (error) {
                    // console.log('not yet', stderr)
                    setTimeout(poll, 100);
                }
                else {
                    console.log('Bitcoind is now running');
                    resolve();
                }
            });
        };
        setTimeout(poll, 3000);
    });
}
class BitcoinServer {
    constructor(config) {
        this.status = Status.inactive;
        this.config = config;
    }
    start() {
        console.log('Starting bitcoind');
        const childProcess = this.childProcess = child_process.exec(this.config.path + 'bitcoind -daemon');
        if (this.config.logging) {
            childProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            childProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        }
        // always log errors
        childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        return waitUntilRunning(this.config.path);
    }
    stop() {
        console.log('Stopping bitcoind');
        return new Promise((resolve, reject) => {
            const childProcess = this.childProcess = child_process.exec(this.config.path + 'bitcoin-cli stop');
            childProcess.stdout.on('data', (data) => {
                if (this.config.logging)
                    console.log(`stdout: ${data}`);
                console.log('Terminated bitcoind');
                resolve();
            });
            childProcess.on('close', (code) => {
                if (this.config.logging)
                    console.log(`child process exited with code ${code}`);
            });
            // always log errors
            childProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                reject();
            });
        });
    }
}
exports.BitcoinServer = BitcoinServer;
//# sourceMappingURL=bitcoin-server.js.map