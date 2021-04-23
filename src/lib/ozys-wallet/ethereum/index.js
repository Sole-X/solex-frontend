"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var web3_1 = __importDefault(require("web3"));
var lodash_1 = require("lodash");
var WalletStore_1 = require("../core/wallet/WalletStore");
var WalletPlatform_1 = require("../core/wallet/WalletPlatform");
var service_1 = require("../constants/service");
var network_1 = require("../constants/network");
var metamask_1 = require("./metamask");
var EthereumWallet = /** @class */ (function (_super) {
    __extends(EthereumWallet, _super);
    function EthereumWallet(props) {
        var _this = _super.call(this) || this;
        _this.name = service_1.CHAIN.ETHEREUM;
        _this.networkList = network_1.getNetwork(_this.name, props.apiKey);
        _this.profileList = service_1.getService(_this.name);
        var defaultNetwork = lodash_1.find(_this.networkList, function (row) {
            return row.id === props.network;
        }) || _this.networkList[0];
        var defaultProfile = lodash_1.find(_this.profileList, function (row) {
            return row.name === props.service || row.name === service_1.EthereumServices.METAMASK;
        }) || {};
        _this._web3 = {};
        _this.wallet = {};
        _this.store = new WalletStore_1.WalletStore({
            account: '',
            network: defaultNetwork,
            profile: defaultProfile,
            providerType: props.providerType
        });
        _this.store.subscribe(function (newState, prevState) {
            var _a, _b, _c, _d;
            if (((_b = (_a = newState) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.id) !== ((_d = (_c = prevState) === null || _c === void 0 ? void 0 : _c.network) === null || _d === void 0 ? void 0 : _d.id)) {
                _this.initWeb3();
            }
        });
        _this.watchingWeb3Status = _this.watchingWeb3Status.bind(_this);
        _this.initWeb3();
        return _this;
    }
    EthereumWallet.prototype.select = function (newProps) {
        var service = newProps.service;
        var prevNetwork = this.store.state.network.id;
        var needChangeNetwork = newProps.network && newProps.network !== prevNetwork;
        var newProfile = service_1.getService(service_1.CHAIN.ETHEREUM).find(function (row) {
            return row.name === service;
        });
        var newState = {
            profile: newProfile,
            providerType: newProps.providerType
        };
        switch (service) {
            case service_1.EthereumServices.METAMASK: {
                if (needChangeNetwork) {
                    newState.network = lodash_1.find(this.networkList, function (row) {
                        return row.id === 1;
                    }) || {};
                }
                this.wallet = new metamask_1.EthereumMetamaskWallet({
                    store: this.store,
                    _web3: this._web3,
                    networkList: this.networkList
                });
                break;
            }
            default: {
                break;
            }
        }
        return this.store.setState(newState);
    };
    EthereumWallet.prototype.access = function (newProps) {
        this.select(newProps);
        return this.wallet.access();
    };
    EthereumWallet.prototype.initWeb3 = function () {
        window.removeEventListener('focus', this.watchingWeb3Status);
        window.removeEventListener('visibilitychange', this.watchingWeb3Status);
        var _state = this.store.state;
        var providerUrl = this.getProviderUrl(this.store, this.providerUrl);
        if (this._web3.currentProvider) {
            this._web3.currentProvider.disconnect && this._web3.currentProvider.disconnect();
        }
        if (_state.providerType === 0) {
            this._web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(providerUrl));
        }
        if (_state.providerType === 1) {
            this._web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(providerUrl));
            window.addEventListener('focus', this.watchingWeb3Status);
            window.addEventListener('visibilitychange', this.watchingWeb3Status);
        }
    };
    EthereumWallet.prototype.getPublicAPI = function () {
        return this._web3;
    };
    EthereumWallet.prototype.getContract = function (params) {
        return new this._web3.eth.Contract(params.abi, params.address);
    };
    EthereumWallet.prototype.getAvailableService = function () {
        return _super.prototype.getAvailableService.call(this, service_1.getEthereumService());
    };
    EthereumWallet.prototype.watchingWeb3Status = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (document.hidden) {
                            return [2 /*return*/];
                        }
                        if (this._web3._provider.connected) {
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
    EthereumWallet.prototype.restartWalletAPI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.reconnectProgress) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, new Promise(function (resolve) {
                        var _state = _this.store.state;
                        var providerUrl = _this.getProviderUrl(_this.store, _this.providerUrl);
                        if (_state.providerType !== 1) {
                            return resolve(false);
                        }
                        _this.reconnectProgress = true;
                        _this._web3.currentProvider && _this._web3.currentProvider.disconnect();
                        _this._web3.setProvider(new web3_1.default.providers.WebsocketProvider(providerUrl), {
                            timeout: 1000 * 5
                        });
                        _this._web3.currentProvider.on('connect', function () {
                            _this.reconnectProgress = false;
                            _this.store.watcher.emit('reconnectSocket');
                            resolve(true);
                        });
                        _this._web3.currentProvider.on('error', function () {
                            _this.reconnectProgress = false;
                            resolve(false);
                        });
                    })];
            });
        });
    };
    EthereumWallet.prototype.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3.eth.getBalance(address).then(function (res) {
                            return res;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EthereumWallet.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3.eth.getBlockNumber().then(function (res) {
                            return Number(res);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return EthereumWallet;
}(WalletPlatform_1.WalletPlatform));
exports.default = EthereumWallet;
//# sourceMappingURL=index.js.map