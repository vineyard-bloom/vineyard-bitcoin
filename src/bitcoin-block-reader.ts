import { blockchain } from 'vineyard-blockchain'
import { AsyncBitcoinRpcClient, BitcoinConfig2, Defaults } from "./types";
import { getMultiTransactionBlock } from "./client-functions"
import { Network, networks } from "bitcoinjs-lib"

const Client = require('bitcoin-core')
export type FullMultiTransactionBlock = blockchain.FullBlock<blockchain.MultiTransaction>
export class BitcoinBlockReader implements blockchain.BlockReader<FullMultiTransactionBlock> {
  private client: AsyncBitcoinRpcClient
  private network: Network
  private transactionChunkSize: number

  constructor(client: AsyncBitcoinRpcClient, network: Network, transactionChunkSize: number = Defaults.TRANSACTION_CHUNK_SIZE) {
    this.client = client
    this.network = network
    this.transactionChunkSize = transactionChunkSize
  }

  async getHeighestBlockIndex(): Promise<number> {
    return this.client.getBlockCount()
  }

  async getBlockBundle(index: number): Promise<FullMultiTransactionBlock> {
    return getMultiTransactionBlock(this.client, index, this.network, this.transactionChunkSize)
  }

  static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader {
    const { network, transactionChunkSize, ...blockReaderConfig } = config
    return new BitcoinBlockReader(new Client(blockReaderConfig), network || networks.bitcoin, transactionChunkSize)
  }
}