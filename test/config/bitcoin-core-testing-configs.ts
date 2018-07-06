import { BitcoinConfig, BitcoinConfig2 } from "../../src/types"
import { networks } from "bitcoinjs-lib"

export const regtestConfig: BitcoinConfig2 = {
  port: 18444,
  username: 'user',
  password: 'password',
  host: 'localhost'
}

export const testnetConfig: BitcoinConfig = {
  port: 18444,
  user: 'bitcoin',
  pass: 'staging321',
  host: 'localhost',
  network: networks.testnet
}