"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hot_shots_1 = require("hot-shots");
var dogstatsd = new hot_shots_1.StatsD();
//Distribute metrics
dogstatsd.distribution('bitcoin.rpc.getrawtransaction', 0);
dogstatsd.distribution('bitcoin.rpc.getblockhash', 0);
dogstatsd.distribution('bitcoin.rpc.getblock', 0);
dogstatsd.distribution('bitcoin.rpc.getblockcount', 0);
console.log('done distributing metrics');
//check in metrics explorer on datadog
//# sourceMappingURL=datadogdistribution.js.map