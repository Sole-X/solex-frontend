'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var TransactionReceipt = /** @class */ (function () {
  function TransactionReceipt(blockNumber, blockHash, transactionHash, from, to, value) {
    this.blockNumber = blockNumber;
    this.blockHash = blockHash;
    this.transactionHash = transactionHash;
    this.from = from;
    this.to = to;
    this.value = value;
  }
  return TransactionReceipt;
})();
exports.TransactionReceipt = TransactionReceipt;
//# sourceMappingURL=TransactionReceipt.js.map
