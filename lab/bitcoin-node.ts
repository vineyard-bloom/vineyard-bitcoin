import { AsyncBitcoinRpcClient } from "../src";
const child_process = require('child_process')

enum Status {
  active,
  inactive
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export class BitcoinNode {
  private stdout: any
  private stderr: any
  private childProcess: any


  async waitUntilRunning(client: AsyncBitcoinRpcClient) {
    const poll = async () => {
      const info = await client.getBlockchainInfo()
      if (!info) {
        await sleep(1000)
        await poll()
      }
      else {
        console.log('bitcoind connected')
      }
    }
    await sleep(3000)
    await poll()
  }


  // getClient() {
  //   return this.client
  // }

  start(client: AsyncBitcoinRpcClient) {
    console.log('Starting bitcoind')
    this.childProcess = child_process.exec('bitcoind -regtest=1 -rpcuser=root -rpcpassword=test -txindex=1')

    this.childProcess.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`);
    });

    this.childProcess.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
    });

    this.childProcess.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
    })
    return this.waitUntilRunning(client)
  }

  stop() {
    if (!this.childProcess)
      return Promise.resolve()

    return new Promise((resolve, reject) => {
      this.childProcess.kill()
      this.childProcess.on('close', (code: any) => {
        resolve()
      })
    })

  }

}

