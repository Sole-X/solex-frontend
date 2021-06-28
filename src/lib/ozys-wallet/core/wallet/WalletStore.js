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
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var lodash_1 = require('lodash');
var eventemitter3_1 = __importDefault(require('eventemitter3'));
var observable_1 = require('../../utils/observable');
var WalletStore = /** @class */ (function (_super) {
  __extends(WalletStore, _super);
  function WalletStore(props) {
    var _this = _super.call(this) || this;
    _this.state = {
      account: props.account,
      network: props.network,
      profile: props.profile,
      providerType: props.providerType,
    };
    _this.watcher = new eventemitter3_1.default();
    return _this;
  }
  WalletStore.prototype.clear = function () {
    this.watcher.removeAllListeners();
    _super.prototype.clear.call(this);
  };
  WalletStore.prototype.setState = function (nextState, callback) {
    if (nextState === void 0) {
      nextState = {};
    }
    var prevState = lodash_1.cloneDeep(this.state);
    this.state = __assign(__assign({}, this.state), nextState);
    this.notify(this.state, prevState);
    callback && callback(this.state, prevState);
  };
  return WalletStore;
})(observable_1.Observable);
exports.WalletStore = WalletStore;
//# sourceMappingURL=WalletStore.js.map
