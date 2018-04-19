import { regtestConfig, testnetConfig } from "../config/bitcoin-core-testing-configs"
import {
  AsyncBitcoinRpcClient,
  BitcoinRPCBlock,
  RawRPCDeserializedTransaction,
  RawRPCSerializedTransaction
} from "../../src/types"
import * as assert from "assert"
import { isNumber, isString } from "util"
import { BitcoinBlockReader } from "../../src/bitcoin-block-reader"
import { BitcoinClient } from "../../src/bitcoin-client"

const Client = require('bitcoin-core')

// Regtest needs to be running, see bitcoin-core-regtest-config.

describe('Bitcoin-core type sanity checking', function() {
  const bitcoinCoreClient = new Client(regtestConfig) as AsyncBitcoinRpcClient
  const bitcoinBlockReader = new BitcoinBlockReader(bitcoinCoreClient)

  it('returns a blockheight number', async function() {
    const blockHeight = await bitcoinCoreClient.getBlockCount()
    assert(isNumber(blockHeight))
    assert(blockHeight > 0)
  })

  it('returns a block in BitcoinRPCBlock format', async function() {
    const blockIndex = 0
    const blockHash = await bitcoinCoreClient.getBlockHash(blockIndex)
    const block = await bitcoinCoreClient.getBlock(blockHash) as BitcoinRPCBlock

    assert(isNumber(block.time))
    assert(block.height === 0)
    assert(block.hash)
    block.tx.forEach( txid => {
      assert(isString(txid))
    })
  })

  it('returns a multitx in BitcoinRPCBlock format', async function() {
    const blockIndex = 0
    const multi = await bitcoinBlockReader.getFullBlock(blockIndex)
    multi.transactions.forEach( tx => {
      tx.outputs.forEach( out => {
        assert(out.scriptPubKey.addresses.length > 0)
      } )
    } )
  })

  it('does stuff', async function() {
    const vineyardBitcoinClient = new BitcoinClient(testnetConfig)
    try {
      await vineyardBitcoinClient.getFullBlock(1293548)
    } catch (e) {
      console.error(e)
      const curiousIfTheAboveCrashes = false
      assert(curiousIfTheAboveCrashes)
    }
  })

  // TODO: automate tx creation so txid isn't hardcoded
  xit('returns a serialized transaction', async function() {
    const rawTx = await bitcoinCoreClient.getRawTransaction(
      '87f61ea805ec8adb4643128ac26c047800a2d42b3f29d0cd5d75a9c54f730518'
    ) as RawRPCSerializedTransaction
    assert(isString(rawTx))
  })

  // TODO: automate tx creation so txid isn't hardcoded
  xit('returns a deserialized transaction', async function() {
    const rawTx = await bitcoinCoreClient.getRawTransaction(
      'a0085a431fd17a255f864eec55e8ffd49c05d95bbf367a3a3deece8b0ae9c8d3', true
    ) as RawRPCDeserializedTransaction
    assert(rawTx.txid)
    assert(rawTx.blocktime)
    rawTx.vout.forEach(  out => {
      assert(out.scriptPubKey)
      assert(isNumber(out.value))
      // assert(out.n)
    })

    rawTx.vin.forEach(input => {
      assert(input.vout || input.coinbase)
      assert(input.txid || input.coinbase)
      assert(isNumber(input.amount) || input.coinbase)
    })
  })
})
