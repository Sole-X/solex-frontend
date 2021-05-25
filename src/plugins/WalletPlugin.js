import OzysWallet from '@/lib/ozys-wallet'
import { kip7JsonInterface, kip17JsonInterface, kip7ByteCode, kip17ByteCode } from 'caver-js/packages/caver-kct/src/kctHelper'

import Store from '@/store'
import {getResult, request} from "klip-sdk";

const $wallet = new OzysWallet({
  chain: 'KLAYTN',
  network: process.env.VUE_APP_NETWORK,
  providerType: 1,
  providerUrl: {
    8217: process.env.VUE_APP_PROVIDER_URL_CYPRESS,
    1001: process.env.VUE_APP_PROVIDER_URL_BAOBAB
  },
  otherOptions: {
    siteName: 'Sole-X'
  }
})

export default class WalletPlugin {
  constructor() {
    this.collection = {}
    this.utils = {}

    this.blockWatcher = {}
    this.blockStatusWatcher = null
    this.rpcProviderWatcher = () => {
      return this.initWalletAPI()
    }

    this.initProviderWatcher()
  }

  getInstallURL() {
    const { service, siteName } = $wallet.lastProps

    return $wallet.getStore().state.profile.getInstallURL(service, siteName)
  }

  getWallet() {
    return $wallet;
  }

  getContract(params) {
    return $wallet.getContract(params)
  }

  isEnableAccountChange() {
    return true
  }

  isDev() {
    return process.env.VUE_APP_PROFILE !== 'live'
  }

  isMainNet() {
    const chain = $wallet.platform.name
    const netId = $wallet.getStore().state.network.id

    return chain === 'ETHEREUM' ? netId === 1 : netId === 8217
  }

  checkWalletDisable() {
    return !this.isMainNet() && process.env.VUE_APP_PROFILE !== 'dev'
  }

  async setSelectedService(service) {
    return $wallet.select({
      service
    })
  }

  async connectToService(newProps) {
    const { chain, service } = newProps

    let network

    // TODO : 지원 네트워크가 아닌 경우(예: 메타마스크로 BSC 연결 등) 대응
    if (chain === 'ETHEREUM') {
      network = Number(window.ethereum.networkVersion)
    } else if (chain === 'KLAYTN') {
      if (service === 'kaikas') {
        network = Number(window.klaytn.networkVersion)
      } else if (service === 'klip') { // klip은 메인넷만 지원
        network = 8217
      }
    }

    const _promise = $wallet.access({
      ...newProps,
      network,
      providerType: 1,
      otherOptions: newProps.chain === 'ETHEREUM' ? {
        apiKey: process.env.VUE_APP_INFURA_KEY,
      } : {
        siteName: 'Sole-X'
      }
    })

    let requestKey
    _promise.on('requestKey', key => {
      requestKey = key
      if(!Store.getters.getPlatformInfo.isMobile) {
        Store.dispatch('executeKlipWeb2App', {
          type: 'connect',
          requestKey
        })
      }
    })

    _promise.on('__finished', async res => {
      const enableTestNet = Store.getters.getEnableTestNet

      if(!enableTestNet && res?.data?.netId === 1001) {
        this.disconnectWallet()

        return {
          success: false,
          error: new Error('disable_testnet')
        }
      }

      if(requestKey) { // Klip Web2App API
        Store.$app.$eventBus.$emit('klipRequestFinished', {
          success: res.success,
          requestKey
        })
      }

      if(res.success) {
        await this.setNetwork(res.data.netId)
        this.initProviderWatcher()
      }

      return res
    })

    return _promise
  }

  disconnectWallet() {
    return $wallet.disconnect()
  }

