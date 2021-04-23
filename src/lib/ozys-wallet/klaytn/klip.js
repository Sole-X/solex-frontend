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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var klip_sdk_1 = require("klip-sdk");
var WalletProvider_1 = require("../core/wallet/WalletProvider");
var utils_1 = require("../utils");
var promiEvent_1 = require("../utils/promiEvent");
var errors_1 = require("../constants/errors");
var KlaytnKlipWallet = /** @class */ (function (_super) {
    __extends(KlaytnKlipWallet, _super);
    function KlaytnKlipWallet(props) {
        var _this = _super.call(this) || this;
        _this.name = 'klip';
        _this.store = props.store;
        _this._caver = props._caver;
        _this.siteName = props.siteName;
        _this.maxPollingCount = 60 * (utils_1.isMobile() ? 0.5 : 5); // 모바일 : 30초, 데스크탑 : 5분
        return _this;
    }
    KlaytnKlipWallet.prototype.isInstalled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    KlaytnKlipWallet.prototype.isUnlocked = function () {
        return true;
    };
    KlaytnKlipWallet.prototype.getAvailablePrepareType = function () {
        return Object.keys(klip_sdk_1.prepare);
    };
    KlaytnKlipWallet.prototype.prepare = function (type, body) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, request_key, status, expiration_time;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, klip_sdk_1.prepare[type](__assign({ type: type, bappName: this.siteName }, body)).then(function (res) {
                            if (res.err) {
                                throw res;
                            }
                            return {
                                status: 200,
                                data: res,
                            };
                        }).catch(function (error) { return ({
                            status: -1,
                            error: error,
                        }); })];
                    case 1:
                        res = _b.sent();
                        if (res.status !== 200 || !res.data) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: res.error,
                                }];
                        }
                        _a = res.data, request_key = _a.request_key, status = _a.status, expiration_time = _a.expiration_time;
                        if ([request_key, status, expiration_time].includes(null)) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: new Error(errors_1.WalletErrors.INTERNAL_ERROR),
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    type: type,
                                    requestKey: request_key,
                                    status: status,
                                    expirationTime: expiration_time,
                                },
                            }];
                }
            });
        });
    };
    KlaytnKlipWallet.prototype.requestKlip = function (requestKey) {
        if (utils_1.isMobile()) {
            klip_sdk_1.request(requestKey);
        }
    };
    KlaytnKlipWallet.prototype.pollingGetResult = function (requestKey, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var currentIndex = 0;
                        var polling = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (currentIndex > this.maxPollingCount) {
                                            clearInterval(polling);
                                            resolve({
                                                success: false,
                                                error: new Error(errors_1.WalletErrors.POLLING_TIMEOUT),
                                            });
                                        }
                                        return [4 /*yield*/, klip_sdk_1.getResult(requestKey)];
                                    case 1:
                                        res = _a.sent();
                                        if (res && res.status === 'completed' && res.request_key === requestKey) {
                                            clearInterval(polling);
                                            resolve({
                                                success: true,
                                                data: res
                                            });
                                        }
                                        callback && callback({ currentIndex: currentIndex, res: res });
                                        currentIndex++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                    })];
            });
        });
    };
    KlaytnKlipWallet.prototype.handleAfterPrepare = function (prepareResult, eventBus) {
        return __awaiter(this, void 0, void 0, function () {
            var requestKey, pollingResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!prepareResult.success) {
                            eventBus.error(prepareResult.error);
                            return [2 /*return*/, prepareResult];
                        }
                        requestKey = prepareResult.data.requestKey;
                        eventBus.update({
                            _event: 'requestKey',
                            data: requestKey,
                        });
                        this.requestKlip(requestKey);
                        return [4 /*yield*/, this.pollingGetResult(requestKey, function (params) {
                                eventBus.update({
                                    _event: 'polling',
                                    data: params,
                                });
                            })];
                    case 1:
                        pollingResult = _a.sent();
                        if (!pollingResult.success) {
                            eventBus.error(pollingResult.error);
                        }
                        return [2 /*return*/, pollingResult];
                }
            });
        });
    };
    KlaytnKlipWallet.prototype.access = function () {
        var _this = this;
        var eventBus = promiEvent_1.initPromiseEvent();
        // TODO : 테스트넷
        this.prepare('auth', {}).then(function (prepareResult) { return __awaiter(_this, void 0, void 0, function () {
            var pollingResult, klaytn_address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleAfterPrepare(prepareResult, eventBus)];
                    case 1:
                        pollingResult = _a.sent();
                        if (!pollingResult.success) {
                            // @ts-ignore
                            return [2 /*return*/, eventBus.error(pollingResult.error)];
                        }
                        klaytn_address = pollingResult.data.result.klaytn_address;
                        eventBus.finish({
                            success: true,
                            data: {
                                netId: 8217,
                                account: klaytn_address
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        return eventBus.emitter;
    };
    KlaytnKlipWallet.prototype.signTx = function (txParams) {
        return lodash_1.cloneDeep(txParams);
    };
    KlaytnKlipWallet.prototype.broadcastTx = function (params) {
        var _this = this;
        var eventBus = promiEvent_1.initPromiseEvent();
        var types = this.getAvailablePrepareType();
        if (!params.body) {
            setTimeout(function () {
                eventBus.error(new Error(errors_1.WalletErrors.INVALID_BODY));
            }, 500);
            return eventBus.emitter;
        }
        if (!params._eventName || !lodash_1.find(types, function (type) { return type === params._eventName; })) {
            setTimeout(function () {
                eventBus.error(new Error(errors_1.WalletErrors.INVALID_PREPARE_TYPE));
            }, 500);
            return eventBus.emitter;
        }
        var txParams = this.signTx(params.body);
        this.prepare(params._eventName, {
            from: txParams.from,
            to: txParams.to,
            value: txParams.value,
            abi: txParams.method.abi,
            params: txParams.method.params
        }).then(function (prepareResult) { return __awaiter(_this, void 0, void 0, function () {
            var pollingResult, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleAfterPrepare(prepareResult, eventBus)];
                    case 1:
                        pollingResult = _a.sent();
                        if (!pollingResult.success) {
                            return [2 /*return*/];
                        }
                        txHash = pollingResult.data.result.tx_hash;
                        eventBus.txHash(txHash);
                        this._caver.klay.getTransactionReceipt(txHash).then(function (receipt) {
                            eventBus.receipt(receipt);
                        }).catch(function (error) {
                            eventBus.error(error);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        return eventBus.emitter;
    };
    return KlaytnKlipWallet;
}(WalletProvider_1.WalletProvider));
exports.KlaytnKlipWallet = KlaytnKlipWallet;
//# sourceMappingURL=klip.js.map