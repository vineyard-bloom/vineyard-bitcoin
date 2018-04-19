import { blockchain } from 'vineyard-blockchain'
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { getMultiTransactionBlock } from "./client-functions"

const Client = require('bitcoin-core')

export class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
  private client: AsyncBitcoinRpcClient

  constructor(client: AsyncBitcoinRpcClient) {
    this.client = client
  }

  async getHeighestBlockIndex(): Promise<number> {
    return this.client.getBlockCount()
  }

  async getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>> {
    return getMultiTransactionBlock(this.client, index)
  }

  static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader {
    return new BitcoinBlockReader(new Client(config))
  }
}