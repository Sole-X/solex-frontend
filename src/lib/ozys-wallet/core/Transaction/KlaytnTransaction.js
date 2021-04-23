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
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("./Transaction");
var KlaytnTransaction = /** @class */ (function (_super) {
    __extends(KlaytnTransaction, _super);
    function KlaytnTransaction(type, method, params, value, from, to, data, abi) {
        var _this = _super.call(this, method, params, value, from, to) || this;
        _this.type = type;
        _this.method = method;
        _this.params = params;
        _this.value = value;
        _this.from = from;
        _this.to = to;
        _this.data = data;
        _this.abi = abi;
        return _this;
    }
    KlaytnTransaction.prototype.build = function () {
        var result = _super.prototype.build.call(this);
        result.type = this.type;
        if (this.abi) {
            result.data = this.encodeFunction();
        }
        return result;
    };
    KlaytnTransaction.prototype.encodeFunction = function () {
        return '';
    };
    return KlaytnTransaction;
}(Transaction_1.Transaction));
exports.KlaytnTransaction = KlaytnTransaction;
(function (KlaytnTransaction) {
    var TxType;
    (function (TxType) {
        TxType["legacy"] = "LEGACY";
        TxType["valueTransfer"] = "VALUE_TRANSFER";
        TxType["valueTransferMemo"] = "VALUE_TRANSFER_MEMO";
        TxType["feeDelegatedValueTransfer"] = "FEE_DELEGATED_VALUE_TRANSFER";
        TxType["feeDelegatedValueTransferWithRatio"] = "FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO";
        TxType["accountUpdate"] = "ACCOUNT_UPDATE";
        TxType["feeDelegatedAccountUpdate"] = "FEE_DELEGATED_ACCOUNT_UPDATE";
        TxType["feeDelegatedAccountUpdateWithRatio"] = "FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO";
        TxType["smartContractDeploy"] = "SMART_CONTRACT_DEPLOY";
        TxType["feeDelegatedSmartContractDeploy"] = "FEE_DELEGATED_SMART_CONTRACT_DEPLOY";
        TxType["feeDelegatedSmartContractDeployWithRatio"] = "FEE_DELEGATED_SMART_CONTRACT_DEPLOY_WITH_RATIO";
        TxType["smartContractExecution"] = "SMART_CONTRACT_EXECUTION";
        TxType["feeDelegatedSmartContractExecution"] = "FEE_DELEGATED_SMART_CONTRACT_EXECUTION";
        TxType["feeDelegatedSmartContractExecutionWithRatio"] = "FEE_DELEGATED_SMART_CONTRACT_EXECUTION_WITH_RATIO";
        TxType["cancel"] = "CANCEL";
        TxType["feeDelegatedCancel"] = "FEE_DELEGATED_CANCEL";
        TxType["feeDelegatedCancelWithRatio"] = "FEE_DELEGATED_CANCEL_WITH_RATIO";
    })(TxType = KlaytnTransaction.TxType || (KlaytnTransaction.TxType = {}));
})(KlaytnTransaction = exports.KlaytnTransaction || (exports.KlaytnTransaction = {}));
exports.KlaytnTransaction = KlaytnTransaction;
//# sourceMappingURL=KlaytnTransaction.js.map