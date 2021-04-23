"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var service_1 = require("./constants/service");
var network_1 = require("./constants/network");
var klaytn_1 = __importDefault(require("./klaytn"));
var icon_1 = __importDefault(require("./icon"));
var ethereum_1 = __importDefault(require("./ethereum"));
bignumber_js_1.default.config({
    EXPONENTIAL_AT: [-100, 100]
});
// TODO : Decorator 활용한 platform or wallet 미선택 대응
var OzysWallet = /** @class */ (function () {
    function OzysWallet(props) {
        this.platform = {};
        this.version = "1.9.1#92089a";
        this.lastProps = {};
        this.initPlatform(props);
    }
    OzysWallet.prototype.initProps = function (props, needInitStore) {
        if (needInitStore === void 0) { needInitStore = false; }
        if (!lodash_1.isEmpty(this.platform) && needInitStore) {
            this.platform.store.clear();
        }
        if (!lodash_1.isEmpty(this.lastProps)) {
            return __assign(__assign({}, this.lastProps), props);
        }
        return props;
    };
    OzysWallet.prototype.initPlatform = function (props) {
        if (!props) {
            throw new Error('invalid_props');
        }
        props = this.initProps(props);
        var chain = props.chain, network = props.network, service = props.service, providerType = props.providerType, providerUrl = props.providerUrl, otherOptions = props.otherOptions, requestUrl = props.requestUrl;
        switch (chain) {
            case service_1.CHAIN.KLAYTN: {
                this.platform = new klaytn_1.default({
                    network: network,
                    service: service,
                    providerType: providerType,
                    providerUrl: providerUrl,
                    requestUrl: requestUrl,
                });
                break;
            }
            case service_1.CHAIN.TERRA: {
                break;
            }
            case service_1.CHAIN.ICON: {
                this.platform = new icon_1.default({
                    network: network,
                    service: service,
                });
                break;
            }
            case service_1.CHAIN.ETHEREUM: {
                this.platform = new ethereum_1.default({
                    network: network,
                    service: service,
                    providerType: providerType,
                    providerUrl: providerUrl,
                    apiKey: otherOptions.apiKey,
                });
                break;
            }
            default: {
                break;
            }
        }
        this.lastProps = props;
        return;
    };
    OzysWallet.prototype.select = function (newProps) {
        newProps = this.initProps(newProps, true);
        this.initPlatform(newProps);
        return this.platform.select(newProps);
    };
    OzysWallet.prototype.access = function (newProps) {
        newProps = this.initProps(newProps);
        if (newProps.chain !== this.platform.name) {
            this.select(newProps);
        }
        return this.platform.access(newProps);
    };
    OzysWallet.prototype.disconnect = function () {
        this.getStore().setState({
            account: ''
        });
    };
    OzysWallet.prototype.getStore = function () {
        return this.platform.store || {};
    };
    OzysWallet.prototype.getPublicAPI = function () {
        if (lodash_1.isEmpty(this.platform)) {
            throw new Error('not_select_platform');
        }
        return this.platform.getPublicAPI();
    };
    OzysWallet.prototype.getAvailableService = function () {
        if (lodash_1.isEmpty(this.platform)) {
            throw new Error('not_select_platform');
        }
        return this.platform.getAvailableService();
    };
    OzysWallet.prototype.subscribe = function (func) {
        if (lodash_1.isEmpty(this.platform)) {
            throw new Error('not_select_platform');
        }
        this.platform.store.subscribe(func);
    };
    OzysWallet.prototype.unsubcribe = function (func) {
        if (lodash_1.isEmpty(this.platform)) {
            throw new Error('not_select_platform');
        }
        this.platform.store.unsubscribe(func);
    };
    OzysWallet.prototype.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (lodash_1.isEmpty(this.platform)) {
                    throw new Error('not_select_platform');
                }
                return [2 /*return*/, this.platform.getBalance(address)];
            });
        });
    };
    OzysWallet.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (lodash_1.isEmpty(this.platform)) {
                    throw new Error('not_select_platform');
                }
                return [2 /*return*/, this.platform.getBlockNumber()];
            });
        });
    };
    OzysWallet.prototype.getContract = function (params) {
        if (lodash_1.isEmpty(this.platform)) {
            throw new Error('not_select_platform');
        }
        return this.platform.getContract(params);
    };
    OzysWallet.prototype.broadcastTx = function (tx) {
        if (lodash_1.isEmpty(this.platform)) {
            return {
                success: false,
                error: new Error('not_select_platform')
            };
        }
        if (lodash_1.isEmpty(this.platform.wallet)) {
            return {
                success: false,
                error: new Error('not_select_wallet')
            };
        }
        return this.platform.wallet.broadcastTx(tx);
    };
    OzysWallet.prototype.getBlockUrl = function (block) {
        return network_1.getBlockUrl(this.platform.name, this.getStore().state.network, block);
    };
    OzysWallet.prototype.getTxUrl = function (txHash) {
        return network_1.getTxUrl(this.platform.name, this.getStore().state.network, txHash);
    };
    OzysWallet.prototype.getAccountUrl = function (address) {
        return network_1.getAccountUrl(this.platform.name, this.getStore().state.network, address);
    };
    OzysWallet.prototype.getTokenUrl = function (address) {
        return network_1.getTokenUrl(this.platform.name, this.getStore().state.network, address);
    };
    return OzysWallet;
}());
exports.default = OzysWallet;
//# sourceMappingURL=index.js.map