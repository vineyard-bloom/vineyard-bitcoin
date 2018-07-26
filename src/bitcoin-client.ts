import { BitcoinConfig, BitcoinRPCBlock, RawRPCSerializedTransaction } from './types'
import axios from 'axios'

export class BitcoinClient {
  readonly config: BitcoinConfig

  constructor(config: BitcoinConfig) {
    this.config = config
  }

  getBlock (hash: string): Promise<BitcoinRPCBlock> {
    return this._rpcCall('getblock', hash)
  }

  getBlockHash (index: number): Promise<string> {
    return this._rpcCall('getblockhash', index)
  }
  getRawTransaction (txid: string): Promise<RawRPCSerializedTransaction> {
    return this._rpcCall('getrawtransaction', txid, true)    
  }

  private async _rpcCall(methodName: string, ...args): Promise<any> {
    const authData = {
      'user': this.config.user,
      'pass': this.config.pass
    }
    const auth = 'Basic ' + new Buffer(`${authData.user}:${authData.pass}`).toString('base64')
    const data = {
      'method': methodName,
      'params': [...args],
      'id': 'jsonrpc'
    }
    const url = `http://${this.config.host}:${this.config.port}`
    const bitcoinAxios = axios.create({
      baseURL: url,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    })
    const response = await bitcoinAxios.post(url, data)
      .catch(err => {
        console.error('Error in rpc client: ' + err)
        throw new Error(err)
    })
    return response.data.result
  }
}