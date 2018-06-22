import { blockHashIsValid, hashBlock } from "../../src"
import { blockchain } from "vineyard-blockchain"
import { assert } from 'chai'

require('source-map-support').install()

describe('validation-test', function () {

  it('can detect a valid block', async function () {
    const block: blockchain.Block = {
      hash: '00000000000356f1c07659b8df88c9cd237359488ae50fc15a05bbb80d58f9c0',
      index: 104677,
      timeMined: new Date(1296041283 * 1000)
    }
    const txHashes = [
      "1131da93ac233cf9eb3f342e9bc137175e4e473b5e624ee411496517b3dd9b3f",
      "6106b5a918fe32fe525ca6bd023fce6b99a6988cdfbf5edc16212ee1144b97a8"
    ]

    const detailedBlock = {
      "hash": "00000000000356f1c07659b8df88c9cd237359488ae50fc15a05bbb80d58f9c0",
      "confirmations": 292808,
      "strippedsize": 478,
      "size": 478,
      "weight": 1912,
      "height": 104677,
      "version": 1,
      "versionHex": "00000001",
      "merkleroot": "7f4854bfd77bf3f7b145558bc433d71b647d82bdb5c56f570298895e3f280d11",
      "tx": [
      "1131da93ac233cf9eb3f342e9bc137175e4e473b5e624ee411496517b3dd9b3f",
      "6106b5a918fe32fe525ca6bd023fce6b99a6988cdfbf5edc16212ee1144b97a8"
    ],
      "time": 1296041283,
      "mediantime": 1296038082,
      "nonce": 3879341548,
      "bits": "1b038dee",
      "difficulty": 18437.64439216629,
      "chainwork": "0000000000000000000000000000000000000000000000000af6e49d9dba2328",
      "previousblockhash": "000000000000c401aee9a396a4a08fdc91c05adf4a9ccc809fbc06464a831b58",
      "nextblockhash": "000000000000b4ea234681d49ab5abad53fefa3286d6d15792c6bc52575a31e2"
    }

    const hash = hashBlock(detailedBlock, txHashes)
    assert.equal(hash, block.hash)
  })
})