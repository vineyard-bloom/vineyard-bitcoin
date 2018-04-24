"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["pending"] = 0] = "pending";
    TransactionStatus[TransactionStatus["accepted"] = 1] = "accepted";
    TransactionStatus[TransactionStatus["rejected"] = 2] = "rejected";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
exports.Defaults = {
    TRANSACTION_CHUNK_SIZE: 10
};
//# sourceMappingURL=types.js.map