'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
var promievent_1 = __importDefault(require('caver-js/packages/caver-utils/promievent'));
exports.initPromiseEvent = function () {
  var _promiseEvent = promievent_1.default(false);
  var eventEmitter = _promiseEvent.eventEmitter,
    resolve = _promiseEvent.resolve;
  eventEmitter.on('__update', function (params) {
    eventEmitter.emit(params._event, params.data);
  });
  eventEmitter.on('__finished', resolve);
  return {
    emitter: eventEmitter,
    update: function (eventParams) {
      eventEmitter.emit('__update', eventParams);
    },
    finish: function (eventParams) {
      eventEmitter.emit('__finished', eventParams);
    },
    error: function (error) {
      this.finish({
        success: false,
        error: error,
      });
      eventEmitter.emit('error', error);
    },
    receipt: function (receipt) {
      this.finish({
        success: receipt.status,
        data: receipt,
      });
      eventEmitter.emit('receipt', receipt);
    },
    txHash: function (txHash) {
      eventEmitter.emit('transactionHash', txHash);
    },
  };
};
//# sourceMappingURL=promiEvent.js.map
