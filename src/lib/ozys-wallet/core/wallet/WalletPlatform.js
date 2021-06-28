'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var lodash_1 = require('lodash');
var utils_1 = require('../../utils');
var WalletPlatform = /** @class */ (function () {
  function WalletPlatform() {
    this.reconnectProgress = false;
  }
  WalletPlatform.prototype.getAvailableService = function (serviceList) {
    var _isMobile = utils_1.isMobile();
    return lodash_1.filter(serviceList, function (service) {
      if (_isMobile) {
        return service.platform.includes('mobile');
      }
      return service.platform.includes('desktop');
    });
  };
  WalletPlatform.prototype.getProviderUrl = function (store, providerUrl) {
    var _state = store.state;
    var networkId = _state.network.id;
    if (_state.providerType === 0) {
      return providerUrl ? providerUrl[networkId] : _state.network.httpEndpoint;
    }
    if (_state.providerType === 1) {
      return providerUrl ? providerUrl[networkId] : _state.network.socketEndpoint;
    }
    return '';
  };
  return WalletPlatform;
})();
exports.WalletPlatform = WalletPlatform;
//# sourceMappingURL=WalletPlatform.js.map
