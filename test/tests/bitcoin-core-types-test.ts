
import {
  BitcoinRPCBlock,
  RawRPCDeserializedTransaction,
  RawRPCSerializedTransaction
} from "../../src/types"
import * as assert from "assert"
import {isNumber, isString, log} from "util"
import { BitcoinBlockReader } from "../../src/bitcoin-block-reader"
import {Block, Network, networks} from "bitcoinjs-lib"
import {BitcoinNode} from "../../lab/bitcoin-node";
const minute = 60 * 1000

const Client = require('bitcoin-core')

describe('Bitcoin-core type sanity checking', function() {
  this.timeout(minute)
  const client = new Client({
    'network': 'regtest',
    'username': 'root',
    'password': 'test',
    'port': 18443,
    'host': 'localhost'
  })
  const node = new BitcoinNode
  const bitcoinBlockReader = new BitcoinBlockReader(client, networks.testnet)

  it('returns a blockheight number', async function() {
    await node.start(client)
    const blockHeight = await client.getBlockCount()
    await node.stop()
    assert(isNumber(blockHeight))
    assert(blockHeight > 0)
  })

  it('returns a block in BitcoinRPCBlock format', async function() {
    await node.start(client)
    const blockIndex = 0
    const blockHash = await client.getBlockHash(blockIndex)
    const block = await client.getBlock(blockHash) as BitcoinRPCBlock
    await node.stop()
    assert(isNumber(block.time))
    assert(block.height === 0)
    assert(block.hash)
    block.tx.forEach( txid => {
      assert(isString(txid))
    })
  })

  it('returns a BlockBundle', async function() {
    await node.start(client)
    const blockIndex = 1
    const multi = await bitcoinBlockReader.getBlockBundle(blockIndex)
    await node.stop()
    console.log(multi)
    assert('block' in multi)
    assert('transactions' in multi)
  })

  it('returns the highest block index', async function() {
    await node.start(client)
    const before = await bitcoinBlockReader.getHeighestBlockIndex()
    await client.generate(1)
    const after = await bitcoinBlockReader.getHeighestBlockIndex()
    await node.stop()
    console.log(`BEFORE: ${before} AFTER ${after}`)
    assert((after - before) === 1)
  })


  // TODO: automate tx creation so txid isn't hardcoded
  xit('returns a serialized transaction', async function() {
    const rawTx = await client.getRawTransaction(
      '87f61ea805ec8adb4643128ac26c047800a2d42b3f29d0cd5d75a9c54f730518'
    ) as RawRPCSerializedTransaction
    assert(isString(rawTx))
  })

  // TODO: automate tx creation so txid isn't hardcoded
  xit('returns a deserialized transaction', async function() {
    const rawTx = await client.getRawTransaction(
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
    })
  })
})
