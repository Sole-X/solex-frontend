"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observable = /** @class */ (function () {
    function Observable() {
        this.observers = [];
    }
    Observable.prototype.subscribe = function (observer) {
        var _this = this;
        this.observers = __spreadArrays(this.observers, [observer]);
        return function () {
            _this.unsubscribe(observer);
        };
    };
    Observable.prototype.unsubscribe = function (observer) {
        this.observers = this.observers.filter(function (obs) { return observer !== obs; });
        return this.observers;
    };
    Observable.prototype.clear = function () {
        this.observers = [];
        return;
    };
    Observable.prototype.notify = function (newState, prevState) {
        this.observers.forEach(function (observer) { return observer(newState, prevState); });
        return {
            newState: newState,
            prevState: prevState
        };
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=observable.js.map