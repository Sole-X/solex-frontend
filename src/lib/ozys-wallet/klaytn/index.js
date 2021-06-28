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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
var caver_js_1 = __importDefault(require('caver-js'));
var lodash_1 = require('lodash');
var WalletStore_1 = require('../core/wallet/WalletStore');
var WalletPlatform_1 = require('../core/wallet/WalletPlatform');
var service_1 = require('../constants/service');
var network_1 = require('../constants/network');
var klip_1 = require('./klip');
var kaikas_1 = require('./kaikas');
var KlaytnWallet = /** @class */ (function (_super) {
  __extends(KlaytnWallet, _super);
  function KlaytnWallet(props) {
    var _this = _super.call(this) || this;
    _this.name = service_1.CHAIN.KLAYTN;
    _this.providerUrl = props.providerUrl;
    _this.networkList = network_1.getNetwork(_this.name);
    _this.profileList = service_1.getService(_this.name);
    _this.requestUrl = props.requestUrl;
    var defaultNetwork =
      lodash_1.find(_this.networkList, function (row) {
        return row.id === props.network;
      }) || _this.networkList[0];
    var defaultProfile =
      lodash_1.find(_this.profileList, function (row) {
        return row.name === props.service || row.name === service_1.KlaytnServices.KAIKAS;
      }) || {};
    _this._caver = {};
    _this.wallet = {};
    _this.store = new WalletStore_1.WalletStore({
      account: '',
      network: defaultNetwork,
      profile: defaultProfile,
      providerType: props.providerType,
    });
    _this.store.subscribe(function (newState, prevState) {
      var _a, _b, _c, _d;
      if (
        ((_b = (_a = newState) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0
          ? void 0
          : _b.id) !==
        ((_d = (_c = prevState) === null || _c === void 0 ? void 0 : _c.network) === null || _d === void 0
          ? void 0
          : _d.id)
      ) {
        _this.initCaver();
      }
    });
    _this.watchingCaverStatus = _this.watchingCaverStatus.bind(_this);
    _this.initCaver();
    return _this;
  }
  KlaytnWallet.prototype.select = function (newProps) {
    var service = newProps.service,
      otherOptions = newProps.otherOptions;
    var prevNetwork = this.store.state.network.id;
    var needChangeNetwork = newProps.network && newProps.network !== prevNetwork;
    var newProfile = service_1.getService(service_1.CHAIN.KLAYTN).find(function (row) {
      return row.name === service;
    });
    var newState = {
      profile: newProfile,
      providerType: newProps.providerType,
    };
    switch (service) {
      case service_1.KlaytnServices.KLIP: {
        if (needChangeNetwork) {
          newState.network =
            lodash_1.find(this.networkList, function (row) {
              return row.id === 8217;
            }) || {};
        }
        this.wallet = new klip_1.KlaytnKlipWallet({
          store: this.store,
          _caver: this._caver,
          siteName: otherOptions ? otherOptions.siteName : '',
        });
        break;
      }
      default: {
        if (needChangeNetwork) {
          newState.network =
            lodash_1.find(this.networkList, function (row) {
              return row.id === newProps.network;
            }) || {};
        }
        this.wallet = new kaikas_1.KlaytnKaikasWallet({
          store: this.store,
          _caver: this._caver,
          networkList: this.networkList,
          requestUrl: this.requestUrl,
          serviceName: service,
        });
        break;
      }
    }
    return this.store.setState(newState);
  };
  KlaytnWallet.prototype.access = function (newProps) {
    this.select(newProps);
    return this.wallet.access();
  };
  KlaytnWallet.prototype.initCaver = function () {
    window.removeEventListener('focus', this.watchingCaverStatus);
    window.removeEventListener('visibilitychange', this.watchingCaverStatus);
    var _state = this.store.state;
    var providerUrl = this.getProviderUrl(this.store, this.providerUrl);
    if (this._caver.currentProvider) {
      this._caver.currentProvider.disconnect && this._caver.currentProvider.disconnect();
    }
    if (_state.providerType === 0) {
      this._caver = new caver_js_1.default(new caver_js_1.default.providers.HttpProvider(providerUrl));
    }
    if (_state.providerType === 1) {
      this._caver = new caver_js_1.default(new caver_js_1.default.providers.WebsocketProvider(providerUrl));
      window.addEventListener('focus', this.watchingCaverStatus);
      window.addEventListener('visibilitychange', this.watchingCaverStatus);
    }
  };
  KlaytnWallet.prototype.getPublicAPI = function () {
    return this._caver;
  };
  KlaytnWallet.prototype.getContract = function (params) {
    return new this._caver.contract(params.abi, params.address);
  };
  KlaytnWallet.prototype.getAvailableService = function () {
    return _super.prototype.getAvailableService.call(this, service_1.getKlaytnService());
  };
  KlaytnWallet.prototype.watchingCaverStatus = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (document.hidden) {
              return [2 /*return*/];
            }
            if (this._caver._provider.connected) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, this.restartWalletAPI()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  KlaytnWallet.prototype.restartWalletAPI = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        if (this.reconnectProgress) {
          return [2 /*return*/];
        }
        return [
          2 /*return*/,
          new Promise(function (resolve) {
            var _state = _this.store.state;
            var providerUrl = _this.getProviderUrl(_this.store, _this.providerUrl);
            if (_state.providerType !== 1) {
              return resolve(false);
            }
            _this.reconnectProgress = true;
            _this._caver.currentProvider && _this._caver.currentProvider.disconnect();
            _this._caver.setProvider(new caver_js_1.default.providers.WebsocketProvider(providerUrl), {
              timeout: 1000 * 5,
            });
            _this._caver.currentProvider.on('connect', function () {
              _this.reconnectProgress = false;
              _this.store.watcher.emit('reconnectSocket');
              resolve(true);
            });
            _this._caver.currentProvider.on('error', function () {
              _this.reconnectProgress = false;
              resolve(false);
            });
          }),
        ];
      });
    });
  };
  KlaytnWallet.prototype.getBalance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this._caver.rpc.klay.getBalance(address).then(function (res) {
                return _this._caver.utils.hexToNumberString(res);
              }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  KlaytnWallet.prototype.getBlockNumber = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this._caver.rpc.klay.getBlockNumber().then(function (res) {
                return Number(res);
              }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  return KlaytnWallet;
})(WalletPlatform_1.WalletPlatform);
exports.default = KlaytnWallet;
//# sourceMappingURL=index.js.map
