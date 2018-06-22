import { BitcoinConfig, BitcoinConfig2 } from "../../src/types"
import { networks } from "bitcoinjs-lib"

export const regtestConfig: BitcoinConfig2 = {
  port: 18332,
  username: 'user',
  password: 'password',
  host: 'localhost'
}

export const testnetConfig: BitcoinConfig = {
  port: 18332,
  user: 'bitcoin',
  pass: 'staging321',
  host: '52.39.29.244',
  network: networks.testnet
}