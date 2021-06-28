'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
var icon_sdk_js_1 = require('icon-sdk-js');
var Transaction_1 = require('./Transaction');
var IconTransaction = /** @class */ (function (_super) {
  __extends(IconTransaction, _super);
  function IconTransaction(type, from, to, value, data, nid, stepLimit, method, params) {
    var _this = _super.call(this, method, params, value, from, to) || this;
    _this.type = type;
    _this.from = from;
    _this.to = to;
    _this.value = value;
    _this.data = data;
    _this.nid = nid;
    _this.stepLimit = stepLimit;
    _this.method = method;
    _this.params = params;
    _this.nonce = '0x1';
    _this.version = '0x3';
    return _this;
  }
  IconTransaction.prototype.getIcxTimestamp = function () {
    return new Date().getTime() * 1000;
  };
  IconTransaction.prototype.build = function () {
    var tx = _super.prototype.build.call(this);
    var valueToIcx = icon_sdk_js_1.IconAmount.of(tx.value, icon_sdk_js_1.IconAmount.Unit.ICX).toLoop();
    var result = {};
    switch (this.type) {
      case IconTransaction.TxType.NORMAL: {
        result = new icon_sdk_js_1.IconBuilder.IcxTransactionBuilder()
          .from(tx.from)
          .to(tx.to)
          .value(icon_sdk_js_1.IconConverter.toHex(valueToIcx))
          .stepLimit(this.stepLimit)
          .nid(icon_sdk_js_1.IconConverter.toHex(icon_sdk_js_1.IconConverter.toBigNumber(this.nid)))
          .nonce(this.nonce)
          .version(this.version)
          .timestamp(this.getIcxTimestamp())
          .build();
        break;
      }
      case IconTransaction.TxType.CALL: {
        result = new icon_sdk_js_1.IconBuilder.CallBuilder().from(null).to(tx.to).method(this.method);
        if (Object.keys(this.params).length !== 0) {
          result = result.params(this.params);
        }
        result = result.build();
        break;
      }
      case IconTransaction.TxType.SEND: {
        result = new icon_sdk_js_1.IconBuilder.CallTransactionBuilder()
          .from(tx.from)
          .to(tx.to)
          .value(icon_sdk_js_1.IconConverter.toHex(valueToIcx))
          .stepLimit(this.stepLimit)
          .nid(icon_sdk_js_1.IconConverter.toHex(icon_sdk_js_1.IconConverter.toBigNumber(this.nid)))
          .nonce(this.nonce)
          .version(this.version)
          .timestamp(this.getIcxTimestamp())
          .method(this.method);
        // contract method parameters
        if (Object.keys(this.params).length !== 0) {
          result = result.params(this.params);
        }
        result = result.build();
        break;
      }
      case IconTransaction.TxType.DEPLOY: {
        result = new icon_sdk_js_1.IconBuilder.DeployTransactionBuilder()
          .from(tx.from)
          .to('cx0000000000000000000000000000000000000000')
          .stepLimit(icon_sdk_js_1.IconConverter.toBigNumber('3000000000'))
          .nid(icon_sdk_js_1.IconConverter.toBigNumber(this.nid))
          .nonce(this.nonce)
          .version(this.version)
          .timestamp(this.getIcxTimestamp())
          .contentType('application/zip')
          .content(this.data); // contract byte code
        // contract constructor parameters
        if (Object.keys(this.params).length !== 0) {
          result = result.params(this.params);
        }
        result = result.build();
        break;
      }
      case IconTransaction.TxType.MESSAGE: {
        result = new icon_sdk_js_1.IconBuilder.MessageTransactionBuilder()
          .from(tx.from)
          .to(tx.to)
          .value(icon_sdk_js_1.IconConverter.toHex(valueToIcx))
          .stepLimit(this.stepLimit)
          .nid(icon_sdk_js_1.IconConverter.toHex(icon_sdk_js_1.IconConverter.toBigNumber(this.nid)))
          .nonce(this.nonce)
          .version(this.version)
          .timestamp(this.getIcxTimestamp())
          .data(this.data) // hashed message
          .build();
        break;
      }
      default: {
        break;
      }
    }
    return result;
  };
  return IconTransaction;
})(Transaction_1.Transaction);
exports.IconTransaction = IconTransaction;
(function (IconTransaction) {
  var TxType;
  (function (TxType) {
    TxType['NORMAL'] = 'normal';
    TxType['MESSAGE'] = 'message';
    TxType['DEPLOY'] = 'deploy';
    TxType['CALL'] = 'call';
    TxType['SEND'] = 'send'; // 이더로 치면 contract.send()
  })((TxType = IconTransaction.TxType || (IconTransaction.TxType = {})));
})((IconTransaction = exports.IconTransaction || (exports.IconTransaction = {})));
exports.IconTransaction = IconTransaction;
//# sourceMappingURL=IconTransaction.js.map
