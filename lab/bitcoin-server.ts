const child_process = require('child_process')

enum Status {
  inactive,
  active
}

function waitUntilRunning() {
  return new Promise<void>((resolve, reject) => {
    const poll = () => {
      child_process.exec('bitcoin-cli getinfo', function (error: Error, stdout: any, stderr: any) {
        if (error) {
          // console.log('not yet', stderr)
          setTimeout(poll, 100)
        }
        else {
          console.log('Bitcoind is now running')
          resolve()
        }
      })
    }

    setTimeout(poll, 3000)
  })
}

export class BitcoinServer {
  private status: Status = Status.inactive
  private stdout: any
  private stderr: any
  private childProcess: any

  start() {
    console.log('Starting bitcoind')
    const childProcess = this.childProcess = child_process.spawn('bitcoind')

    childProcess.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
    })

    return waitUntilRunning()
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
