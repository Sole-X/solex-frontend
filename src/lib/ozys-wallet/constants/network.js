"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
// TODO : 익스플로러 메뉴별 URL 오픈 메소드 추가
exports.getEthereumNetwork = function (key) {
    if (!key) {
        return [];
    }
    return [
        {
            id: 1,
            name: 'Mainnet',
            httpEndpoint: "https://mainnet.infura.io/v3/" + key,
            socketEndpoint: "wss://mainnet.infura.io/ws/v3/" + key,
            explorerUrl: 'https://etherscan.io'
        },
        {
            id: 3,
            name: 'Ropsten Testnet',
            httpEndpoint: "https://ropsten.infura.io/v3/" + key,
            socketEndpoint: "wss://ropsten.infura.io/ws/v3/" + key,
            explorerUrl: 'https://ropsten.etherscan.io'
        }
    ];
};
exports.getKlaytnNetwork = function () { return ([
    {
        id: 8217,
        name: 'Cypress',
        httpEndpoint: 'https://api.cypress.klaytn.net:8651',
        socketEndpoint: 'wss://api.cypress.klaytn.net:8652',
        explorerUrl: 'https://scope.klaytn.com'
    },
    {
        id: 1001,
        name: 'Baobab Testnet',
        httpEndpoint: 'https://api.baobab.klaytn.net:8651',
        socketEndpoint: 'wss://api.baobab.klaytn.net:8652',
        explorerUrl: 'https://baobab.scope.klaytn.com'
    },
]); };
exports.getIconNetwork = function () { return ([
    {
        id: 1,
        name: 'Mainnet',
        httpEndpoint: 'https://ctz.solidwallet.io/api/v3',
        socketEndpoint: '',
        debugEndpoint: 'https://ctz.solidwallet.io/api/debug/v3',
        explorerUrl: 'https://tracker.icon.foundation'
    },
    {
        id: 2,
        name: 'Euljiro Testnet',
        httpEndpoint: 'https://test-ctz.solidwallet.io/api/v3',
        socketEndpoint: '',
        debugEndpoint: 'https://test-ctz.solidwallet.io/api/debug/v3',
        explorerUrl: 'https://trackerdev.icon.foundation'
    },
    {
        id: 3,
        name: 'Yeouido Testnet',
        httpEndpoint: 'https://bicon.net.solidwallet.io/api/v3',
        socketEndpoint: '',
        debugEndpoint: 'https://bicon.net.solidwallet.io/api/debug/v3',
        explorerUrl: 'https://bicon.tracker.solidwallet.io'
    },
    {
        id: 80,
        name: 'Pagoda Testnet',
        httpEndpoint: 'https://zicon.net.solidwallet.io/api/v3',
        socketEndpoint: '',
        debugEndpoint: 'https://zicon.net.solidwallet.io/api/debug/v3',
        explorerUrl: 'https://zicon.tracker.solidwallet.io'
    }
]); };
exports.getNetwork = function (chain, key) {
    if (key === void 0) { key = ''; }
    if (chain === service_1.CHAIN.ETHEREUM) {
        return exports.getEthereumNetwork(key);
    }
    if (chain === service_1.CHAIN.KLAYTN) {
        return exports.getKlaytnNetwork();
    }
    if (chain === service_1.CHAIN.ICON) {
        return exports.getIconNetwork();
    }
    return [];
};
exports.getBlockUrl = function (chain, network, block) {
    if (!block) {
        return network.explorerUrl + "/blocks";
    }
    return network.explorerUrl + "/block/" + block;
};
exports.getTxUrl = function (chain, network, txHash) {
    if (chain === service_1.CHAIN.ICON) {
        if (!txHash) {
            return network.explorerUrl + "/transactions";
        }
        return network.explorerUrl + "/transaction/" + txHash;
    }
    if (!txHash) {
        return network.explorerUrl + "/txs";
    }
    return network.explorerUrl + "/tx/" + txHash;
};
exports.getAccountUrl = function (chain, network, address) {
    if (chain === service_1.CHAIN.ETHEREUM) {
        return network.explorerUrl + "/address/" + address;
    }
    if (chain === service_1.CHAIN.KLAYTN) {
        return network.explorerUrl + "/account/" + address;
    }
    if (chain === service_1.CHAIN.ICON) {
        if (!address) {
            return network.explorerUrl + "/addresses";
        }
        return network.explorerUrl + "/address/" + address;
    }
};
exports.getTokenUrl = function (chain, network, address) {
    if (!address || parseInt(address) === 0) {
        return network.explorerUrl + "/tokens";
    }
    return network.explorerUrl + "/token/" + address;
};
//# sourceMappingURL=network.js.map