const child_process = require('child_process')

enum Status {
  inactive,
  active
}

function waitUntilRunning(path: string) {
  return new Promise<void>((resolve, reject) => {
    const poll = () => {
      child_process.exec(path+'bitcoin-cli -getinfo', function (error: Error, stdout: any, stderr: any) {
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

export interface BitcoinServerConfig {
  path: string
  logging: boolean
}

export class BitcoinServer {
  private status: Status = Status.inactive
  private stdout: any
  private stderr: any
  private childProcess: any
  private config: BitcoinServerConfig

  constructor(config: BitcoinServerConfig){
    this.config = config
  }

  start() {
    console.log('Starting bitcoind')
    const childProcess = this.childProcess = child_process.exec(this.config.path+'bitcoind -daemon')

    if (this.config.logging){
      childProcess.stdout.on('data', (data: any) => {
        console.log(`stdout: ${data}`);
      })
      childProcess.on('close', (code: any) => {
        console.log(`child process exited with code ${code}`);
      })
    }
    // always log errors
    childProcess.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
    })

    return waitUntilRunning(this.config.path)
  }

  stop() {
    console.log('Stopping bitcoind')
    return new Promise<void>((resolve, reject) => {
      const childProcess = this.childProcess = child_process.exec(this.config.path+'bitcoin-cli stop')

      childProcess.stdout.on('data', (data: any) => {
        if(this.config.logging) console.log(`stdout: ${data}`)
        console.log('Terminated bitcoind')
        resolve()
      })
      childProcess.on('close', (code: any) => {
        if(this.config.logging)console.log(`child process exited with code ${code}`)
      })
      // always log errors
      childProcess.stderr.on('data', (data: any) => {
        console.error(`stderr: ${data}`)
        reject()
      })
    })
  }
}
