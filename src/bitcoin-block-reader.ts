import { blockchain } from 'vineyard-blockchain'
import { BitcoinRpcClient } from "./types";
import { getBlockCount, getMultiTransactionBlock } from "./client-functions"

export class BitcoinBlockReader implements blockchain.BlockReader<blockchain.MultiTransaction> {
  private client: BitcoinRpcClient

  async getHeighestBlockIndex(): Promise<number> {
    return (await getBlockCount(this.client)) - 1
  }

  getBlockInfo(index: number): Promise<blockchain.Block | undefined> {
    throw new Error('Not implemented.')
  }

  getFullBlock(index: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction> | undefined> {
    return getMultiTransactionBlock(this.client, index)
  }
}