"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hot_shots_1 = require("hot-shots");
var dogstatsd = new hot_shots_1.StatsD();
//Test Metrics
dogstatsd.increment('bitcoin.rpc.getrawtransaction');
dogstatsd.increment('bitcoin.rpc.getblockhash');
dogstatsd.increment('bitcoin.rpc.getblock');
dogstatsd.increment('bitcoin.rpc.getblockcount');
console.log('done');
//check in metrics explorer on datadog
//# sourceMappingURL=dogtest.js.map