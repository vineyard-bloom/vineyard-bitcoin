import { BitcoinConfig, BitcoinRPCBlock, RawRPCSerializedTransaction } from './types'
import * as request from 'request-promise'

export class BitcoinClient {
  readonly config: BitcoinConfig

  constructor(config: BitcoinConfig) {
    this.config = config
  }

  getBlock (hash: string): Promise<BitcoinRPCBlock> {
    return this.rpcCall('getblock', hash)
  }

  getBlockHash (index: number): Promise<string> {
    return this.rpcCall('getblockhash', index)
  }
  getRawTransaction (txid: string): Promise<RawRPCSerializedTransaction> {
    return this.rpcCall('getrawtransaction', txid, true)    
  }

  private async rpcCall(methodName: string, ...args): Promise<any> {
    const auth = {
      'user': this.config.user,
      'pass': this.config.pass
    }
    const body = {
      'method': methodName,
      'params': [...args],
      'id': 'jsonrpc'
    }
    const options = {
      method: 'POST',
      uri: `http://${this.config.host}:${this.config.port}`,
      auth: auth,
      json: true,
      body: body
    }
    const response = await request(options)
    if (response.error !== null) {
      throw new Error(response.error)
    }
    return response.result
  }
}