  initProviderWatcher() {
    if(!this.isEnableAccountChange()) {
      return
    }

    const _store = $wallet.getStore()

    _store.subscribe((newState, prevState) => {
      if(newState.account !== prevState.account) {
        if(newState.account && !prevState.account) {
          return
        }

        if(!this.isEnableAccountChange() || !newState.account) {
          return
        }

        Store.dispatch('updateUserInfo', {
          address: newState.account
        })
      }

      if(newState.network.id !== prevState.network.id) {
        if(!this.isEnableAccountChange()) {
          return
        }

        if(this.checkWalletDisable()) {
          alert(Store.$app.$t('OnlyAvailableInMainNet').replace('<br/>', '\n'))
          return window.location.reload()
        }

        Store.$app.$tx.initReserveCaver()
        this.setNetwork(Number(newState.network.id), true)
      }
    })

    _store.watcher.off('reconnectSocket', this.rpcProviderWatcher)
    setTimeout(() => _store.watcher.on('reconnectSocket', this.rpcProviderWatcher), 100)
  }

  async setNetwork() {
    Store.dispatch('setChainInfo', {
      chain: $wallet.platform.name,
      network: $wallet.getStore().state.network
    })

    this.initWalletAPI()
  }

  // initWalletAPI가 init되지 않음.
  initWalletAPI() {
    this.collection = $wallet.getPublicAPI()
    this.utils = this.collection.utils

    this.subscribeNewBlock()
  }

  getRpcInstance() {
    const { chain } = Store.getters.getChainInfo

    if(chain === 'ETHEREUM') {
      return this.collection.eth
    }

    if(chain === 'KLAYTN') {
      return this.collection.klay
    }

    return {}
  }

  async subscribeNewBlock() {
    if($wallet.getStore().state.providerType === 0) {
      return
    }

    if(this.blockWatcher && this.blockWatcher.unsubscribe) {
      this.blockWatcher.unsubscribe()
      this.blockWatcher = null
    }

    // Store.dispatch('setNetworkHealth', 101)
    // 블록 싱크가 아예 죽은 경우 구독이 안될테니 직접 RPC 요청 보내서 초기화 진행
    const initBlock = await this.getRpcInstance().getBlock('latest').catch(() => {
      // 블록 초기화 실패 시 코드 500으로 처리
      // Store.dispatch('setNetworkHealth', 500)

      return -1
    })

    // 블록 초기화 값이 정상이라면 그대로 기본 값으로 설정
    if(initBlock !== -1) {
      Store.dispatch('setChainInfo', {
        block: {
          height: Number(initBlock.number),
          timestamp: Number(initBlock.timestamp)
        }
      })
    }

    this.blockWatcher = this.getRpcInstance().subscribe('newBlockHeaders', (err, res) => {
      if(err) {
        return
      }

      Store.dispatch('setChainInfo', {
        block: {
          height: res.number,
          timestamp: res.timestamp,
          receivedAt: parseInt(Store.$app.$date.getNow().ts / 1000)
        }
      })
    })
  }

  initBlockStatusWatcher() { // 사이트 초기화 이후 지연 상태가 되는 경우 대응
    let lastTryId = 0
    let maxTryCount = 30
    let recoverCaverWatcher = null

    const _store = Store
    const clearTry = () => {
      clearInterval(recoverCaverWatcher)
      recoverCaverWatcher = null
    }

    this.blockStatusWatcher = setInterval(() => {
      const now = parseInt(Store.$app.$date.getNow().ts / 1000)
      const lastHealth = _store.getters.getNetworkHealth
      const lastReceivedAt = _store.getters.getChainInfo.block.receivedAt
      const lastBlockTimestamp = _store.getters.getChainInfo.block.timestamp

      if(now > lastBlockTimestamp + 60 && lastHealth === 200) {
        Store.dispatch('setNetworkHealth', 504)
      }

      if(now > lastReceivedAt + 20 && lastTryId < maxTryCount + 1 && !recoverCaverWatcher) {
        lastTryId = 0

        recoverCaverWatcher = setInterval(async () => {
          let newTryId = ++lastTryId

          if(newTryId === maxTryCount + 1) {
            Store.$app.$_ModalMixin_showOkayAlert({
              text: Store.$app.$t('DisableSocketRetry')
            })

            return clearTry()
          }

          const reconnectResult = await $wallet.platform.restartWalletAPI()

          if(reconnectResult && newTryId === lastTryId) {
            clearTry()
            this.initWalletAPI()
          }
        }, 1000 * 10)
      }
    }, 1000)
  }

