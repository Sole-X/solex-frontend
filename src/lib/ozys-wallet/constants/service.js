"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('../utils'), isMobile = _a.isMobile, isIOS = _a.isIOS, isAndroid = _a.isAndroid;
var CHAIN;
(function (CHAIN) {
    CHAIN["ETHEREUM"] = "ETHEREUM";
    CHAIN["KLAYTN"] = "KLAYTN";
    CHAIN["TERRA"] = "TERRA";
    CHAIN["ICON"] = "ICON";
})(CHAIN = exports.CHAIN || (exports.CHAIN = {}));
var EthereumServices;
(function (EthereumServices) {
    EthereumServices["METAMASK"] = "metamask";
})(EthereumServices = exports.EthereumServices || (exports.EthereumServices = {}));
var KlaytnServices;
(function (KlaytnServices) {
    KlaytnServices["KAIKAS"] = "kaikas";
    KlaytnServices["KLIP"] = "klip";
    KlaytnServices["DCENT"] = "dcent";
})(KlaytnServices = exports.KlaytnServices || (exports.KlaytnServices = {}));
var IconServices;
(function (IconServices) {
    IconServices["ICONEX"] = "iconex";
})(IconServices = exports.IconServices || (exports.IconServices = {}));
exports.getEthereumService = function () { return ([
    {
        name: 'metamask',
        label: 'metamask',
        provider: ['_metamask'],
        platform: ['desktop', 'mobile'],
        useProvider: true,
        getInstallURL: function (appName, siteName) {
            if (appName === void 0) { appName = ''; }
            if (siteName === void 0) { siteName = ''; }
            return 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
        },
    }
]); };
exports.getKlaytnService = function () { return ([
    {
        name: 'kaikas',
        label: 'Kaikas',
        provider: ['_kaikas'],
        platform: ['desktop'],
        useProvider: true,
        getInstallURL: function (appName, siteName) {
            if (appName === void 0) { appName = ''; }
            if (siteName === void 0) { siteName = ''; }
            return 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi';
        },
    },
    {
        name: 'dcent',
        label: 'D\'CENT',
        provider: ['_dcent'],
        platform: ['mobile'],
        useProvider: true,
        getInstallURL: function (appName, siteName, _origin) {
            if (appName === void 0) { appName = ''; }
            if (siteName === void 0) { siteName = ''; }
            if (_origin === void 0) { _origin = ''; }
            return "https://link.dcentwallet.com/DAppBrowser/?url=" + _origin + "&network=klaytn-mainnet";
        }
    },
    {
        name: 'klip',
        label: 'Klip',
        provider: [],
        platform: ['desktop', 'mobile'],
        useProvider: false,
        getInstallURL: function (appName, siteName) {
            if (appName === void 0) { appName = ''; }
            if (siteName === void 0) { siteName = ''; }
            if (!isMobile()) {
                return '-';
            }
            if (isIOS()) {
                return 'https://apps.apple.com/kr/app/카카오톡-kakaotalk/id362057947';
            }
            if (isAndroid()) {
                return 'https://play.google.com/store/apps/details?id=com.kakao.talk&hl=ko&gl=US';
            }
            return '-';
        },
    },
]); };
exports.getIconService = function () { return ([
    {
        name: 'iconex',
        label: 'ICONex',
        provider: [],
        platform: ['desktop'],
        useProvider: false,
        getInstallURL: function (appName, siteName) {
            if (appName === void 0) { appName = ''; }
            if (siteName === void 0) { siteName = ''; }
            return 'https://chrome.google.com/webstore/detail/iconex/flpiciilemghbmfalicajoolhkkenfel';
        },
    },
]); };
exports.getService = function (chain) {
    if (chain === CHAIN.ETHEREUM) {
        return exports.getEthereumService();
    }
    if (chain === CHAIN.KLAYTN) {
        return exports.getKlaytnService();
    }
    if (chain === CHAIN.ICON) {
        return exports.getIconService();
    }
    return [];
};
//# sourceMappingURL=service.js.map