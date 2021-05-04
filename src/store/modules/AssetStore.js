import { AssetItemDetail, AssetBuyOffer, AssetSaleOffer, AssetItemHistory } from '@/model/AssetModel'
import axios from 'axios'

export const getDefaultState = () => ({
  itemInfo: {},
  writingInfo: {},
  itemHistory: {
    minPrice: '0',
    avgPrice: '0',
    maxPrice: '0',
    prices: [],
    history: []
  },
  relatedItems: [],
  myItems: [],
  myLocalItems: [],
  like: false,
})

// TODO : 트랜잭션 관련 요소들 TxStore 쪽으로 옮기기
export default {
  state() {
    return getDefaultState()
  },
  mutations: {
    SET_ITEM_INFO(state, payload) {
      state.itemInfo = payload
    },

    SET_WRITING_INFO(state, payload) {
      state.writingInfo = payload;
    },

    CLEAR_ITEM_INFO(state) {
      const defaultState = getDefaultState()

      state.itemInfo = defaultState.itemInfo
      state.relatedItems = defaultState.relatedItems
    },

    CLEAR_WRITING_INFO(state) {
      const defaultState = getDefaultState();

      state.writingInfo = defaultState.writingInfo;
      state.relatedItems = defaultState.relatedItems;
    },

    SET_RELATED_ITEMS(state, payload) {
      state.relatedItems = payload
    },

    SET_ITEM_HISTORY(state, payload) {
      state.itemHistory = {
        ...state.itemHistory,
        ...payload
      }
    },

    SET_MY_ITEMS(state, payload) {
      state.myItems = payload.items;
    },

    SET_MY_LOCAL_ITEMS(state, payload) {
      state.myLocalItems = payload.myLocalItems;
    },

    SET_LIKE(state, payload) {
      state.like = payload;
    }
  },
  actions: {
    async setItemInfo({commit, getters}, { params = {}, query = {} }) {
      await commit('CLEAR_ITEM_INFO')

      const urlQuery = {
        connectAddr: getters.getUserInfo.address
      }

      if(query.type === 'buy') {
        urlQuery.buyId = query.tradeId
      }

      const getItemDetail = await this.$app.$http.get('getItemDetail', {
        urlParams: {
          tokenAddress: params.tokenAddress,
          tokenId: params.tokenId
        },
        urlQuery
      })

      const defaultInfo = {
        tokenAddress: params.tokenAddress,
        tokenId: params.tokenId
      }
      const newState = new AssetItemDetail(getItemDetail.success ? {
        ...defaultInfo,
        ...getItemDetail.info,
        tradeId: query.tradeId,
        isCollected: true,
        isDetail: true // 이 값이 true로 넘어간다면 buy, sell, auction 등 기본 설정하지 않기
      } : {
        ...defaultInfo,
        isCollected: false
      })

      const connectAddr = getters.getUserInfo ? getters.getUserInfo.address : '';
      let urlQueryForWriting = {}
      if (connectAddr && connectAddr !== '') {
        urlQueryForWriting.connectAddr = connectAddr;
      }

      if(query.type === 'buy' && query.tradeId) {
        const buyInfo = await this.$app.$http.get('getWritingDetailBuy', {
          urlParams: {
            tradeId: query.tradeId
          },
          urlQuery: urlQueryForWriting
        })

        if(buyInfo.success) {
          const newBuyInfo = new AssetBuyOffer(buyInfo.info.buy)

          newState.buy = newBuyInfo
          newState.exchange = newBuyInfo
          newState.statusStr = 'BUY'

          let likeFlag = null;
          if (buyInfo.info && buyInfo.info.buy) {
            likeFlag = buyInfo.info.buy.like;
          }
          if (likeFlag !== null) {
            commit('SET_LIKE', likeFlag)
          }
        }
      }

      if(query.type === 'sell' && query.tradeId) {
        const saleInfo = await this.$app.$http.get('getWritingDetailSale', {
          urlParams: {
            tradeId: query.tradeId
          },
          urlQuery: urlQueryForWriting
        })

        if(saleInfo.success) {
          const newSaleInfo = new AssetSaleOffer(saleInfo.info)

          if(newSaleInfo.saleType === 'sell') {
            newState.sell = newSaleInfo
            newState.exchange = newSaleInfo
            newState.statusStr = 'SELL'
          }

          if(newSaleInfo.saleType === 'auction') {
            newState.auction = newSaleInfo
            newState.statusStr = 'AUCTION'
          }

          let likeFlag = null;
          if (saleInfo.info) {
            likeFlag = saleInfo.info.like;
          }
          if (likeFlag !== null) {
            commit('SET_LIKE', likeFlag)
          }
        }
      }

      commit('SET_ITEM_INFO', newState)

      return {
        success: true,
        info: newState
      }
    },

    async setRelatedItems({commit, state}, payload) {
      const { page } = payload;

      let res = {
        success: false
      };
      if (page === 'buy') {
        res = await this.$app.$http.get('getBuyOrders', {
          urlQuery: {
            collection: state.itemInfo.tokenAddress
          }
        })
      } else if (page === 'sell') {
        res = await this.$app.$http.get('searchNft', {
          urlQuery: {
            collection: state.itemInfo.tokenAddress
          }
        })
      }

      if(res.success) {
        commit('SET_RELATED_ITEMS', _.map(res.info.items, item => {
          return {
            ...item,
            isDetail: true,
            relatedId: item.id
          }
          /*
          return new AssetItemDetail({
            ...item,
            isDetail: true,
            relatedId: item.id
          })

           */
        }))
      }

      return res
    },

    async setItemReadLog({commit, getters}, payload) {
      return await this.$app.$http.post('addItemReadLog', {
        body: {
          accountAddr: getters.getUserInfo.address,
          // tokenAddr: payload.tokenAddress,
          // tokenId: payload.tokenId
          tradeId: payload.tradeId
        }
      })
    },

    updateItemInfo({commit}, payload) {
      commit('SET_ITEM_INFO', payload)
    },

    // TODO : API, 수집된 후 재차 확인
    async setItemHistory({commit, getters}, payload) {
      const res = await this.$app.$http.get('getItemHistory', {
        urlParams: {
          tokenAddress: payload.tokenAddress,
          tokenId: payload.tokenId
        }
      })

      if(res.success) {
        const { minPrice, avgPrice, maxPrice, history } = res.info

        const newHistory = [];
        for (const h of history) {
          if (Array.isArray(h) && h.length === 0)
            continue;
          else newHistory.push(h);
        }

        const newState = {
          minPrice: String(minPrice || '0'),
          avgPrice: String(avgPrice || '0'),
          maxPrice: String(maxPrice || '0'),
          prices: res.info.prices || [],
          history: _.map(newHistory && newHistory[0], history => {
            return new AssetItemHistory(history)
          })
        }

        commit('SET_ITEM_HISTORY', newState)
      }

      return res
    },

    async sendMessageTx({commit, dispatch, getters}, payload) {
      const _vm = this.$app

      return new Promise(async resolve => {
        // 소켓 Tx 구독 시작
        _vm.$eventBus.$emit('emitTx', payload.requestHash)

        // 로컬 Tx 진행 목록 업데이트
        commit('SET_TX_QUEUE', getters.getTxQueue.concat({
          hash: payload.requestHash,
          txHash: '',
          status: 'start'
        }))

        /** 2. Tx Pending(socket > pending event) 구독
         * 실패할 경우 Queue에서 제거하고 Tx 실패 반환
         * 성공할 경우 TxHash Queue에다 추가하고 다음 이벤트 기다리기
         **/
        const receivePendingTx = (e) => {
          if(e.hash !== payload.requestHash) {
            return
          }

          const prevTxQueue =  _.cloneDeep(getters.getTxQueue)
          const newTxQueue = _.filter(prevTxQueue, queue => {
            let returnFlag = true

            if(queue.hash === payload.requestHash) {
              if(queue.result === 'fail') {
                returnFlag = false
              }

              queue.txHash = e.tx
              queue.status = 'pending'
            }

            return returnFlag
          })

          if(prevTxQueue.length !== newTxQueue.length) {
            resolve({
              success: false,
              error: new Error('tx_not_executed')
            })
          }

          commit('SET_TX_QUEUE', newTxQueue)
          _vm.$eventBus.$off('onReceiveTxPending', receivePendingTx)
        }

        /** 3. Tx Result(socket > resultTx event) 구독
         * 실패할 경우 Queue에서 제거하고 Tx 실패 반환
         * 성공할 경우 그대로 성공 리턴
         **/
        const receiveResultTx = (e) => {
          if (!e.result) {
            dispatch('showAlert', {
              title: this.$app.$t('General.TransactionFail'),
              content: this.$app.$t('General.TransactionFailContent'),
            })
            return;
          } else {
            _vm.$eventBus.$emit('refreshPage');
          }

          const pendingTx = _.find(getters.getTxQueue, queue => {
            return queue.hash === e.hash
          })

          if(!pendingTx) {
            return
          }

          commit('SET_TX_QUEUE', _.filter(getters.getTxQueue, queue => {
            return queue.txHash !== e.txHash
          }))

          resolve({
            success: e.result,
            info: {
              txHash: e.txHash,
              nonce: payload.requestHash,
              detail: pendingTx.detail
            }
          })

          _vm.$eventBus.$off('onReceiveTxResult', receiveResultTx)
        }

        // 1. 이벤트 구독 시작
        _vm.$eventBus.$on('onReceiveTxPending', receivePendingTx)
        _vm.$eventBus.$on('onReceiveTxResult', receiveResultTx)

        // Tx Send
        await _vm.$http.post('sendSignedMessageTx', {
          body: {
            address: getters.getUserInfo.address,
            cate: payload.cate,
            hash: payload.requestHash,
            hashType: this.$app.$wallet.getHashType(getters.getChainInfo.chain),
            msg: payload.message,
            signHash: payload.signature
          }
        })
      })
    },

    async depositToken({commit, dispatch, getters}, payload) {
      const chainInfo = getters.getChainInfo;

      const sendResult = await this.$app.$tx.depositToken(
        payload.token.currentAddress,
        payload.amount,
        chainInfo
      )

      // 이더리움 체인은 즉시 반영 불가능
      if(sendResult.success && chainInfo.chain === 'KLAYTN') {
        const newTokens = _.map(_.cloneDeep(getters.getUserDeposited.tokens), row => {
          if(!this.$app.$wallet.isSameAddress(row.currentAddress, payload.token)) {
            return row
          }

          row.depositAmount = this.$app.$bn.addBN(row.depositAmount, payload.amount).toString()

          return row
        })

        commit('SET_USER_DEPOSITED', {
          tokens: newTokens
        })
      }

      if(sendResult.data) {
        dispatch('openTxSuccessModal', {
          action: 'deposit',
          success: sendResult.data.success,
          txHash: sendResult.data.transactionHash,
          amount: payload.amount,
          currency: payload.token
        })
      }

      return sendResult
    },

    async withdrawToken({commit, dispatch, getters}, payload) {
      const { chain } = getters.getChainInfo

      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;

      if (!isKlip) {
        signResult = await this.$app.$tx.withdrawToken(
          payload.token.addressToReserve,
          payload.amount,
          {
            type: 'withdrawToken',
            token: payload.token,
            amount: payload.amount,
            action: payload.action
          },
          chain,
          payload.toAddress
        )

        if(!signResult.success) {
          return signResult
        }
      }

      let paramCate = chain === 'ETHEREUM' ? 'bridge' : 'token';
      if (payload.action === 'transfer') {
        paramCate = 'token';
      }

      let sendResult;

      if (!isKlip) {
        sendResult = await dispatch('sendMessageTx', {
          cate: paramCate,
          ...signResult.data
        })
      } else if (isKlip) {
        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('ReserveContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('ReserveContract', 'withdraw')),
          params: JSON.stringify([this.$app.$tx.getRandomHash(), payload.token.addressToReserve, payload.amount, payload.toAddress])
        });
      }

      // 이더리움 체인은 즉시 반영 불가능
      if(sendResult.success && chain === 'KLAYTN') {
        const newTokens = _.map(_.cloneDeep(getters.getUserDeposited.tokens), row => {
          if(!this.$app.$wallet.isSameAddress(row.currentAddress, payload.token)) {
            return row
          }

          row.depositAmount = this.$app.$bn.subBN(row.depositAmount, payload.amount).toString()

          return row
        })

        commit('SET_USER_DEPOSITED', {
          tokens: newTokens
        })
      }

      if(sendResult.info) {
        dispatch('openTxSuccessModal', {
          action: payload.action === 'transfer' ? 'transfer' : 'withdraw',
          success: sendResult.success,
          txHash: sendResult.info.txHash,
          amount: payload.amount,
          currency: payload.token
        })
      }

      return sendResult
    },

    async depositNft({commit, dispatch, getters}, payload) {
      const { chain } = getters.getChainInfo
      const sendResult = await this.$app.$tx.depositNft(
        payload.tokenAddress,
        payload.tokenId,
        chain
      )

      // 이더리움 체인은 즉시 반영 불가능
      if(sendResult.success && chain === 'KLAYTN') {
        commit('SET_USER_BALANCE', {
          nft: _.filter(getters.getUserBalance.nft, item => {
            return item.tokenAddress !== payload.tokenAddress || payload.tokenId !== item.tokenId
          })
        })
      }

      if(sendResult.data) {
        dispatch('openTxSuccessModal', {
          action: 'deposit',
          success: sendResult.data.success,
          txHash: sendResult.data.transactionHash,
          amount: payload.amount,
          currency: payload.token
        })
      }

      return sendResult
    },

    async withdrawNft({commit, dispatch, getters}, payload) {
      const { chain } = getters.getChainInfo

      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let sendResult;
      if (!isKlip) {
        const signResult = await this.$app.$tx.withdrawNft(
            payload.token.tokenAddress,
            payload.token.tokenId,
            {
              type: payload.action,
              token: payload.token,
              action: payload.action
            },
            chain,
            payload.toAddress
        )

        if(!signResult.success) {
          return signResult
        }

        let cate = chain === 'ETHEREUM' ? 'bridge' : 'token';
        if (payload.action === 'transferNft') {
          cate = 'token';
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: cate,
          ...signResult.data
        })
      } else if (isKlip) {
        const klipParams = [this.$app.$tx.getRandomHash(), payload.token.tokenAddress, payload.token.tokenId, payload.toAddress];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('ReserveContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('ReserveContract', 'withdrawNft')),
          params: JSON.stringify(klipParams)
        });
      }

      // 이더리움 체인은 즉시 반영 불가능
      if(sendResult.success && chain === 'KLAYTN') {
        const newState = _.cloneDeep(getters.getUserItems.total)

        commit('SET_USER_ITEMS', _.filter(newState, item => {
          return item.tokenAddress !== payload.tokenAddress || payload.tokenId !== item.tokenId
        }))
      }

      return sendResult
    },

    async placeBid({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let sendResult;
      if (!isKlip) {
        const signResult = await this.$app.$tx.placeBid(payload.tradeId, payload.amount,  {
          type: payload.isCheckout ? 'trade' : 'bid',
          token: payload.token,
          amount: payload.amount,
          cate: payload.cate
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: 'auction',
          ...signResult.data
        })
      } else if (isKlip) {
        const klipParams = [this.$app.$tx.getRandomHash(), payload.tradeId, payload.amount];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('ReserveContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('ReserveContract', 'withdrawNft')),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        /*
        dispatch('showAlert', {
          title: '입찰하기 성공',
          content: ''
        })
        */
      }

      return sendResult
    },

    async addAuction({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;
      let tradeId;

      if (!isKlip) {
        const signResult = await this.$app.$tx.addAuction(payload, {
          type: 'addAuction'
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: 'auction',
          ...signResult.data
        })

        tradeId = signResult.data.requestHash;
      } else if (isKlip) {
        const {tokenAddress, tokenId, biddingToken, minAmount, maxAmount, duration, isInstantTrade} = payload;
        const randomHash = this.$app.$tx.getRandomHash();
        const klipParams = [randomHash, tokenAddress, tokenId, biddingToken, minAmount, maxAmount, duration, isInstantTrade];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('ReserveContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('ReserveContract', 'withdrawNft')),
          params: JSON.stringify(klipParams)
        });

        tradeId = randomHash;
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: `/asset/item/${payload.tokenAddress}/${payload.tokenId}`,
          query: {
            type: 'sell',
            // tradeId: signResult.data.requestHash
            tradeId
          }
        })
      }

      return sendResult
    },

    async editAuction({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        signResult = await this.$app.$tx.editAuction(payload, {
          type: 'editAuction'
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: 'auction',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId, biddingToken, minAmount, maxAmount, duration, isInstantTrade } = payload;
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId, biddingToken, minAmount, maxAmount, duration, isInstantTrade];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('AuctionContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('AuctionContract', 'editAuction')),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: `/asset/item/${payload.tokenAddress}/${payload.tokenId}`,
          query: {
            tradeId: payload.tradeId,
            type: 'sell'
          }
        })
      }

      return sendResult
    },

    async cancelAuction({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        signResult = await this.$app.$tx.cancelAuction(payload.tradeId, {
          type: 'cancelAuction'
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: 'auction',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('AuctionContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('AuctionContract', 'cancelAuction')),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: '/request/complete',
          query: {
            type: 'cancel',
            tokenAddress: payload.tokenAddress,
            tokenId: payload.tokenId
          }
        })
      }

      return sendResult
    },

    async closeAuction(store, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        signResult = await this.$app.$tx.closeAuction(payload.tradeId, {
          type: 'closeAuction'
        });

        if (!signResult.success) return signResult;

        sendResult = await store.dispatch('sendMessageTx', {
          cate: 'auction',
          ...signResult.data
        });
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('AuctionContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('AuctionContract', 'closeAuction')),
          params: JSON.stringify(klipParams)
        });
      }

      if (sendResult.success) {
        this.$app.$router.push({
          path : '/request/complete',
          query: {
            type: 'cancel',
            tokenAddress: payload.tokenAddress,
            tokenId: payload.tokenId
          }
        })
      }

      return sendResult;
    },

    async retrieveAsset({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        const signResult = await this.$app.$tx.retrieveAsset(payload.tradeId, {
          type: 'retrieve'
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: payload.cate,
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress('SellOfferContract'),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi('SellOfferContract', 'cancelNego')),
          params: JSON.stringify(klipParams)
        });
      }

      const $t = this.$app.$t.bind(this.$app)

      if(sendResult.success) {
        let content = ''

        if(payload.cate === 'sell') {
          content = `사용자가 협상에 활용한 <strong class="text-secondary">${payload.price} ${payload.symbol}</strong> 가 성공적으로 회수되었습니다. 블록체인에서 트랜잭션 내역을 확인하려면 아래 <strong class="text-secondary">내 활동</strong> 버튼을 눌러주세요.`
        }

        dispatch('showAlert', {
          content,
          confirm: {
            cancel: {
              text: $t('General.Close')
            },
            accept: {
              text: $t('UserPage.MyActivity'),
              callback: () => {
                this.$app.$router.push({
                  path: '/user/history'
                })
              }
            }
          }
        })
      }

      return sendResult
    },

    async addNormalOffer({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      const methodName = payload._type === 'buy' ? 'addBuyOffer' : 'addSellOffer'

      let signResult;
      let sendResult;
      let tradeId;

      if (!isKlip) {
        signResult = await this.$app.$tx[methodName](payload, {
          type: methodName
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: payload._type,
          ...signResult.data
        })

        tradeId = signResult.data.requestHash;
      }
      else if (isKlip) {
        const { tokenAddress, tokenId, currency, amount, isNegotiable } = payload;
        const randomHash = this.$app.$tx.getRandomHash();
        const klipContractName = payload._type === 'buy' ? 'BuyOfferContract' : 'SellOfferContract';
        const klipParams = payload._type === 'buy' ? [randomHash, tokenAddress, tokenId, currency, amount] : [randomHash, tokenAddress, tokenId, currency, amount, isNegotiable];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, methodName)),
          params: JSON.stringify(klipParams)
        });

        if (sendResult.success) {

        }

        tradeId = randomHash;
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: `/asset/item/${payload.tokenAddress}/${payload.tokenId}`,
          query: {
            type: payload._type,
            // tradeId: signResult.data.requestHash
            tradeId
          }
        })
      }

      return sendResult
    },

    async editNormalOffer({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      const methodName = payload._type === 'buy' ? 'editBuyOffer' : 'editSellOffer'

      if (!isKlip) {
        const signResult = await this.$app.$tx[methodName](payload, {
          type: methodName
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: payload._type,
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId, currency, amount, isNegotiable } = payload;
        const klipContractName = payload._type === 'buy' ? 'BuyOfferContract' : 'SellOfferContract';
        const klipParams = payload._type === 'buy' ? [this.$app.$tx.getRandomHash(), tradeId, currency, amount] : [this.$app.$tx.getRandomHash(), tradeId, currency, amount, isNegotiable];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, methodName)),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: `/asset/item/${payload.tokenAddress}/${payload.tokenId}`,
          query: {
            type: payload._type,
            tradeId: payload.tradeId
          }
        })
      }
    },

    async cancelNormalOrder({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      const methodName = payload._type === 'buy' ? 'cancelBuyOffer' : 'cancelSellOffer'

      if (!isKlip) {
        signResult = await this.$app.$tx[methodName](payload, {
          type: methodName
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: payload._type,
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipContractName = payload._type === 'buy' ? 'BuyOfferContract' : 'SellOfferContract';
        const klipParams = payload._type === 'buy' ? [this.$app.$tx.getRandomHash(), tradeId] : [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, methodName)),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: '/request/complete',
          query: {
            type: 'cancel',
            tokenAddress: payload.tokenAddress,
            tokenId: payload.tokenId
          }
        })
      }

      return sendResult
    },

    async addNego({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        const signResult = await this.$app.$tx.addNego(payload, {
          type: 'addNegotiation'
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: 'sell',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId, currency, newPrice } = payload;
        const klipContractName = 'SellOfferContract';
        const klipMethodName = 'addNego';
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId, currency, newPrice];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: '/request/complete',
          query: {
            type: 'negotiation',
            tokenAddress: payload.tokenAddress,
            tokenId: payload.tokenId
          }
        })
      }

      return sendResult
    },

    async directExchange({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        signResult = await this.$app.$tx.directExchange(payload.cate, payload.tradeId, {
          type: 'trade',
          token: payload.token,
          amount: payload.amount,
          cate: payload.cate
        })

        if(!signResult.success) {
          return signResult
        }

        sendResult = await dispatch('sendMessageTx', {
          cate: payload.cate,
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipContractName = payload.cate === 'buy' ? 'BuyOfferContract' : 'SellOfferContract';
        const klipMethodName = payload.cate === 'buy' ? 'sellNft' : 'buyNft';
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
          params: JSON.stringify(klipParams)
        });
      }

      if(sendResult.success) {
        this.$app.$router.push({
          path: '/request/complete',
          query: {
            type: 'checkout',
            tokenAddress: payload.tokenAddress,
            tokenId: payload.tokenId,
            tradeId: payload.tradeId
          }
        })
      }

      return sendResult
    },

    async cancelNegotiation({commit, dispatch, getters}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        const signResult = await this.$app.$tx.cancelNegotiation(payload.tradeId,{
          type: 'cancelNegotiation'
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: 'sell',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId } = payload;
        const klipContractName = 'SellOfferContract';
        const klipMethodName = 'cancelNego';
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
          params: JSON.stringify(klipParams)
        });
      }

      const $t = this.$app.$t.bind(this.$app)

      if(sendResult.success) {
        dispatch('showAlert', {
          content: $t('Market.DoRejectSuccessMessage', {
            price: payload.order.price,
            token: payload.order.symbol,
            menu: $t('General.MyActivity')
          }),
          confirm: {
            cancel: {
              text: $t('General.Close')
            },
            accept: {
              text: $t('General.MyActivity'),
              callback: () => {
                this.$app.$router.push({
                  path: '/user/history'
                })
              }
            }
          }
        })

        dispatch('updateNegotiationStatus', {
          user: getters.getUserInfo.address,
          status: 3,
          statusStr: 'CANCEL'
        })

        this.$app.$eventBus.$emit('retrievedAsset');
      }

      return sendResult
    },

    async acceptNegotiation({commit, dispatch}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;

      if (!isKlip) {
        const signResult = await this.$app.$tx.acceptNegotiation(payload.tradeId, payload.negoMaker, {
          type: 'acceptNegotiation'
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: 'sell',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId, negoMaker } = payload;
        const klipContractName = 'SellOfferContract';
        const klipMethodName = 'acceptNego';
        const klipParams = [this.$app.$tx.getRandomHash(), tradeId, negoMaker];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
          params: JSON.stringify(klipParams)
        });
      }

      // TODO : State Update
      if(sendResult.success) {
        const { params } = this.$app.$route
        dispatch('setItemInfo', {
          params,
          query: {
            type: 'sell',
            tradeId: payload.tradeId
          }
        })
      }

      return sendResult
    },

    async rejectNegotiation({commit, dispatch, getters}, payload) {
      const isKlip = this.$app.$wallet.getWallet().platform.wallet.name === 'klip';

      let signResult;
      let sendResult;
      let randomHash;

      if (!isKlip) {
        const signResult = await this.$app.$tx.rejectNegotiation(payload.tradeId, payload.negoMaker, {
          type: 'rejectNegotiation'
        })

        if(!signResult.success) {
          return signResult
        }

        const sendResult = await dispatch('sendMessageTx', {
          cate: 'sell',
          ...signResult.data
        })
      }
      else if (isKlip) {
        const { tradeId, negoMaker } = payload;
        randomHash = this.$app.$tx.getRandomHash();
        const klipContractName = 'SellOfferContract';
        const klipMethodName = 'rejectNego';
        const klipParams = [randomHash, tradeId, negoMaker];

        sendResult = await this.$app.$wallet.sendKlipTransaction({
          to: this.$app.$tx.getContractAddress(klipContractName),
          value: '0',
          abi: JSON.stringify(this.$app.$tx.getContractFunctionAbi(klipContractName, klipMethodName)),
          params: JSON.stringify(klipParams)
        });
      }

      if(!sendResult.success) {
        return sendResult
      }

      const sendDetail = await this.$app.$http.post('declineNego', {
        body: {
          msg: signResult ? signResult.data.message : '',
          signHash: signResult ? signResult.data.signature : randomHash,
          connectAddr: getters.getUserInfo.address,
          hashType: getters.getChainInfo.chain === 'KLAYTN' ? 2 : 1,
          declineType: payload.reason.type,
          declineReason: payload.reason.message
        },
        urlParams: {
          sellId: payload.tradeId,
          negoId: payload.negoId
        }
      })

      if(sendDetail.success) {
        dispatch('updateNegotiationStatus', {
          user: payload.negoMaker,
          status: 3,
          statusStr: 'CANCEL'
        })
      }

      return sendDetail
    },

    updateNegotiationStatus({commit, getters}, payload) {
      // 성공했으니 API 재호출 없이 상태 업데이트
      const newItemInfo = _.cloneDeep(getters.getItemInfo)

      /*
      newItemInfo.exchange.negos = _.map(newItemInfo.exchange.negos, nego => {
        if(this.$app.$wallet.isSameAddress(nego.accountAddress, payload.user)) {
          nego.status = payload.status
          nego.statusStr = payload.statusStr
        }

        return nego
      })
      commit('SET_ITEM_INFO', newItemInfo)
       */
    },

    async showActivityDetail({commit, dispatch, getters}, payload) {
      let info = {}

      if(payload.event === 'NEGO_REJECT' || payload.event === 'SELL_CANCEL' || payload.event === 'BID_FAIL') {
        const res = await this.$app.$http.get('getSellOrder', {
          urlParams: {
            offerId: payload.body.offerId
          }
        })

        if(!res.success) {
          return false
        }

        info = new AssetSaleOffer(res.info.items[0])
      }

      dispatch('showModal', {
        component: 'AboutMyOfferModal',
        params: {
          type: payload.type,
          event: payload.event,
          info,
          tradeId: payload.body.offerId,
          page: payload.body.page
        }
      })
    },

    async reportItem({commit, dispatch}, payload) {
      const res = await this.$app.$http.post('reportItem', {
        body: {
          tokenAddress: payload.tokenAddress,
          tokenId: payload.tokenId,
          reason: payload.reason
        }
      })

      if(res.success) {
        const $t = this.$app.$t.bind(this.$app)

        dispatch('showAlert', {
          title: $t('Market.Thanks'),
          content: $t('Market.ReportSuccess')
        })
      }

      return res
    },

    async setMyItems(store, payload) {
      const baseURL = process.env.VUE_APP_API_ENDPOINT;
      const pathURL = `v1/account/${this.$app.getUserInfo.address}/nfts`;
      const targetURL = `${baseURL}/${pathURL}`;
      const res = await axios.get(targetURL);

      if(res.status === 200) {
        store.commit('SET_MY_ITEMS', {items: res.data.items});
      }
    },

    async setMyLocalItems(store, payload) {
      const localItems = [];
      if (!Boolean(this.$app.getUserInfo.address)) return;
      for (const nft of store.getters.getSupportNft) {
        const currentAddress = nft.address[store.getters.getChainInfo.chain];
        const res = await this.$app.$wallet.getNftBalance(currentAddress);
        for (const row of res) {
          localItems.push(row);
        }
      }

      store.commit('SET_MY_LOCAL_ITEMS', {
        myLocalItems: localItems
      });
    }
  },
  getters: {
    getItemInfo(state) {
      return state.itemInfo
    },

    getWritingInfo(state) {
      return state.writingInfo
    },

    getRelatedItems(state) {
      return state.relatedItems
    },

    getItemHistory(state) {
      return state.itemHistory
    },

    getMyItems(state) {
      return state.myItems;
    },

    getMyLocalItems(state) {
      return state.myLocalItems;
    },

    getLike(state) {
      return state.like;
    }
  }
}