  async signMessage(message) {
    return await $wallet.platform.wallet.signMessage(message)
  }

  async getEstimateGas(action, tx) {
    let gas = 0

    try {
      const estimateGas = await this.getRpcInstance().estimateGas(tx)
      gas = Math.floor(estimateGas * 1.5)
    } catch(e) {
      Store.$app.$eventBus.$emit('failureEstimateGas', {
        action
      })

      Log('estimateGas error : ' + JSON.stringify({
        message: e.message,
        txParam: tx
      }))

      return -1
    }

    return String(gas)
  }

  async getEstimateValue(action, _tx) {
    const tx = _.cloneDeep(_tx)

    // 클립은 아직 수수료 안내니까 제외
    if($wallet.platform.appName === 'klip') {
      return tx
    }

    tx.gas = await this.getEstimateGas(action, tx)

    if(tx.gas === -1) {
      return -1
    }

    /*
    const _vm = Store.$app
    const currencyToPeb = '0' // TODO : API

    // 최대 예상 수수료(gasLimit * gasPrice) 계산해서 트랜잭션 발생에 들어갈 실질 기축 소모 수량 계산
    const estimateFee = await this.getRpcInstance().getGasPrice().then(res => {
      const gasPrice = this.utils.hexToNumberString(res)

      return _vm.$bn.mulBN(String(tx.gas), gasPrice)
    }).catch(() => {
      return '0'
    })
    const estimateValue = estimateFee.addBN(_tx.value)

    // 만약 실질 기축 소모 수량이 내 기축 보유 수량보다 큰 경우 기존 value 값에서 최대 예상 수수료를 뺴주기
    if(currencyToPeb.dcomp(estimateValue.toString()) === -1) {
      tx.value = _vm.$bn.subBN(_tx.value, estimateFee).toString()

      if(tx.value.dcomp('0') === -1) {
        tx.value = '-1'
      }
    }
    */

    return tx
  }

  async getCommonTxParams(action, _tx, wallet) {
    return await this.getEstimateValue(action, {
      type: _tx.type,
      from: wallet.address,
      to: _tx.to,
      value: _tx.value || '0',
      data: _tx.data || '0x'
    })
  }

  async getKlipTxParams(action, _tx, wallet) {
    const $bn = Store.$app.$bn
    const tx = await this.getEstimateValue(action, {
      type: _tx.type,
      from: wallet.address,
      to: _tx.to,
      value: _tx.value || '0',
      data: _tx.data || '0x'
    })
    tx.value = this.utils.hexToNumberString(tx.value)

    if(action === 'sendKLAY' || action === 'sendToken') {
      return {
        _eventName: action,
        body: {
          from: wallet.address,
          to: _tx.to,
          amount: $bn.toMaxUnit(tx.value, 18, 6)
        }
      }
    }

    const { methodDetail } = _tx
    const abi = methodDetail.abi
    const methodABI = _.find(abi, row => {
      return row.name === methodDetail.name
    }) || {}

    return {
      _eventName: 'executeContract',
      body: {
        from: wallet.address,
        to: tx.to,
        value: $bn.toMinUnit($bn.toMaxUnit(tx.value, 18, 6), 18),
        method: {
          name: methodDetail.name,
          abi: JSON.stringify(methodABI),
          params: JSON.stringify(methodDetail.params)
        }
      }
    }
  }

