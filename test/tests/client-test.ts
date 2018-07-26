import { BitcoinClient } from '../../src/bitcoin-client'
import { assert } from 'chai'

// just some quick and dirty tests for the straight rpc client

const bitcoinClient = new BitcoinClient({
  host: 'localhost',
  user: 'root',
  pass: 'test',
  port: 18332
})

async function execute() {
  const hash = await bitcoinClient.getBlockHash(1)
  const block = await bitcoinClient.getBlock(hash)
  const test = await bitcoinClient.getRawTransaction(block.tx[0])
  console.log(test)
  assert(test)
}

execute()