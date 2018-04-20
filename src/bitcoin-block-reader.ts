import { blockchain } from 'vineyard-blockchain'
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { getMultiTransactionBlock } from "./client-functions"
import { Network, networks } from "bitcoinjs-lib"

const Client = require('bitcoin-core')
export class BitcoinBlockReader implements blockchain.BlockReader<blockchain.FullBlock<blockchain.MultiTransaction>> {
  private client: AsyncBitcoinRpcClient
  private network: Network

  constructor(client: AsyncBitcoinRpcClient, network: Network) {
    this.client = client
    this.network = network
  }

  async getHeighestBlockIndex(): Promise<number> {
    return this.client.getBlockCount()
  }

  async getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>> {
    return getMultiTransactionBlock(this.client, index, this.network)
  }

  static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader {
    const { network, ...blockReaderConfig } = config
    return new BitcoinBlockReader(new Client(blockReaderConfig), network || networks.bitcoin)
  }
}