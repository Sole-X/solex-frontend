"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalletProvider = /** @class */ (function () {
    function WalletProvider() {
    }
    return WalletProvider;
}());
exports.WalletProvider = WalletProvider;
function getNotInstalledError(profile, appName, siteName) {
    return {
        message: 'not_installed',
        installLink: profile.getInstallURL(appName, siteName)
    };
}
exports.getNotInstalledError = getNotInstalledError;
//# sourceMappingURL=WalletProvider.js.map