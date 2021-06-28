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
/* eslint-disable class-methods-use-this */
var lodash_1 = require('lodash');
var axios_1 = __importDefault(require('axios'));
var WalletProvider_1 = require('../core/wallet/WalletProvider');
var errors_1 = require('../constants/errors');
var promiEvent_1 = require('../utils/promiEvent');
var KlaytnKaikasWallet = /** @class */ (function (_super) {
  __extends(KlaytnKaikasWallet, _super);
  function KlaytnKaikasWallet(props) {
    var _this = _super.call(this) || this;
    _this.name = props.serviceName;
    _this.store = props.store;
    _this._caver = props._caver;
    _this.networkList = props.networkList;
    _this.requestUrl = props.requestUrl;
    return _this;
  }
  KlaytnKaikasWallet.prototype.isInstalled = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, !!(window.klaytn && this.getSelectedProvider())];
      });
    });
  };
  KlaytnKaikasWallet.prototype.getSelectedProvider = function () {
    var provider = this.store.state.profile.provider;
    for (var _i = 0, provider_1 = provider; _i < provider_1.length; _i++) {
      var name_1 = provider_1[_i];
      var _targetProvider = window.klaytn[name_1];
      if (_targetProvider) {
        return _targetProvider;
      }
    }
    return null;
  };
  KlaytnKaikasWallet.prototype.isAvailable = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.isInstalled()];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  KlaytnKaikasWallet.prototype.isUnlocked = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _provider, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _provider = this.getSelectedProvider();
            if (!(_provider && _provider.isUnlocked)) return [3 /*break*/, 2];
            return [4 /*yield*/, _provider.isUnlocked()];
          case 1:
            _a = _b.sent();
            return [3 /*break*/, 3];
          case 2:
            _a = true;
            _b.label = 3;
          case 3:
            return [2 /*return*/, _a];
        }
      });
    });
  };
  KlaytnKaikasWallet.prototype.access = function () {
    var _this = this;
    var _state = this.store.state;
    var eventBus = promiEvent_1.initPromiseEvent();
    this.isAvailable()
      .then(function (isAvailable) {
        if (!isAvailable) {
          eventBus.error(WalletProvider_1.getNotInstalledError(_state.profile, '', ''));
        }
        window.klaytn.enable().then(function (account) {
          var user = Array.isArray(account) ? account[0] : account;
          if (!user) {
            return eventBus.error(new Error(errors_1.WalletErrors.EMPTY_ADDRESS));
          }
          _this.initSubscribe();
          // Kaikas Provider 사용은 Http 모드일때만
          if (_state.providerType === 0) {
            _this._caver.setProvider(window.klaytn);
          }
          _this.store.setState({
            account: user,
            network: lodash_1.find(_this.networkList, function (row) {
              return row.id === window.klaytn.networkVersion;
            }),
          });
          eventBus.finish({
            success: true,
            data: {
              account: user,
              netId: window.klaytn.networkVersion,
            },
          });
        });
      })
      .catch(function (error) {
        eventBus.error(error);
      });
    return eventBus.emitter;
  };
  KlaytnKaikasWallet.prototype.initSubscribe = function () {
    window.klaytn.removeListener('networkChanged', this.subscribeNetwork.bind(this));
    window.klaytn.removeListener('accountsChanged', this.subscribeAccount.bind(this));
    window.klaytn.on('networkChanged', this.subscribeNetwork.bind(this));
    window.klaytn.on('accountsChanged', this.subscribeAccount.bind(this));
    return;
  };
  KlaytnKaikasWallet.prototype.subscribeNetwork = function (netId) {
    this.store.setState({
      network: lodash_1.find(this.networkList, function (row) {
        return row.id === netId;
      }),
    });
    return;
  };
  KlaytnKaikasWallet.prototype.subscribeAccount = function (account) {
    this.store.setState({
      account: Array.isArray(account) ? account[0] : account,
    });
    return;
  };
  KlaytnKaikasWallet.prototype.signTx = function (txParams) {
    return lodash_1.cloneDeep(txParams);
  };
  KlaytnKaikasWallet.prototype.broadcastTx = function (txParams) {
    var eventBus = promiEvent_1.initPromiseEvent();
    var _tx = this.signTx(txParams);
    // 수수료 대납 트랜잭션 처리
    if (txParams.type.startsWith('FEE_DELEGATED')) {
      this.broadcastFeeDelegateTx(txParams, eventBus);
      return eventBus.emitter;
    }
    var _sendTx = function () {
      window.caver.klay
        .sendTransaction(_tx)
        .once('transactionHash', function (txHash) {
          eventBus.txHash(txHash);
        })
        .on('receipt', function (receipt) {
          eventBus.receipt(receipt);
        })
        .on('confirmation', function (confirm, receipt) {
          eventBus.update({
            _event: 'confirmation',
            data: {
              confirm: confirm,
              receipt: receipt,
            },
          });
        })
        .on('error', function (error) {
          eventBus.error(error);
        });
    };
    if (!_tx.gas) {
      window.caver.klay
        .estimateGas(txParams)
        .then(function (res) {
          _tx.gas = res;
          _sendTx();
        })
        .catch(function (error) {
          eventBus.error(error);
        });
    } else {
      _sendTx();
    }
    return eventBus.emitter;
  };
  KlaytnKaikasWallet.prototype.broadcastFeeDelegateTx = function (txParams, eventBus) {
    var _this = this;
    var _tx = this.signTx(txParams);
    var networkId = this.store.state.network.id;
    if (!this.requestUrl[networkId]) {
      eventBus.error(new Error('invalid_request_url'));
      return;
    }
    var _sendTx = function () {
      window.caver.klay
        .signTransaction(_tx)
        .then(function (tx) {
          if (!tx || !tx.rawTransaction) {
            eventBus.error(new Error('sign_failed'));
            return;
          }
          axios_1.default
            .post(_this.requestUrl[networkId], {
              jsonrpc: '2.0',
              id: 1,
              method: 'klay_sendFeeDelegatedRawTransaction',
              params: [tx.rawTransaction],
            })
            .then(function (res) {
              if (res.status !== 200) {
                eventBus.error(new Error('send_failed : ' + res.status));
                return;
              }
              if (res.data.code) {
                eventBus.error(new Error('send_failed : ' + res.data.code));
                return;
              }
              eventBus.txHash(res.data.result);
              _this
                .watchTxReceipt(res.data.result)
                .then(function (receipt) {
                  eventBus.receipt(receipt);
                })
                .catch(function (error) {
                  eventBus.error(error);
                });
            })
            .catch(function (error) {
              eventBus.error(error);
            });
        })
        .catch(function (error) {
          eventBus.error(error);
        });
    };
    if (!_tx.gas) {
      window.caver.klay
        .estimateGas(txParams)
        .then(function (res) {
          _tx.gas = res;
          _sendTx();
        })
        .catch(function (error) {
          eventBus.error(error);
        });
    } else {
      _sendTx();
    }
  };
  KlaytnKaikasWallet.prototype.signMessage = function (msg) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              window.caver.klay
                .sign(msg, window.klaytn.selectedAddress)
                .then(function (sig) {
                  return {
                    success: true,
                    data: sig,
                  };
                })
                .catch(function (error) {
                  return {
                    success: false,
                    error: error,
                  };
                }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  KlaytnKaikasWallet.prototype.callContract = function (to, params, abi) {
    return __awaiter(this, void 0, void 0, function () {
      var contract, method;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            contract = new this._caver.klay.Contract(to, abi);
            method = contract[params.event].apply(contract, params.body);
            return [
              4 /*yield*/,
              method
                .call()
                .then(function (res) {
                  return {
                    success: true,
                    data: res,
                  };
                })
                .catch(function (error) {
                  return {
                    success: false,
                    error: error,
                  };
                }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  KlaytnKaikasWallet.prototype.watchTxReceipt = function (txHash, pollingCount) {
    if (pollingCount === void 0) {
      pollingCount = 15;
    }
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          new Promise(function (resolve, reject) {
            var i = 0;
            var timer = setInterval(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var receipt;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        window.caver.klay
                          .getTransactionReceipt(txHash)
                          .catch(function () {
                            return '';
                          })
                          .finally(function () {
                            i += 1;
                          }),
                      ];
                    case 1:
                      receipt = _a.sent();
                      if (receipt) {
                        clearInterval(timer);
                        resolve(receipt);
                      }
                      if (i === pollingCount) {
                        clearInterval(timer);
                        reject(new Error('PENDING_TIMEOUT'));
                      }
                      return [2 /*return*/];
                  }
                });
              });
            }, 1000);
          }),
        ];
      });
    });
  };
  return KlaytnKaikasWallet;
})(WalletProvider_1.WalletProvider);
exports.KlaytnKaikasWallet = KlaytnKaikasWallet;
//# sourceMappingURL=kaikas.js.map
