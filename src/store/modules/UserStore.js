import { NftInfo } from '@/model/MarketModel'
import { AssetOfUser, AssetBuyOffer, AssetSaleOffer } from '@/model/AssetModel'
import { UserActivity } from '@/model/UserModel'

export const getDefaultState = () => ({
  userInfo: {
    address: '',
    username: '',
    display: 1,
    profile: {}
  },
  userBalance: {
    nft: [],
    currency: []
  },
  userDeposited: {
    nftCnt: 0,
    tokens: []
  },
  userBuyOrders: [],
  userSellOrders: {
    normal: [],
    auction: []
  },
  userWatchlist: {
    recent: {
      page: 1,
      maxPage: 1,
      list: [],
      total: 0
    },
    liked: {
      page: 1,
      maxPage: 1,
      list: [],
      total: 0
    }
  },
  userWatchlistFilters: {
    keyword: '',
    searchedKeyword: [],
    status: ''
  },
  userItems: [],
  userItemFilters: {
    keyword: '',
    searchedKeyword: [],
    status: ''
  },
  userActivities: {
    currency: {
      page: 1,
      maxPage: 1,
      list: [],
      total: 0
    },
    nft: {
      page: 1,
      maxPage: 1,
      list: [],
      total: 0
    }
  },
  userActivityFilters: {
    keyword: '',
    searchedKeyword: [],
    status: ''
  },
  userBalanceWatcher: null,
  offerItem: {}
})