  async sendTransaction(action, _tx, needTokenUpdate = true) {
    const _vm = Store.$app

    // 카이카스 잠긴 경우 대응
    if(this.isEnableAccountChange()) {
      const isUnlocked = await $wallet.platform.wallet.isUnlocked()

      if(!isUnlocked) {
        const reconnect = await this.connectToService($wallet.platform.wallet.name)

        if(reconnect.success) {
          return this.sendTransaction(action, _tx, needTokenUpdate)
        }

        return {
          success: false,
          error: new Error('kaikas_locked')
        }
      }
    }

    const wallet = Store.getters.getUserInfo

    if (!wallet)
      return

    const isKlip = $wallet.platform.wallet.name === 'klip'
    const getParamsMethod = isKlip ? 'getKlipTxParams' : 'getCommonTxParams'
    const tx = await this[getParamsMethod](action, _tx, wallet)

    if (tx === -1) {
      return {
        success: false,
        error: new Error('fail_estimate_gas')
      }
    }

    if (tx.value === '-1') {
      return {
        success: false,
        error: new Error('insufficient_funds')
      }
    }

    if (isKlip) {
      const klipResult = await this.sendKlipTransaction(_tx.klipDetail);

      Store.$app.showModal({
        component: 'TxResultModal',
        params: {
          action: 'transaction',
          success: klipResult.success,
          txHash: klipResult.result.tx_hash,
        }
      })

      return klipResult;
    }

    const promise = $wallet.broadcastTx(tx)
    let transactionHash
    let requestKey

    promise.once('requestKey', key => { // Klip 전용
      if(!key) {
        return
      }

      requestKey = key

    }).once('transactionHash', res => {
      transactionHash = res

      // 이더리움의 경우 컨펌 전까지 프로그레스
      if ($wallet.platform.name === 'ETHEREUM') {
        Store.dispatch('showModal', {
          component: 'TxProgressModal',
          params: {
            hash: transactionHash
          }
        })
      }
    }).on('receipt', receipt => {
      // Kaikas MaxListenersExceededWarning 에러 해결법
      promise.removeAllListeners()

      _vm.$eventBus.$emit('klipRequestFinished', {
        success: false,
        requestKey
      })

      // 이더리움의 경우 컨펌 끝나고 프로그레스 닫기
      if ($wallet.platform.name === 'ETHEREUM') {
        _vm.$eventBus.$emit('onReceiveTxResult', {
          result: receipt.status === '0x1',
          hash: transactionHash
        })
      }
    }).on('error', e => {
      // Kaikas MaxListenersExceededWarning 에러 해결법
      promise.removeAllListeners()

      _vm.$eventBus.$emit('klipRequestFinished', {
        success: false,
        requestKey
      })

      // 이더리움의 경우 컨펌 끝나고 프로그레스 닫기
      if ($wallet.platform.name === 'ETHEREUM') {
        _vm.$eventBus.$emit('onReceiveTxResult', transactionHash)
      }

      Log('sendTx Error : ', JSON.stringify(e))
    })

    return promise
  }

  sendKlipTransaction({ to, value, abi, params }) {
    return new Promise((resolve, reject) => {
      // klip Store에서 쏘는 이벤트를 받았을 때.
      Store.$app.$eventBus.$once('prepareKlipSuccess', requestKey => {
        if (!requestKey) {
          return;
        }

        Store.$app.showModal({
          component: 'KlipRequestModal',
          params: {
            requestKey: requestKey
          }
        })

        Store.dispatch('pollingUntilGetResult', {
          requestKey: requestKey
        })

        Store.$app.$eventBus.$on('klipRequestFinished', async (payload) => {
          resolve({
            success: true,
            ...payload
          })
        });
      })

      const type = 'executeContract';
      const body = {
        bappName: process.env.VUE_APP_SITE_NAME,
        to, // 컨트랙트의 주소
        value, // 컨트랙트 실행하면서 같이 보낼 KLAY 수량 (단위 : peb)
        abi, // 실행할 함수의 abi
        params, // 실행할 함수의 인자 목록
        from: Store.getters.getUserInfo.address
      }

      Store.dispatch('prepareKlip', {
        type,
        body
      });
    })
  }

