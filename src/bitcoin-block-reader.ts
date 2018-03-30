import { blockchain } from 'vineyard-blockchain'
import { BitcoinConfig, BitcoinRpcClient } from "./types";
import { getMultiTransactionBlock } from "./client-functions"
const Client = require('bitcoin-core')

export class BitcoinBlockReader implements blockchain.BlockReader<blockchain.MultiTransaction> {
  private client: any

  constructor(client: BitcoinRpcClient) {
    this.client = client
  }

  getHeighestBlockIndex(): Promise<number> {
    return this.client.getBlockCount()
  }

  getBlockInfo(index: number): Promise<blockchain.Block | undefined> {
    throw new Error('Not implemented.')
  }

  getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined> {
    return getMultiTransactionBlock(this.client, index)
  }

  static createFromConfig(config: BitcoinConfig) {
    return new BitcoinBlockReader(new Client(config))
  }
}