import { BitcoinConfig, BitcoinConfig2 } from "../../src/types"
import { networks } from "bitcoinjs-lib"

export const testConfig: BitcoinConfig = {
  port: 18444,
  user: 'bitcoin',
  pass: 'staging321',
  host: 'localhost',
  network: networks.testnet
}