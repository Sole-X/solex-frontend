import { NftInfo } from '@/model/MarketModel'
import { AssetItemDetail } from '@/model/AssetModel'
import axios from 'axios';

export const getDefaultState = () => ({
  searchFilter: {
    keyword: '',
    type: 'sell',
    status: [
      {
        type: 'Sales',
        name: 'Market.Sales',
        flag: false
      },
      {
        type: 'Auctions',
        name: 'Market.Auctions',
        flag: false
      },
      {
        type: 'Promotion',
        name: 'Market.Promotion',
        flag: false
      }
    ],
    blockchain: [
      {
        type: 'Ethereum',
        name: 'Market.Ethereum',
        flag: false
      },
      {
        type: 'Klaytn',
        name: 'Market.Klaytn',
        flag: false
      },
    ],
    category: [
      {
        type: 'Art',
        name: 'Market.Art',
        flag: false
      },
      {
        type: 'Collectible',
        name: 'Market.CollectibleItems',
        flag: false
      },
      {
        type: 'ETC',
        name: 'Market.Etc',
        flag: false
      }
    ],
    collection: [],
    currency: [],
    price: {
      custom: {
        min: '0',
        max: '0'
      },
      preset: [
        {
          min: null,
          max: '5',
          selected: false
        },
        {
          min: '5',
          max: '10',
          selected: false
        },
        {
          min: '10',
          max: '20',
          selected: false
        },
        {
          min: '20',
          max: null,
          selected: false
        }
      ]
    }
  },
  searchedNft: {
    page: 1,
    maxPage: 1,
    total: 0,
    limit: 10,
    list: []
  },
  marketSideInfo: {
    nftCntAuction: 0,
    nftCntBuy: 0,
    nftCntCateART: 0,
    nftCntCateCOLLECT: 0,
    nftCntCateETC: 0,
    nftCntCateETH: 0,
    nftCntCateKLAY: 0,
    nftCntSell: 0
  },
  marketMainList: {
    popular: [],
    recently : [],
    ethereum: [],
    klaytn: [],
    collectible: [],
    recentlyViewed: []
  }
})

