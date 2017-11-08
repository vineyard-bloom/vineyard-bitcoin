"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require('child_process');
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["active"] = 1] = "active";
})(Status || (Status = {}));
function waitUntilRunning() {
    return new Promise((resolve, reject) => {
        const poll = () => {
            child_process.exec('bitcoin-cli getinfo', function (error, stdout, stderr) {
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
    constructor() {
        this.status = Status.inactive;
    }
    start() {
        console.log('Starting bitcoind');
        const childProcess = this.childProcess = child_process.spawn('bitcoind');
        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        childProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        return waitUntilRunning();
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
exports.BitcoinServer = BitcoinServer;
//# sourceMappingURL=bitcoin-server.js.map