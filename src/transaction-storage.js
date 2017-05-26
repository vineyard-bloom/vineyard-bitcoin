"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StandardBlockService = (function () {
    function StandardBlockService() {
    }
    StandardBlockService.prototype.getLastBlock = function () {
        return this.bitcoinCollection.first_or_null()
            .then(function (record) { return record ? record.lastblock : ''; });
    };
    StandardBlockService.prototype.setLastBlock = function (value) {
        var _this = this;
        return this.bitcoinCollection.first_or_null()
            .then(function (record) { return record
            ? _this.bitcoinCollection.update(record, { lastblock: value })
            : _this.bitcoinCollection.create({ lastblock: value }); });
    };
    return StandardBlockService;
}());
exports.StandardBlockService = StandardBlockService;
//# sourceMappingURL=transaction-storage.js.map