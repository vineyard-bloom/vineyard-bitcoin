import { StatsD } from "hot-shots" 
var dogstatsd = new StatsD();

//Test Metrics
dogstatsd.increment('bitcoin.rpc.getrawtransaction')
dogstatsd.increment('bitcoin.rpc.getblockhash')
dogstatsd.increment('bitcoin.rpc.getblock')
dogstatsd.increment('bitcoin.rpc.getblockcount')
console.log('done')
//check in metrics explorer on datadog
