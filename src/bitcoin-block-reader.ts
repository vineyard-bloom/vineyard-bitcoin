import { blockchain } from 'vineyard-blockchain'
import { AsyncBitcoinRpcClient, BitcoinConfig2, Defaults } from "./types";
import { getMultiTransactionBlock } from "./client-functions"
import { Network, networks } from "bitcoinjs-lib"
import { StatsD } from "hot-shots" 
const dogstatsd = new StatsD();

const Client = require('bitcoin-core')
export type FullMultiTransactionBlock = blockchain.BlockBundle<blockchain.Block, blockchain.Transaction>
export class BitcoinBlockReader implements blockchain.BlockReader<blockchain.Block, blockchain.Transaction> {
  private client: AsyncBitcoinRpcClient
  private network: Network
  private transactionChunkSize: number

  constructor(client: AsyncBitcoinRpcClient, network: Network, transactionChunkSize: number = Defaults.TRANSACTION_CHUNK_SIZE) {
    this.client = client
    this.network = network
    this.transactionChunkSize = transactionChunkSize
  }

  async getHeighestBlockIndex(): Promise<number> {
    dogstatsd.increment('bitcoin.rpc.getblockcount')
    return this.client.getBlockCount()
  }

  async getBlockBundle(index: number): Promise<blockchain.BlockBundle<blockchain.Block, blockchain.Transaction>> {
    this.incrementDatadogCounters()
    return getMultiTransactionBlock(this.client, index, this.network, this.transactionChunkSize)
  }

  private incrementDatadogCounters(): void {
    dogstatsd.increment('bitcoin.rpc.getrawtransaction')
    dogstatsd.increment('bitcoin.rpc.getblockhash')
    dogstatsd.increment('bitcion.rpc.getblock')
  }

  static createFromConfig(config: BitcoinConfig2): BitcoinBlockReader {
    const { network, transactionChunkSize, ...blockReaderConfig } = config
    return new BitcoinBlockReader(new Client(blockReaderConfig), network || networks.bitcoin, transactionChunkSize)
  }
}