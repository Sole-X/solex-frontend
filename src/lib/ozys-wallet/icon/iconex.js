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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable class-methods-use-this */
var lodash_1 = require("lodash");
var crypto_1 = __importDefault(require("crypto"));
var icon_sdk_js_1 = __importStar(require("icon-sdk-js"));
var WalletProvider_1 = require("../core/wallet/WalletProvider");
var IconTransaction_1 = require("../core/Transaction/IconTransaction");
var promiEvent_1 = require("../utils/promiEvent");
var IconIconexWallet = /** @class */ (function (_super) {
    __extends(IconIconexWallet, _super);
    function IconIconexWallet(props) {
        var _this = _super.call(this) || this;
        _this.name = 'iconex';
        _this.store = props.store;
        _this._sdk = props._sdk;
        _this.networkList = props.networkList;
        _this.txInterface = IconTransaction_1.IconTransaction;
        return _this;
    }
    IconIconexWallet.prototype.isInstalled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    IconIconexWallet.prototype.getSelectedProvider = function () {
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
    IconIconexWallet.prototype.isAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isInstalled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IconIconexWallet.prototype.isUnlocked = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, false];
            });
        });
    };
    // https://www.icondev.io/docs/chrome-extension-connect
    IconIconexWallet.prototype.requestToIconex = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var reqParams = {
                            detail: {
                                type: params.type
                            }
                        };
                        if (params.payload) {
                            reqParams.detail.payload = params.payload;
                        }
                        var onReceiveEvent = function (_a) {
                            var detail = _a.detail;
                            if (detail.type === params.type.replace('REQUEST_', 'RESPONSE_')) {
                                window.removeEventListener('ICONEX_RELAY_RESPONSE', onReceiveEvent);
                                resolve(detail.payload);
                            }
                        };
                        window.addEventListener('ICONEX_RELAY_RESPONSE', onReceiveEvent);
                        var request = new window.CustomEvent('ICONEX_RELAY_REQUEST', reqParams);
                        window.dispatchEvent(request);
                    })];
            });
        });
    };
    IconIconexWallet.prototype.access = function () {
        var _this = this;
        var eventBus = promiEvent_1.initPromiseEvent();
        this.requestToIconex({
            type: 'REQUEST_ADDRESS'
        }).then(function (res) {
            eventBus.finish({
                success: true,
                data: res
            });
            _this.store.setState({
                account: res
            });
        }).catch(function (error) {
            eventBus.error(error);
        });
        return eventBus.emitter;
    };
    IconIconexWallet.prototype.initSubscribe = function () {
    };
    IconIconexWallet.prototype.subscribeNetwork = function (netId) {
        this.store.setState({
            network: lodash_1.find(this.networkList, function (row) {
                return row.id === netId;
            })
        });
        return;
    };
    IconIconexWallet.prototype.subscribeAccount = function (account) {
        this.store.setState({
            account: account
        });
        return;
    };
    IconIconexWallet.prototype.estimateStep = function (from, to, method, value, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var network, transaction, sdkForDebug;
            return __generator(this, function (_a) {
                network = this.store.state.network;
                transaction = {
                    jsonrpc: '2.0',
                    method: 'debug_estimateStep',
                    id: 1,
                    params: {
                        version: '0x3',
                        from: from,
                        to: to,
                        value: icon_sdk_js_1.IconConverter.toHex(icon_sdk_js_1.IconConverter.toBigNumber(value)),
                        timestamp: icon_sdk_js_1.IconConverter.toHex(new Date().valueOf()),
                        nid: icon_sdk_js_1.IconConverter.toHex(icon_sdk_js_1.IconConverter.toBigNumber(network.id)),
                        nonce: '0x1',
                        dataType: 'call',
                        data: {
                            method: method,
                            params: params
                        }
                    }
                };
                sdkForDebug = new icon_sdk_js_1.default(new icon_sdk_js_1.default.HttpProvider(network.debugEndpoint));
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = sdkForDebug.provider.request(transaction).execute();
                            resolve(result);
                        }
                        catch (err) {
                            reject(err);
                        }
                    })];
            });
        });
    };
    IconIconexWallet.prototype.serializeTx = function (params, type) {
        var serializedMessage = type === IconTransaction_1.IconTransaction.TxType.CALL ? 'icx_call.' : 'icx_sendTransaction.';
        for (var key in params) {
            var value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
            serializedMessage += key + "." + value;
        }
        return crypto_1.default.createHash('sha256').update(serializedMessage).digest().toString('hex');
    };
    IconIconexWallet.prototype.signTx = function (_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, account, network, _b, CALL, SEND, type, value, method, params, stepLimit, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.store.state, account = _a.account, network = _a.network;
                        _b = IconTransaction_1.IconTransaction.TxType, CALL = _b.CALL, SEND = _b.SEND;
                        type = _tx.type || IconTransaction_1.IconTransaction.TxType.NORMAL;
                        value = _tx.value || '0';
                        method = _tx.method || '';
                        params = _tx.params || {};
                        stepLimit = '150000';
                        if (!(_tx.type === CALL || SEND)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.estimateStep(account, _tx.to, method, value, params).then(function (res) {
                                return String(res);
                            }).catch(function () {
                                return stepLimit;
                            })];
                    case 1:
                        stepLimit = _c.sent();
                        _c.label = 2;
                    case 2:
                        result = new IconTransaction_1.IconTransaction(type, account, _tx.to || '', value, _tx.data || '', icon_sdk_js_1.IconConverter.toHex(network.id), stepLimit, method, params).build();
                        return [2 /*return*/, {
                                body: result,
                                message: this.serializeTx(result, type)
                            }];
                }
            });
        });
    };
    IconIconexWallet.prototype.broadcastTx = function (txParams) {
        var _this = this;
        var eventBus = promiEvent_1.initPromiseEvent();
        this.signTx(txParams).then(function (_tx) {
            var scoreCall = txParams.type === IconTransaction_1.IconTransaction.TxType.CALL;
            var rpcMethod = scoreCall ? 'icx_call' : 'icx_sendTransaction';
            var rpcParams = scoreCall ? _tx.body : icon_sdk_js_1.IconConverter.toRawTransaction(_tx.body);
            // console.log('build tx : ', _tx.body);
            // console.log('to rawTx : ', IconConverter.toRawTransaction(_tx.body));
            _this.requestToIconex({
                type: 'REQUEST_JSON-RPC',
                payload: {
                    id: new Date().valueOf(),
                    jsonrpc: '2.0',
                    method: rpcMethod,
                    params: rpcParams
                }
            }).then(function (res) {
                eventBus.finish({
                    success: true,
                    data: res
                });
            }).catch(function (error) {
                eventBus.error(error);
            });
        });
        return eventBus.emitter;
    };
    IconIconexWallet.prototype.signMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestToIconex({
                            type: 'REQUEST_SIGNING',
                            payload: {
                                from: this.store.state.account,
                                hash: msg
                            }
                        }).then(function (sig) { return ({
                            success: true,
                            data: sig
                        }); }).catch(function (error) { return ({
                            success: false,
                            error: error
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return IconIconexWallet;
}(WalletProvider_1.WalletProvider));
exports.IconIconexWallet = IconIconexWallet;
//# sourceMappingURL=iconex.js.map