export default {
  state() {
    return getDefaultState()
  },

  mutations: {
    SET_SEARCH_FILTER(state, payload) {
      state.searchFilter = {
        ...state.searchFilter,
        ...payload
      }
    },

    CLEAR_SEARCH_FILTER(state, payload = {}) {
      state.searchFilter = {
        ...getDefaultState().searchFilter,
        ...payload
      }
    },

    SET_SEARCHED_NFT(state, payload) {
      state.searchedNft = {
        ...state.searchedNft,
        ...payload
      }
    },

    SET_MARKET_MAIN_LIST(state, payload) {
      state.marketMainList = {
        ...state.marketMainList,
        ...payload
      }
    },

    CLEAR_SEARCH_NFT(state) {
      state.searchedNft = getDefaultState().searchedNft
    },

    SET_MARKET_SIDE_INFO(state, payload) {
      state.marketSideInfo = {
        ...state.marketSideInfo,
        ...payload
      }
    }
  },

  actions: {
    setSearchFilter({commit, state}, payload) {
      commit('SET_SEARCH_FILTER', payload)
    },

    clearSearchFilter({commit}, payload) {
      commit('CLEAR_SEARCH_FILTER', payload)
    },

    async searchNft({commit, getters}, payload) {
      const res = await this.$app.$http.get('searchNft', {
        urlQuery: {
          ...(payload.query || {}),
          connectAddr: getters.getUserInfo.address || ''
        }
      })

      if(!res.success) {
        return
      }

      const newList = _.map(res.info.items, row => {
        return new AssetItemDetail({
          ...row,
          isDetail: true
        })
      })

      const newPage = Number(res.info.currentPage)

      // 1 페이지가 아닌 경우 이어붙이기
      //  TODO : 만약 무한로딩을 안쓰는 경우가 생기면 payload 안에 사용 여부도 받기
      const newState = {
        list: newPage === 1 ? newList : getters.getSearchedNft.list.concat(newList),
        total: res.info.total,
        page: newPage,
        maxPage: Number(res.info.maxPage)
      }

      commit('SET_SEARCHED_NFT', newState)
    },

    async updateSearchedNft({commit}, payload) {
      commit('SET_SEARCHED_NFT', payload)
    },

    clearSearchNft({commit}) {
      commit('CLEAR_SEARCH_NFT')
    },

    async toggleNft({commit, dispatch, getters}, payload) {
      const reqBody = {
        accountAddr: getters.getUserInfo.address,
        tradeId: payload.tradeId
      }
      const actionName = payload.type === 'on' ? 'likeNft' : 'unlikeNft'

      return await this.$app.$http.post(actionName, {
        body: reqBody
      })
    },

    async initMarketMain({getters, commit}, payload) {
      const {accountAddr} = payload;

      return new Promise((resolve) => {
        const requestStatus = {
          getLatestNft: false,
          getPopularNft: false,
          ethereum: false,
          klaytn: false,
          collectiable: false,
          recently: false
        }
        const isFinished = () => {
          for (let key in requestStatus) {
            if (!requestStatus[key]) {
              return false
            }
          }

          return true
        }

        this.$app.$http.get('searchNft', {
          urlQuery: {
            order: 'POP'
          }
        }).then(res => {
          if (res.success) {
            commit('SET_MARKET_MAIN_LIST', {
              /*
              popular: _.map(res.info.nfts || [], row => {
                return new NftInfo(row)
              })
              */
              popular: res.info.items
            })
          }

          requestStatus.getPopularNft = true

          if (isFinished()) {
            return resolve()
          }
        })

        this.$app.$http.get('getLatestNft', {
          urlQuery: {
            order: 'DATE'
          }
        }).then(res => {
          if (res.success) {
            commit('SET_MARKET_MAIN_LIST', {
              /*
              recently: _.map(res.info.nfts || [], row => {
                return new NftInfo(row)
              })

               */
              recently: res.info.items
            })
          }

          requestStatus.getLatestNft = true

          if (isFinished()) {
            return resolve()
          }
        })

        this.$app.$http.get('searchNft', {
          urlQuery: {
            category: 'ETH'
          }
        }).then(res => {
          if (res.success) {
            commit('SET_MARKET_MAIN_LIST', {
              /*
              ethereum: _.map(res.info.items || [], row => {
                return new NftInfo(row)
              })

               */
              ethereum: res.info.items
            })
          }

          requestStatus.ethereum = true

          if (isFinished()) {
            return resolve()
          }
        })

        this.$app.$http.get('searchNft', {
          urlQuery: {
            category: 'KLAY'
          }
        }).then(res => {
          if (res.success) {
            commit('SET_MARKET_MAIN_LIST', {
              /*
              klaytn: _.map(res.info.items || [], row => {
                return new NftInfo(row)
              })

               */
              klaytn: res.info.items
            })
          }

          requestStatus.klaytn = true

          if (isFinished()) {
            return resolve()
          }
        })

        this.$app.$http.get('searchNft', {
          urlQuery: {
            category: 'COLLECTIBLES'
          }
        }).then(res => {
          if(res.success) {
            commit('SET_MARKET_MAIN_LIST', {
              /*
              collectible: _.map(res.info.items || [], row => {
                return new NftInfo(row)
              })

               */
              collectible: res.info.items
            })
          }

          requestStatus.collectiable = true

          if(isFinished()) {
            return resolve()
          }
        })

        const userAddress = getters.getUserInfo.address;

        if (!userAddress || userAddress === '') {
          // 지갑 미연결 시
          this.$app.$http.get('getRecentViewOfAll', {

          }).then(res => {
            if(res.success) {
              commit('SET_MARKET_MAIN_LIST', {
                /*
                recentlyViewed: _.map(res.info.items || [], row => {
                  return new NftInfo(row)
                })

                 */
                recentlyViewed: res.info.items
              })
            }

            requestStatus.recently = true

            if(isFinished()) {
              return resolve()
            }
          })
        } else {
          // 지갑 연결 시
          this.$app.$http.get('getRecentViewOfUser', {
            urlParams: {
              user: userAddress
            }
          }).then(res => {
            if (res.success) {
              commit('SET_MARKET_MAIN_LIST', {
                recentlyViewed: res.info.items
              })
            }

            requestStatus.recently = true

            if(isFinished()) {
              return resolve()
            }
          })

        }


      })
    },

    async setSideInfo({commit}) {
      const res = await this.$app.$http.get('getSideInfo')

      if(res.success) {
        commit('SET_MARKET_SIDE_INFO', res.info.nftCnt)
      }

      return res
    },

    refreshTokenFilter({commit, state, getters}) {
      const newState = {
        collection: [],
        currency: []
      }

      const nfts = getters.getSupportNft
      const tokens = getters.getSupportCurrency

      for(const nft of nfts) {
        const findFromState = _.find(newState.collection, row => {
          return this.$app.$wallet.isSameAddress(row.tokenAddress, nft.currentAddress)
        })

        if(!findFromState) {
          newState.collection.push({
            name: nft.name,
            flag: false,
            address: nft.currentAddress
          })
        }
      }

      for(const token of tokens) {
        const findFromState = _.find(newState.currency, row => {
          return this.$app.$wallet.isSameAddress(row.tokenAddress, token.currentAddress)
        })

        if(!findFromState) {
          newState.currency.push({
            name: token.name,
            flag: false,
            address: token.currentAddress
          })
        }
      }

      return newState
    },
  },

  getters: {
    getSearchFilter(state) {
      return state.searchFilter
    },

    getSearchedNft(state) {
      return state.searchedNft
    },

    getMarketMainList(state) {
      return state.marketMainList
    },

    getSearchQuery(state) {
      const { searchedNft } = state
      const searchFilter = _.cloneDeep(state.searchFilter)

      const result = {
        search: searchFilter.keyword,
        page: searchedNft.page
      }

      result.status = _.filter(searchFilter.status, row => {
        return row.flag
      }).map(row => {
        if(row.type === 'Sales') {
          return 'SELL'
        }

        if(row.type === 'Auctions') {
          return 'AUCTION'
        }

        // TODO : API
        if(row.type === 'Promotion') {
          return 'PROMOTION'
        }
      }).join(',')

      result.category = _.filter(searchFilter.category, row => {
        return row.flag
      }).map(row => {
        return row.type.toUpperCase()
      }).join(',')

      result.platform = _.filter(searchFilter.blockchain, row => {
        return row.flag
      }).map(row => {
        if(row.type === 'Ethereum') {
          return 'ETH'
        }

        if(row.type === 'Klaytn') {
          return 'KLAY'
        }

        return row.type.toUpperCase()
      }).join(',')

      result.collection = _.filter(searchFilter.collection, row => {
        return row.flag
      }).map(row => row.address).join(',')

      result.currency = _.filter(searchFilter.currency, row => {
        return row.flag
      }).map(row => row.address).join(',')

      // 선택된 단위가 없다면 가격 설정 불가
      if(result.currency) {
        result.price = Object.values((_.find(searchFilter.price.preset, type => {
          return type.selected
        }) || searchFilter.price.custom)).join(',')

        const slicedPrice = result.price.split(',')

        // 시작 범위가 끝 범위보다 값이 큰 경우 제외
        if(slicedPrice[0].dcomp(slicedPrice[1]) === 1) {
          delete result.price
        }

        // 입력된 가격이 없거나 0인 경우 쿼리에서 제외
        if(!_.find(slicedPrice, value => parseFloat(value) > 0)) {
          delete result.price
        }
      }

      return (limit) => {
        result.limit = limit || 20
        return result
      }
    },

    getMarketSideInfo(state) {
      return state.marketSideInfo
    }
  }
}