  /*
  더 확실한 방법. but 임시로 아래 함수를 사용.
  isSameAddress(addressA, addressB) {
    try {
web3-utils/src/index.js 의 toChecksumAddress가 this.utils에 포함이 되지 않아서 생기는 오류.
      if (!this.utils.toChecksumAddress) {
        this.initWalletAPI();
      }
      const checksumAddressA = !addressA ? '-1' : this.utils.toChecksumAddress(addressA)
      const checksumAddressB = !addressB ? '-2' : this.utils.toChecksumAddress(addressB)

      return checksumAddressA === checksumAddressB
    } catch(e) {
      return false
    }
  }
  */

  isSameAddress(addressA, addressB) {
    try {
      const addressAUpper = typeof addressA === 'string' ? addressA.toUpperCase() : '-1';
      const addressBUpper = typeof addressB === 'string' ? addressB.toUpperCase() : '-2';

      return addressAUpper === addressBUpper;
    } catch(e) {
      return false;
    }

  }

  isValidAddress(address) {
    try {
      return this.utils.isAddress(address)
    } catch(e) {
      return false
    }
  }

  getBlockUrl(block) {
    return $wallet.getBlockUrl(block)
  }

  getTxUrl(txHash, chain) {
    if(!chain) {
      return $wallet.getTxUrl(txHash)
    }

    let path = ''
    let isMainNet = this.isMainNet()

    if(chain === 'KLAYTN') {
      path = isMainNet ? 'https://scope.klaytn.com' : 'https://baobab.scope.klaytn.com'
    }

    if(chain === 'ETHEREUM') {
      path = isMainNet ? 'https://etherscan.io' : 'https://ropsten.etherscan.io'
    }

    return `${path}/tx/${txHash}`
  }

  getAccountUrl(address, chain) {
    if(!chain) {
      return $wallet.getAccountUrl(address)
    }

    let path = ''
    let isMainNet = this.isMainNet()

    if(chain === 'KLAYTN') {
      path = isMainNet ? 'https://scope.klaytn.com/account' : 'https://baobab.scope.klaytn.com/account'
    }

    if(chain === 'ETHEREUM') {
      path = isMainNet ? 'https://etherscan.io/address' : 'https://ropsten.etherscan.io/address'
    }

    return `${path}/${address}`
  }

  getTokenUrl(address, chain) {
    if(!chain) {
      return $wallet.getTokenUrl(address)
    }

    let path = ''
    let isMainNet = this.isMainNet()

    if(chain === 'KLAYTN') {
      path = isMainNet ? 'https://scope.klaytn.com/token' : 'https://baobab.scope.klaytn.com/token'
    }

    if(chain === 'ETHEREUM') {
      path = isMainNet ? 'https://etherscan.io/token' : 'https://ropsten.etherscan.io/token'
    }

    return `${path}/${address}`
  }

  getHashType(chain) {
    if(chain === 'KLAYTN') {
      return 2
    }

    return 1
  }

  async getBalance(address, user = Store.getters.getUserInfo.address) {
    if(!address) {
      return '0'
    }

    if(parseInt(address) === 0) {
      return await $wallet.getBalance(user)
    }

    const _token = Store.$app.$tx.getKip7Contract(address)

    return await _token.methods.balanceOf(user).call().catch((err) => {
      return '0'
    })
  }

  async getNftBalance(address) {
    const result = []
    const user = Store.getters.getUserInfo.address
    const _nft = Store.$app.$tx.getKip17Contract(address)
    const total = await _nft.methods.balanceOf(user).call().catch(() => {
      return 0
    })

    if(total === 0) {
      return result
    }

    for(let i = 0; i < total; i++) {
      const tokenId = await _nft.methods.tokenOfOwnerByIndex(user, i).call()
      const tokenUri = await _nft.methods.tokenURI(tokenId).call().then(res => {
        return res || {}
      })

      result.push({
        tokenId,
        tokenUri
      })
    }

    return result
  }
}
