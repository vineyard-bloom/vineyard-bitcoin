import { AsyncBitcoinRpcClient, BitcoinRPCBlock, Omit, RawRPCDeserializedTransaction, TxId } from "./types";
import { BigNumber } from "bignumber.js"
import { blockchain } from "vineyard-blockchain"
import { isNullOrUndefined } from "util"
import { address, ECPair, Network, networks } from "bitcoinjs-lib"
import TransactionOutput = blockchain.TransactionOutput
import ScriptPubKey = blockchain.ScriptPubKey

export const liveGenesisTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'

export async function getBlockByIndex(client: AsyncBitcoinRpcClient, index: number): Promise<BitcoinRPCBlock> {
  const hash = await client.getBlockHash(index)
  return client.getBlock(hash)
}

export async function getMultiTransactions(client: AsyncBitcoinRpcClient, transactionIds: TxId[], blockIndex: number, network: Network, chunkSize:number): Promise<blockchain.MultiTransaction[]> {
  const chunks = [] as TxId[][]
  let result = [] as blockchain.MultiTransaction[]

  //break transactionIds array into chunks of n and only resolve n async calls
  for (let i = 0; i < transactionIds.length; i += chunkSize) {
    const chunk = transactionIds.slice(i, i + chunkSize)
    const promises = chunk.map(tx => getMultiTransactionWithBlockIndex(client, tx, network, blockIndex))
    const newItems = await Promise.all(promises)
    result = result.concat(newItems)
  }
  return result
}

export async function getMultiTransactionWithBlockIndex(client: AsyncBitcoinRpcClient, txid: TxId, network: Network, blockIndex: number): Promise<blockchain.MultiTransaction>{
  return {...await getMultiTransaction(client, txid, network), blockIndex}
}

// TODO: Consider the fee below, can we compute this?
export async function getMultiTransaction(client: AsyncBitcoinRpcClient, txid: TxId, network: Network): Promise<Omit<blockchain.MultiTransaction, 'blockIndex'>>{
  const raw = await client.getRawTransaction(txid, true) as RawRPCDeserializedTransaction

  return {
    txid: raw.txid,
    timeReceived: new Date(raw.blocktime * 1000),
    status: blockchain.TransactionStatus.unknown,
    fee: new BigNumber(0),
    nonce: 0,
    inputs: raw.vin,
    outputs: raw.vout.filter(notOpReturn).map(ensureValueInSatoshis).map(populateAddress(network))
  }
}

const populateAddress : (network: Network) => (out: TransactionOutput) => TransactionOutput =
  network => out =>  Object.assign(out, {address: addressFromOutScript(out.scriptPubKey, network)})

const notOpReturn = (out: TransactionOutput) => out.scriptPubKey.type !== 'nulldata'
const ensureValueInSatoshis: (out: TransactionOutput) => TransactionOutput = (out) => {
  const valueSat = isNullOrUndefined(out.valueSat) ? new BigNumber(out.value).times(1e8) : new BigNumber(out.valueSat)
  return { ...out, valueSat }
}

export function bitcoinToBlockchainBlock(block: BitcoinRPCBlock): blockchain.Block {
  return {
    hash: block.hash,
    index: block.height,
    timeMined: new Date(block.time),
  }
}

export async function getMultiTransactionBlock(client: AsyncBitcoinRpcClient, index: number, network: Network, transactionChunkSize: number): Promise<blockchain.FullBlock<blockchain.MultiTransaction>> {
  const fullBlock: BitcoinRPCBlock = await getBlockByIndex(client, index)
  let transactions = await getMultiTransactions(client, fullBlock.tx, index, network, transactionChunkSize)
  return  {
    hash: fullBlock.hash,
    index: fullBlock.height,
    timeMined: new Date(fullBlock.time * 1000),
    transactions: transactions
  }
}

export function addressFromOutScript (scriptPubKey: ScriptPubKey, network: Network): string {
  if (scriptPubKey.addresses && scriptPubKey.addresses.length === 1) {
    return scriptPubKey.addresses[0]
  }
  try {
    return address.fromOutputScript(new Buffer(scriptPubKey.hex, "hex"), network)
  } catch (e) {
    console.warn(`Unable to parse address from output script. Trying p2pk parse.`)
  }

  try {
    const pubKey = scriptPubKey.asm.split(' ')[0]
    return ECPair.fromPublicKeyBuffer(new Buffer(pubKey, 'hex'), network).getAddress()
  } catch (e) {
    console.warn(`Unable to parse address as p2pk or p2sh: ${scriptPubKey.asm}: ${e}`)
    return ''
  }
}
