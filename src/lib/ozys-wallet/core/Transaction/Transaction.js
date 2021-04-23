"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(method, params, value, from, to) {
        this.method = method;
        this.params = params;
        this.value = value;
        this.from = from;
        this.to = to;
    }
    Transaction.prototype.build = function () {
        return {
            from: this.from,
            to: this.to,
            value: this.value,
            data: ''
        };
    };
    Transaction.prototype.encodeFunction = function () {
        throw Error('Unimplemented method');
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map