export default {
  state() {
    return getDefaultState()
  },
  mutations: {
    SET_USER_INFO(state, payload) {
      state.userInfo = {
        ...state.userInfo,
        ...payload
      }
    },

    CLEAR_USER_INFO(state) {
      const defaultState = getDefaultState()

      state.userInfo = defaultState.userInfo
      state.userBalance = defaultState.userBalance
      state.userWatchlist = defaultState.userWatchlist
      state.userBuyOrders = defaultState.userBuyOrders
      state.userSellOrders = defaultState.userSellOrders
      state.userItems = defaultState.userItems
    },

    SET_USER_BALANCE(state, payload) {
      state.userBalance = {
        ...state.userBalance,
        ...payload
      }
    },

    CLEAR_USER_DEPOSITED(state) {
      state.userDeposited = _.cloneDeep(getDefaultState().userDeposited);
    },

    SET_USER_DEPOSITED(state, payload) {
      state.userDeposited = {
        ...state.userDeposited,
        ...payload
      }
    },

    SET_USER_WATCHLIST(state, payload) {
      state.userWatchlist = {
        ...state.userWatchlist,
        ...payload
      }
    },

    SET_USER_WATCHLIST_FILTERS(state, payload) {
      state.userWatchlistFilters = {
        ...state.userWatchlistFilters,
        ...payload
      }
    },

    CLEAR_USER_WATCHLIST(state) {
      const defaultState = getDefaultState()

      state.userWatchlist = defaultState.userWatchlist
      state.userWatchlistFilters = defaultState.userWatchlistFilters
    },

    SET_USER_ITEMS(state, payload) {
      state.userItems = payload
    },

    CLEAR_USER_ITEMS(state) {
      const defaultState = getDefaultState()

      state.userItems = defaultState.userItems
      state.userItemFilters = defaultState.userItemFilters
    },

    SET_USER_ITEM_FILTERS(state, payload) {
      state.userItemFilters = {
        ...state.userItemFilters,
        ...payload
      }
    },

    SET_USER_ACTIVITIES(state, payload) {
      state.userActivities = {
        ...state.userActivities,
        ...payload
      }
    },

    SET_USER_ACTIVITY_FILTERS(state, payload) {
      state.userActivityFilters = {
        ...state.userActivityFilters,
        ...payload
      }
    },

    CLEAR_USER_ACTIVITIES(state) {
      const defaultState = getDefaultState()

      state.userActivities = defaultState.userActivities
      state.userActivityFilters = defaultState.userActivityFilters
    },

    SET_USER_BALANCE_WATCHER(state, payload) {
      state.userBalanceWatcher = payload
    },

    CLEAR_USER_BALANCE_WATCHER(state) {
      state.userBalanceWatcher && clearInterval(state.userBalanceWatcher)
    },

    SET_USER_BUY_ORDERS(state, payload) {
      state.userBuyOrders = payload
    },

    SET_USER_SELL_ORDERS(state, payload) {
      state.userSellOrders = payload
    },

    SET_OFFER_ITEM(state, payload) {
      state.offerItem = _.cloneDeep(payload);
    }
  },
  actions: {
    async login({commit, dispatch}, payload) {
      const _vm = this.$app
      const connectRequest = await _vm.$wallet.connectToService(payload)
      const user = connectRequest.data.account

      if(connectRequest.success) {
        commit('SET_USER_INFO', {
          address: user
        })
        commit('SET_ACCESS_TYPE', payload.service)

        dispatch('initCoreInfoOfUser')
      }

      return connectRequest
    },

    async logout({commit}) {
      this.$app.$wallet.disconnectWallet()

      commit('CLEAR_USER_INFO')
      commit('CLEAR_CURRENCY_BALANCE')
      commit('CLEAR_USER_BALANCE_WATCHER')
    },

    async setUserInfo({commit, state}) { // TODO : API, 데이터 구조화 및 응답 체크
      const res = await this.$app.$http.get('getUserInfo', {
        urlParams: {
          user: state.userInfo.address
        }
      })

      if(res.success) {
        commit('SET_USER_INFO', {
          display: res.info.display,
          profile: res.info.profile,
          username: res.info.username
        })
      }

      return res
    },

    async setUserDeposited({commit, state, getters}) { // TODO : API, 데이터 구조화 및 응답 체크
      const res = await this.$app.$http.get('getUserDeposited', {
        urlParams: {
          user: state.userInfo.address
        }
      })

      if(res.success) {
        commit('CLEAR_USER_DEPOSITED');
        const newState = {
          nftCnt: res.info.nftCnt,
          tokens: _.map(res.info.tokens, row => {
            return new AssetOfUser(row)
          })
        }

        const newCurrencyInfo = _.cloneDeep(getters.getSupportCurrency)

        for(let i = 0; i < newCurrencyInfo.length; i++) {
          const currency = newCurrencyInfo[i]
          const depositInfo = _.find(newState.tokens, row => {
            return this.$app.$wallet.isSameAddress(currency.addressToReserve, row.tokenAddr.KLAYTN)
          })

          if(depositInfo) {
            newCurrencyInfo[i].deposit = depositInfo.depositAmount
            newCurrencyInfo[i].totalDeposit = depositInfo.totalAmount
          }
        }

        commit('SET_USER_DEPOSITED', newState)
        commit('SET_SUPPORT_CURRENCY', newCurrencyInfo)
      }

      return res
    },

    async initCoreInfoOfUser({dispatch}) {
      return new Promise(resolve => {
        const loadingStatus = {
          info: false,
          balance: false
        }
        const isFinished = () => {
          for(const type in loadingStatus) {
            if(!loadingStatus[type]) {
              return false
            }
          }

          return true
        }

        dispatch('setUserInfo').then(res => {
          if(res.success && isFinished()) {
            resolve()
          }
        })

        dispatch('setUserDeposited').then(res => {
          if(!res.success) {
            return
          }

          isFinished() && resolve()
          dispatch('setUserBalanceWatcher')
        })
      })
    },

    setUserBalanceWatcher({commit, dispatch, getters}) {
      commit('CLEAR_USER_BALANCE_WATCHER')

      const updateTokenBalance = async () => {
        const res = await new Promise(resolve => {
          const watchList = []

          for(const currency of getters.getSupportCurrency) {
            const address = currency.currentAddress

            if(address) {
              watchList.push({
                address,
                decimal: currency.decimal,
                balance: '0'
              })
            }
          }

          if(watchList.length === 0) {
            resolve(watchList)
          }

          let callCnt = 0
          let checkFinish = () => {
            if (callCnt === watchList.length) {
              resolve(watchList)
            }
          }

          for(let i = 0; i < watchList.length; i++) {
            const currency = watchList[i]

            this.$app.$wallet.getBalance(currency.address).then((res) => {
              callCnt += 1
              watchList[i].balance = res

              checkFinish()
            })
          }
        })

        const newCurrencyInfo = _.cloneDeep(getters.getSupportCurrency)

        for(let i = 0; i < newCurrencyInfo.length; i++) {
          const currency = newCurrencyInfo[i]
          const balanceInfo = _.find(res, row => {
            return this.$app.$wallet.isSameAddress(currency.currentAddress, row.address)
          })

          if(balanceInfo) {
            newCurrencyInfo[i].balance = balanceInfo.balance
          }

          commit('SET_SUPPORT_CURRENCY', newCurrencyInfo)
        }

        commit('SET_USER_BALANCE', {
          currency: res
        })
      }

      const updateNftBalance = async () => {
        const res = await new Promise(resolve => {
          const result = []
          const watchList = []

          for(const nft of getters.getSupportNft) {
            const address = nft.currentAddress

            if(address) {
              watchList.push({
                address: address,
                name: nft.name,
                symbol: nft.symbol
              })
            }
          }

          if(watchList.length === 0) {
            resolve(result)
          }

          let callCnt = 0
          let checkFinish = () => {
            if (callCnt === watchList.length) {
              resolve(result)
            }
          }

          for(let i = 0; i < watchList.length; i++) {
            const nft = watchList[i]

            this.$app.$wallet.getNftBalance(nft.address).then((res) => {
              callCnt += 1

              // TODO : API, Item Detail
              for(const item of res) {
                result.push({
                  name: nft.name,
                  symbol: nft.symbol,
                  tokenAddress: nft.address,
                  tokenId: item.tokenId,
                  tokenUri: item.tokenUri
                })
              }

              checkFinish()
            })
          }
        })

        commit('SET_USER_BALANCE', {
          nft: res
        })
      }

      updateTokenBalance()
      updateNftBalance()

      commit('SET_USER_BALANCE_WATCHER', setInterval(() => {
        // 보유 정보(User)
        updateTokenBalance()
        updateNftBalance()

        // 예치 정보(Reserve)
        dispatch('setUserDeposited')
        dispatch('setUserItems')
      }, 10 * 1000))
    },

    async setRecentViewOfUser({commit, state}, payload = {}) {
      const newState = {}
      const res = await this.$app.$http.get('getRecentViewOfUser', {
        urlParams: {
          user: state.userInfo.address
        },
        urlQuery: {
          range: 20,
          ...(payload.query || {})
        }
      })

      if(res.success) {
        newState.recent = {
          page: Number(res.info.currentPage),
          maxPage: res.info.maxPage,
          list: _.map(res.info.items, item => {
            return new NftInfo(item)
          }),
          total: res.info.items.length
        }

        commit('SET_USER_WATCHLIST', newState)
      }

      return res
    },

    async setLikedItemsOfUser({commit, state}, payload = {}) {
      const newState = {}
      const res = await this.$app.$http.get('getLikedItemsOfUser', {
        urlParams: {
          user: state.userInfo.address
        },
        urlQuery: {
          recent: 20,
          ...(payload.query || {})
        }
      })

      if(res.success) {
        newState.liked = {
          page: Number(res.info.currentPage),
          maxPage: res.info.maxPage,
          list: _.map(res.info.items, item => {
            const itemInfo = new NftInfo(item)

            // 찜 목록에서는 실질적인 id가 likeTradeId
            itemInfo.likeTradeId = item.likeTradeId
            itemInfo.likedId = `${itemInfo.id}:${itemInfo.likeTradeId}`

            return itemInfo
          }),
          total: res.info.total
        }

        commit('SET_USER_WATCHLIST', newState)
      }

      return res
    },

    async setUserWatchlist({dispatch}, payload = {}) {
      return new Promise(resolve => {
        const result = {
          recent: false,
          liked: false
        }
        const isFinished = () => {
          if(result.liked && result.recent) {
            resolve()
          }
        }

        dispatch('setRecentViewOfUser', payload).then(() => {
          result.recent = true
          isFinished()
        })
        dispatch('setLikedItemsOfUser', payload).then(() => {
          result.liked = true
          isFinished()
        })
      })
    },

    setUserWatchlistFilters({commit}, payload) {
      commit('SET_USER_WATCHLIST_FILTERS', payload)
    },

    clearUserWatchlist({commit}) {
      commit('CLEAR_USER_WATCHLIST')
    },

    async setUserItems({commit, state}, payload = {}) {
      let curPage = 1;
      let maxPage = 1;

      let res;
      let items = [];

      while (curPage <= maxPage) {
        const query = {
          ...payload.query,
          page: curPage
        };

        res = await this.$app.$http.get('getUserItems', {
          urlQuery: query,
          urlParams: {
            user: state.userInfo.address
          }
        })

        if(res.success) {
          maxPage = Number(res.info.maxPage);
          const activeList = _.filter(res.info.items, nft => {
            return nft.status !== 7
          })

          const curItems = _.map(activeList, nft => {
            return new NftInfo(nft)
          })

          for (const item of curItems) {
            items.push(item);
          }
        } else {
          break
        }

        commit('SET_USER_ITEMS', items);

        curPage += 1;
      }

      return res
    },

    clearUserItems({commit}) {
      commit('CLEAR_USER_ITEMS')
    },

    setUserItemFilters({commit}, payload) {
      commit('SET_USER_ITEM_FILTERS', payload)
    },

    updateUserInfo({commit, dispatch, state}, payload) {
      const prevState = _.cloneDeep(state.userInfo)

      commit('SET_USER_INFO', payload)

      if(prevState.address !== payload.address) {
        dispatch('initCoreInfoOfUser')
      }
    },

    async setNftActivities({commit, state}, payload = {}) {
      const newState = {}
      const nftEvents = ['BUY', 'SELL', 'AUCTION', 'BID', 'NEGO']

      const reqQuery = {
        ...(payload.query || {}),
        limit: 10
      }

      if(!reqQuery.event) {
        reqQuery.event = nftEvents.join(',')
      }

      const res = await this.$app.$http.get('getUserActivities', {
        urlQuery: reqQuery,
        urlParams: {
          user: state.userInfo.address
        }
      })

      if(res.success) {
        newState.nft = {
          page: Number(res.info.currentPage),
          list: _.map(res.info.items, row =>{
            return new UserActivity({
              ...row,
              type: 'nft'
            })
          }),
          maxPage: Number(res.info.maxPage),
          total: res.info.total
        }

        commit('SET_USER_ACTIVITIES', newState)
      }

      return res
    },

    async setAssetActivities({commit, state}, payload = {}) {
      const newState = {}
      const reqQuery = {
        ...(payload.query || {}),
        limit: 10
      }

      if(!reqQuery.event || reqQuery.event !== 'TOKEN') {
        reqQuery.event = 'TOKEN'
      }

      const res = await this.$app.$http.get('getUserActivities', {
        urlQuery: reqQuery,
        urlParams: {
          user: state.userInfo.address
        }
      })

      if(res.success) {
        newState.currency = {
          page: Number(res.info.currentPage),
          list: _.map(res.info.items, row =>{
            return new UserActivity({
              ...row,
              type: 'token'
            })
          }),
          maxPage: Number(res.info.maxPage),
          total: res.info.total
        }

        commit('SET_USER_ACTIVITIES', newState)
      }

      return res
    },

    async setUserActivities({dispatch}, payload = {}) {
      return new Promise(resolve => {
        const result = {
          nft: false,
          asset: false
        }
        const isFinished = () => {
          if(result.nft && result.asset) {
            resolve()
          }
        }

        dispatch('setNftActivities', payload).then(() => {
          result.nft = true
          isFinished()
        })
        dispatch('setAssetActivities', payload).then(() => {
          result.asset = true
          isFinished()
        })
      })
    },

    setUserActivityFilters({commit}, payload) {
      commit('SET_USER_ACTIVITY_FILTERS', payload)
    },

    clearUserActivities({commit}) {
      commit('CLEAR_USER_ACTIVITIES')
    },

    async setUserBuyOrders({commit, getters}) {
      const res = await this.$app.$http.get('getBuyOrders', {
        urlQuery: {
          buyerAddr: getters.getUserInfo.address
        }
      })

      if(res.success) {
        const untilProgress = _.filter(
          _.map(res.info.items, row => {
            return new AssetBuyOffer(row)
          }),
          row => {
            return row.status !== 7
          }
        )

        commit('SET_USER_BUY_ORDERS', untilProgress)
      }

      return res
    },

    async setUserSellOrders({commit, getters}) {
      const newState = {
        normal: [],
        auction: []
      }

      const res = await this.$app.$http.get('getMyTotalBalance', {
        urlParams: {
          accountAddr: getters.getUserInfo.address
        }
      })

      if(!res.success) {
        return false
      }

      newState.normal = _.filter(
        _.map(res.info.lockToken['NEGO'], row => {
          return new AssetSaleOffer(row)
        }),
        row => row.status !== 7
      )

      newState.auction = _.filter(
        _.map(res.info.lockToken['BID'], row => {
          return new AssetSaleOffer(row)
        }),
        row => row.status !== 7
      )

      commit('SET_USER_SELL_ORDERS', newState)

      return true
    },

    clearUserPageData({commit}) {
      commit('CLEAR_USER_WATCHLIST')
      commit('CLEAR_USER_ACTIVITIES')
    },

    async modifyUserInfo({commit, state, getters}, payload) {
      const signResult = await this.$app.$tx.modifyUserInfo({
        username: payload.username,
        display: payload.display,
      })

      if(!signResult.success) {
        return signResult
      }

      const sendResult = await this.$app.$http.post('modifyUserInfo', {
        body: {
          username: payload.username,
          display: payload.display,
          msg: signResult.data.message,
          signHash: signResult.data.signature,
          hashType: getters.getChainInfo.chain === 'KLAYTN' ? 2 : 1,
          file: payload.profile
        },
        bodyType: 'form',
        urlParams: {
          user: state.userInfo.address
        }
      })

      if(sendResult.success) {
        commit('SET_USER_INFO', {
          username: payload.username,
          display: payload.display
        })
      }

      // 실제 트랜잭션 발생이 아니라 서명만 받는것이므로 여기서 프로그레스 모달 닫아주기
      this.$app.$eventBus.$emit('onReceiveTxResult', {
        result: true,
        hash: signResult.data.requestHash
      })

      return sendResult
    },

    async checkUsernameRegex({commit}, payload) {
      return await this.$app.$http.get('checkUsernameRegex', {
        urlParams: {
          username: payload.username
        }
      })
    },

    async setOfferItem(store, payload) {
      const {tokenAddress, tokenId} = payload;

      const res = await this.$app.$http.get('getItemDetail', {
        urlParams: {
          tokenAddress,
          tokenId
        }
      })

      if (res.success) {
        store.commit('SET_OFFER_ITEM', res.info);
      }
    }
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo
    },

    getUserBalance(state) {
      return state.userBalance
    },

    getUserWatchlist(state) {
      return state.userWatchlist
    },

    getUserWatchlistFilters(state) {
      return state.userWatchlistFilters
    },

    getMaskedAddress() {
      return (address) => {
        if (address === '-')
          return '-'
        if(!address) {
          return ''
        }

        return address.slice(0, 6) + '....' + address.slice(address.length - 4, address.length)
      }
    },

    getUserItems(state) {
      const result = {
        total: [],
        inWallet: [],
        deposited: [],
        onTrade: []
      }

      for(const item of state.userItems) {
        if(item.isDeposited || item.isOnWithdraw) {
          result.deposited.push(item)
        }

        if(item.isInWallet) {
          result.inWallet.push(item)
        }

        if(item.isOnTrade) {
          result.onTrade.push(item)
        }

        result.total.push(item)
      }

      return result
    },

    getUserItemFilters(state) {
      return state.userItemFilters
    },

    getUserActivities(state) {
      return state.userActivities
    },

    getUserActivityFilters(state) {
      return state.userActivityFilters
    },

    getUserDeposited(state) {
      return state.userDeposited
    },

    getUserBuyOrders(state) {
      return state.userBuyOrders
    },

    getUserSellOrders(state) {
      const { auction, normal } = state.userSellOrders

      return _.sortBy(auction.concat(normal), row => {
        return row.createdAt
      })
    },

    getOfferItem(state) {
      return state.offerItem;
    }
  }
}
