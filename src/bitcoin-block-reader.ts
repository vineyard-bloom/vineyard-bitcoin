import { blockchain } from 'vineyard-blockchain'
import { AsyncBitcoinRpcClient, BitcoinConfig2 } from "./types";
import { getMultiTransactionBlock } from "./client-functions"
import { Network, networks } from "bitcoinjs-lib"

const Client = require('bitcoin-core')
export type FullMultiTransactionBlock = blockchain.FullBlock<blockchain.MultiTransaction>
export class BitcoinBlockReader implements blockchain.BlockReader<FullMultiTransactionBlock> {
  private client: AsyncBitcoinRpcClient
  private network: Network

  constructor(client: AsyncBitcoinRpcClient, network: Network) {
    this.client = client
    this.network = network
  }

  async getHeighestBlockIndex(): Promise<number> {
    return this.client.getBlockCount()
  }

  async getFullBlock(index: number): Promise<FullMultiTransactionBlock> {
    return getMultiTransactionBlock(this.client, index, this.network)
  }

  static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader {
    const { network, ...blockReaderConfig } = config
    return new BitcoinBlockReader(new Client(blockReaderConfig), network || networks.bitcoin)
  }
}