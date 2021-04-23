import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import platform from 'platform'

import ModalStore from '@/store/modules/ModalStore'
import MarketStore from '@/store/modules/MarketStore'
import UserStore from '@/store/modules/UserStore'
import AssetStore from '@/store/modules/AssetStore'
import ExplorerStore from '@/store/modules/ExplorerStore'
import TxStore from '@/store/modules/TxStore'
import SearchStore from '@/store/modules/SearchStore'
import StakingStore from '@/store/modules/StakingStore'
import KlipStore from '@/store/modules/KlipStore'

import { WhitelistNft, WhitelistToken } from '@/model/TokenModel'
import { getBrowser, _checkIsMobile } from '@/utils/common'

Vue.use(Vuex)

const lang = navigator.language || navigator.userLanguage
const defaultLang = lang === 'ko' || lang.indexOf('ko-') !== -1 ? 'ko' : 'en'

export const getDefaultState = () => ({
  windowInfo: {
    width: 0,
    height: 0,
    scrollTop: 0,
    prevScroll: 0,
    isActive: true,
    isSmall: false
  },
  platformInfo: {
    ...platform,
    checkNotice: false,
    browser: getBrowser(),
    isMobile: _checkIsMobile()
  },
  userLang: defaultLang,
  loadingStatus: {},
  supportCurrency: [],
  supportNft: [],
  chainInfo: {
    // 지갑 미연결시 default로 'KLAYTN' 사용. 메타마스크 로그인시 동적 변경할 것.
    chain: 'KLAYTN',
    network: {},
    block: {
      number: 0,
      receivedAt: 0,
      timestamp: 0
    }
  },
  networkHealth: 200,
  accessType: '',
  tradingFee: '0'
})

let RootStore = {}
let vuexOptions = {
  state() {
    return getDefaultState()
  },
  modules: {
    modal: ModalStore,
    user: UserStore,
    market: MarketStore,
    asset: AssetStore,
    explorer: ExplorerStore,
    tx: TxStore,
    search: SearchStore,
    staking: StakingStore,
    klip: KlipStore
  },
  mutations: {
    SET_WINDOW_INFO(state, payload) {
      state.windowInfo = {
        ...state.windowInfo,
        ...payload
      }
    },

    SET_USER_LANG(state, payload) {
      state.userLang = payload
    },

    SET_LOADING_STATUS(state, payload) {
      state.loadingStatus = {
        ...state.loadingStatus,
        ...payload
      }
    },

    SET_CHAIN_INFO(state, payload) {
      state.chainInfo = {
        ...state.chainInfo,
        ...payload
      }
    },

    SET_NETWORK_HEALTH(state, payload) {
      state.networkHealth = {
        ...state.networkHealth,
        ...payload
      }
    },

    SET_SUPPORT_NFT(state, payload) {
      state.supportNft = payload
    },

    SET_SUPPORT_CURRENCY(state, payload) {
      state.supportCurrency = payload
    },

    SET_ACCESS_TYPE(state, payload) {
      state.accessType = payload
    },

    SET_TRADING_FEE(state, payload) {
      state.tradingFee = payload
    },

    CLEAR_CURRENCY_BALANCE(state) {
      const newCurrencies = _.cloneDeep(state.supportCurrency)

      for(const currency of newCurrencies) {
        currency.balance = '0'
        currency.deposit = '0'
        currency.onTrade = '0'
        currency.totalDeposit = '0'
        currency.staking = '0'
        currency.unstaking = '0'
      }

      state.supportCurrency = newCurrencies
    }
  },
  actions: {
    setWindowInfo({commit}, payload) {
      if(payload.width) {
        payload.isSmall = payload.width < 1000
      }

      commit('SET_WINDOW_INFO', payload)
    },

    setUserLang({commit}, payload) {
      commit('SET_USER_LANG', payload)
    },

    setLoadingStatus({commit}, payload) {
      commit('SET_LOADING_STATUS', payload)
    },

    setChainInfo({commit}, payload) {
      commit('SET_CHAIN_INFO', payload)
    },

    setNetworkHealth({commit}, payload) {
      commit('SET_NETWORK_HEALTH', payload)
    },

    // TODO : API, Contract
    async setWhitelist({commit}) {
      const res = await this.$app.$http.get('getWhitelistTokens')

      if(res.success) {
        const newNft = _.map(res.info.nfts, token => {
          return new WhitelistNft(token)
        })
        const newToken = _.map(res.info.tokens, token => {
          return new WhitelistToken(token)
        })

        commit('SET_SUPPORT_NFT', newNft)
        commit('SET_SUPPORT_CURRENCY', newToken)
        commit('SET_TRADING_FEE', String(res.info.fee))
      }

      return res
    },

    setAccessType({commit}, payload) {
      commit('SET_ACCESS_TYPE', payload)
    }
  },
  getters: {
    getRootVue() {
      return RootStore.$app
    },

    getWindowInfo(state) {
      return state.windowInfo
    },

    getPlatformInfo(state) {
      return state.platformInfo
    },

    getLoadingStatus(state) {
      return state.loadingStatus
    },

    getSupportCurrency(state, getters) {
      return state.supportCurrency
    },

    getSupportNft(state, getters) {
      return state.supportNft
    },

    getChainInfo(state) {
      return state.chainInfo
    },

    getNetworkHealth(state) {
      return state.networkHealth
    },

    getEnableTestNet(state) {
      return true
    },

    getAccessType(state) {
      return state.accessType
    },

    getTradingFee(state) {
      return state.tradingFee
    }
  },
  plugins: []
}

if(window.navigator.cookieEnabled) {
  const storageName = 'solex_1.0'

  vuexOptions.plugins.push(
    new createPersistedState({
      key: storageName,
      paths: [
        'userLang'
      ],
      getState: () => {
        const defaultState = getDefaultState()

        if(localStorage.getItem(storageName)) {
          const snapshotState = JSON.parse(localStorage.getItem(storageName))

          for(const key in snapshotState) {
            if(defaultState[key]) {
              defaultState[key] = snapshotState[key]
            }
          }
        }

        return defaultState
      }
    })
  )
}

RootStore = new Vuex.Store(vuexOptions)
export default RootStore
