import Caver from 'caver-js'

import Store from '@/store'
import ContractList from '@/constants/ContractList'
import KIP7ABI from '@/constants/abi/KIP7Standard'
import KIP17ABI from '@/constants/abi/KIP17Standard'
import ReserveABI from '@/constants/abi/ReserveContract'
import AuctionABI from '@/constants/abi/AuctionContract'
import BuyOfferABI from '@/constants/abi/BuyOfferContract'
import SellOfferABI from '@/constants/abi/SellOfferContract'
import StakingABI from '@/constants/abi/StakingContract'
import EthvaultABI from '@/constants/abi/ethvault-abi.json';
import ExecutorABI from '@/constants/abi/ExecutorContract.json';
//
import EthvaultTestABI from '@/constants/abi/EthvaultTest.json';
//
import KlayminterABI from '@/constants/abi/klayminter-abi.json';

const ethJsUtil = require('ethereumjs-util')

// TODO : Reserve, Auction, Sell, Bid 등 각 주요 컨트랙트 캐싱
// TODO : Bridge : 다중 브릿지 도입 시 타겟 체인 확인
// TODO : Bridge : Receive Address 확인
export default class RequestTxPlugin {
  constructor(props) {
    this._caver = {}
    this._wallet = props.wallet

    this.initReserveCaver()
  }

  initReserveCaver() {
    const isMainNet = this._wallet.isMainNet()
    // const rpcUrl = isMainNet ? 'wss://cypress-rpc.klaytn.ozys.net:8652' : 'wss://api.cypress.ozys.net:8652'
    const rpcUrl = isMainNet ? process.env.VUE_APP_PROVIDER_URL_CYPRESS : process.env.VUE_APP_PROVIDER_URL_BAOBAB;

    this._caver = new Caver(new Caver.providers.WebsocketProvider(rpcUrl))
  }

  // Only Klaytn 컨트랙트
  getAuctionContract() {
    return new this._caver.contract(AuctionABI, ContractList.AuctionContract)
  }

  // Only Klaytn 컨트랙트
  getReserveContract() {
    return new this._caver.contract(ReserveABI, ContractList.ReserveContract)
  }

  // Only Klaytn 컨트랙트
  getStakingContract() {
    return new this._caver.contract(StakingABI, ContractList.StakingContract)
  }

  // Only Klaytn 컨트랙트
  getBuyOfferContract() {
    return new this._caver.contract(BuyOfferABI, ContractList.BuyOfferContract)
  }

  // Only Klaytn 컨트랙트
  getSellOfferContract() {
    return new this._caver.contract(SellOfferABI, ContractList.SellOfferContract)
  }

  getExecutorContract() {
    return new this._caver.contract(ExecutorABI, ContractList.ExecutorContract);
  }

  // 입출금 대상 주소(클레이튼 : Reserve, 이더리움 : 입금은 Bridge 출금은 Reserve)
  // inOrOut : 0(입금), 1(출금)
  getTargetCurrencyIO(inOrOut) {
    const { chain } = Store.getters.getChainInfo
    const reserveAddress = this.getReserveContract()._address
    const bridgeVaultAddress = this.getEthVaultContract()._address

    if(chain === 'KLAYTN') {
      return reserveAddress
    }

    if(chain === 'ETHEREUM') {
      if(inOrOut === 0) {
        return bridgeVaultAddress
      }

      return reserveAddress
    }

    return ''
  }

  getKip7Contract(address) {
    return new this._wallet.getContract({
      abi: KIP7ABI,
      address
    })
  }

  getKip17Contract(address) {
    return new this._wallet.getContract({
      abi: KIP17ABI,
      address
    })
  }

  getEthVaultContract() {
    return new this._wallet.getContract({
      abi: EthvaultABI,
      address: ContractList.EthVaultContract
    })
  }

  getKlayminterContract() {
    return new this._wallet.getContract({
      abi: KlayminterABI,
      address: ContractList.KlayMintContract
    })
  }

  getERC20TestContract() {
    return new this._wallet.getContract({
      abi: EthvaultTestABI,
      address: ContractList.EthVaultContract
    })
  }

  // RandomHash 32 Byte = 진짜 RandomHash 28 byte + 16진수화된 Unix TimeStamp 4 Byte
  getRandomHash(byteLength = 28) {
    const defaultHex = this._wallet.utils.randomHex(byteLength)
    const now = this._wallet.utils.toHex(parseInt(Store.$app.$date.getNow().ts / 1000)).slice(2)

    return `${defaultHex}${now}`
  }

  async signWithMessage(data, params) {
    // Tx 진행 모달 노출
    Store.dispatch('showModal', {
      component: 'TxProgressModal',
      params: {
        ...(params.detail || {}),
        hash: params.hash
      }
    })

    const signedResult = await this._wallet.signMessage(data)

    if(!signedResult.success) {
      Store.$app.showAlert({
        title: Store.$app.$t('General.TransactionFail')
      });

      Store.$app.$eventBus.$emit('onReceiveTxPending', {
        result: 'fail',
        hash: params.hash
      })

      return signedResult
    }

    const signatureBuffer = ethJsUtil.toBuffer(signedResult.data)
    const signatureParams = ethJsUtil.fromRpcSig(signatureBuffer)

    return {
      success: true,
      data: {
        requestHash: params.hash,
        message: data,
        signature: signedResult.data,
        v: this._wallet.utils.numberToHex(signatureParams.v),
        r: signatureParams.r.toString('hex'),
        s: signatureParams.s.toString('hex')
      }
    }
  }

  async sendTransaction({ sendParams, methodDetail }) {
    return new Promise((resolve, reject) => {
      this._wallet.sendTransaction(methodDetail.name, {
        ...sendParams,
        methodDetail
      }).then(receipt => {
        resolve(receipt)
      }).catch(e => {
        reject(e)
      })
    })
  }

  async addAuction(params, detail) {
    const hash = this.getRandomHash()
    const _auction = this.getAuctionContract()
    const data = _auction.methods.addAuction(
      hash,
      params.tokenAddress,
      params.tokenId,
      params.biddingToken,
      params.minAmount,
      params.maxAmount,
      params.duration,
      params.isInstantTrade
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async placeBid(tradeId, amount, detail) {
    const hash = this.getRandomHash()
    const _auction = this.getAuctionContract()
    const methodParams = [hash, tradeId, amount]
    const data = _auction.methods.placeBid(...methodParams).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async editAuction(params, detail) {
    const hash = this.getRandomHash()
    const _auction = this.getAuctionContract()
    const data = _auction.methods.editAuction(
      hash,
      params.tradeId,
      params.biddingToken,
      params.minAmount,
      params.maxAmount,
      params.duration,
      params.isInstantTrade
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async cancelAuction(tradeId, detail) {
    const hash = this.getRandomHash()
    const _auction = this.getAuctionContract()
    const data = _auction.methods.cancelAuction(hash, tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async closeAuction(tradeId, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const data = _auction.methods.closeAuction(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail
    });
  }

  async isApproved(params, isNft) {
    const _reserve = this.getReserveContract()
    const tokenContract = isNft ? this.getKip17Contract(params.tokenAddress) : this.getKip7Contract(params.tokenAddress)
    const userAddress = Store.getters.getUserInfo.address

    const methodName = isNft ? 'getApproved' : 'allowance'
    const methodParams = isNft ? [params.tokenId] : [userAddress, _reserve._address]

    return await tokenContract.methods[methodName](...methodParams).call().catch(() => {
      return -1
    })
  }

  generateBridgeRandomHash() {
    return this._wallet.collection.eth.abi.encodeParameters(
      ['address', 'bytes32'],
      [Store.getters.getUserInfo.address, this._wallet.utils.randomHex(32)]
    )
  }

  async approveToken(params, isNft) {
    // 브릿지 입금인 경우 인가 대상은 EthVault
    const target = (params.isBridge ? this.getEthVaultContract() : this.getReserveContract())._address
    const tokenContract = isNft ? this.getKip17Contract(params.tokenAddress) : this.getKip7Contract(params.tokenAddress)
    const spendValue = this._wallet.utils.hexToNumberString('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

    const methodName = 'approve'
    const methodParams = isNft ? [target, params.tokenId] : [target, spendValue]
    const data = tokenContract.methods[methodName](...methodParams).encodeABI()

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: tokenContract._address,
        data,
        value: '0'
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: isNft ? KIP17ABI : KIP7ABI
      }
    }).catch(err => {
      Log('error : ', err)
    })
  }

  // TODO : 이미 예치 이력이 있는 것은 Approve 체크 안하기
  async depositToken(token, amount, chainInfo) {
    const isToken = parseInt(token) !== 0

    if(isToken) {
      const getIsApproved = await this.isApproved({
        tokenAddress: token
      }, false)

      if(getIsApproved === -1) {
        return {
          success: false,
          error: new Error('allowance_failed')
        }
      }

      if(getIsApproved === '0') {
        const approveRes = await this.approveToken({
          tokenAddress: token,
          isBridge: chain === 'ETHEREUM'
        }, false)

        if(!approveRes.success) {
          return {
            success: false,
            error: new Error('approve_failed')
          }
        }
      }
    }

    if(chainInfo.chain === 'ETHEREUM') {
      return await this.depositBridgeToken(token, amount)
    }

    const _reserve = this.getReserveContract()
    const methodName = isToken ? 'depositToken' : 'deposit'
    const methodParams = isToken ? [token, amount] : []
    const data = _reserve.methods[methodName](...methodParams).encodeABI()

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: _reserve._address,
        data,
        value: isToken ? '0' : amount
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI
      }
    })
  }

  async depositBridgeToken(token, amount) {
    const ethVault = this.getEthVaultContract()
    const toAddr = this.getReserveContract()._address

    const isToken = parseInt(token) !== 0
    const dataHash = this.generateBridgeRandomHash()

    const methodName = isToken ? 'depositToken' : 'deposit'
    const methodParams = isToken ? [token, 'KLAYTN', toAddr, amount, dataHash] : ['KLAYTN', toAddr, dataHash]

    const data = ethVault.methods[methodName](...methodParams).encodeABI()

    return await this.sendTransaction({
      sendParams: {
        to: ethVault._address,
        data,
        value: isToken ? '0' : amount
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI
      }
    })
  }

  // TODO : 이미 예치 이력이 있는 것은 Approve 체크 안하기
  async depositNft(tokenAddress, tokenId, chain) {
    const _reserve = this.getReserveContract()
    const getIsApproved = await this.isApproved({
      tokenAddress,
      tokenId
    }, true)

    if(getIsApproved === -1) {
      return {
        success: false,
        error: new Error('allowance_failed')
      }
    }

    if(parseInt(getIsApproved) === 0 || !this._wallet.isSameAddress(getIsApproved, _reserve._address)) {
      const approveRes = await this.approveToken({
        tokenAddress,
        tokenId,
        isBridge: chain === 'ETHEREUM'
      }, true)

      if(!approveRes.success) {
        return {
          success: false,
          error: new Error('approve_failed')
        }
      }
    }

    if(chain === 'ETHEREUM') {
      return this.depositBridgeNft(tokenAddress, tokenId)
    }

    const methodName = 'depositNft'
    const methodParams = [tokenAddress, tokenId]
    const data = _reserve.methods[methodName](...methodParams).encodeABI()

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: _reserve._address,
        data,
        value: '0'
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI
      }
    })
  }

  async depositBridgeNft(tokenAddress, tokenId) {
    const ethVault = this.getEthVaultContract()
    const toAddr = this.getReserveContract()._address

    const methodName = 'depositNFT'
    const dataHash = this.generateBridgeRandomHash()
    const methodParams = [tokenAddress, 'KLAYTN', toAddr, tokenId, dataHash]
    const data = ethVault.methods.depositNFT(...methodParams).encodeABI()

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: ethVault._address,
        data,
        value: '0'
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI
      }
    })
  }

  async withdrawToken(token, amount, detail, chain, toAddress) {
    const hash = this.getRandomHash()
    const _reserve = this.getReserveContract()
    const data = _reserve.methods.withdraw(hash, token, amount, toAddress).encodeABI()

    if(chain === 'ETHEREUM' && detail.action !== 'transfer') {
      return this.withdrawBridgeToken(token, amount, hash, detail, chain)
    }

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  // TODO : isSendToOrigin 내용 확인
  async withdrawBridgeToken(token, amount, hash, detail, chain) {
    const _reserve = this.getReserveContract()

    const data = _reserve.methods.bridgeWithdrawToken(
      hash,
      ContractList.KlayMintContract,
      Store.getters.getUserInfo.address,
      token,
      amount,
      true,
      chain === 'ETHEREUM' ? 'ETH' : chain
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail: {}
    })
  }

  async stakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();
    const msg = _staking.methods.staking(hash, amount).encodeABI();

    return await this.signWithMessage(msg, {
      hash,
      detail
    });
  }

  async unstakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();

    const data = _staking.methods.unstaking(hash, amount).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail
    });
  }

  async claimUnstakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();
    const uid = detail.uid;

    const data = _staking.methods.claimUnstaking(hash, uid).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async claimRewardToken(token, amount, detail) {
    const hash = this.getRandomHash()
    const _staking = this.getStakingContract()
    const data = _staking.methods.claimReward(hash).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async withdrawNft(tokenAddress, tokenId, detail, chain, toAddress) {
    const hash = this.getRandomHash()
    const _reserve = this.getReserveContract()
    const data = _reserve.methods.withdrawNft(hash, tokenAddress, tokenId, toAddress).encodeABI()

    if(chain === 'ETHEREUM' && detail.action !== 'transferNft') {
      return this.withdrawBridgeNft(tokenAddress, tokenId, hash, detail, chain, toAddress)
    }

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async withdrawBridgeNft(tokenAddress, tokenId, hash, detail, chain) {
    const _reserve = this.getReserveContract()
    const data = _reserve.methods.bridgeWithdrawNft(
      hash,
      ContractList.KlayMintContract,
      Store.getters.getUserInfo.address,
      tokenAddress,
      tokenId,
      true,
      chain === 'ETHEREUM' ? 'ETH' : chain
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async addBuyOffer(params, detail) {
    const hash = this.getRandomHash()
    const _buyOffer = this.getBuyOfferContract()
    const data = _buyOffer.methods.addBuyOffer(hash, params.tokenAddress, params.tokenId, params.currency, params.amount).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async editBuyOffer(params, detail) {
    const hash = this.getRandomHash()
    const _buyOffer = this.getBuyOfferContract()
    const data = _buyOffer.methods.editBuyOffer(hash, params.tradeId, params.currency, params.amount).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async cancelBuyOffer(params, detail) {
    const hash = this.getRandomHash()
    const _buyOffer = this.getBuyOfferContract()
    const data = _buyOffer.methods.cancelBuyOffer(hash, params.tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  // 이 부분 볼 것.
  // 협상 철회 관련.
  async closeBuyOffer(tradeId, detail) {
    const hash = this.getRandomHash()
    const _buyOffer = this.getBuyOfferContract()

    const data = _buyOffer.methods.sellNft(hash, tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async addSellOffer(params, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.addSellOffer(
      hash,
      params.tokenAddress,
      params.tokenId,
      params.currency,
      params.amount, // 즉시 체결가
      params.isNegotiable
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async editSellOffer(params, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.editSellOffer(
      hash,
      params.tradeId,
      params.currency,
      params.amount, // 즉시 체결가
      params.isNegotiable
    ).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async cancelSellOffer(params, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.cancelSellOffer(hash, params.tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  // 세 컨트랙트 모두 retrieve 메소드의 이름 및 인터페이스는 동일
  async retrieveAsset(tradeId, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    // const data = _sellOffer.methods.retrieve(hash, tradeId).encodeABI()
    const data = _sellOffer.methods.cancelNego(hash, tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async addNego(params, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.addNego(hash, params.tradeId, params.currency, params.newPrice).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async directExchange(cate, tradeId, detail) {
    if(cate === 'buy') {
      return await this.closeBuyOffer(tradeId, detail)
    }

    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.buyNft(hash, tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async cancelNegotiation(tradeId, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.cancelNego(hash, tradeId).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async acceptNegotiation(tradeId, negoMaker, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.acceptNego(hash, tradeId, negoMaker).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async rejectNegotiation(tradeId, negoMaker, detail) {
    const hash = this.getRandomHash()
    const _sellOffer = this.getSellOfferContract()
    const data = _sellOffer.methods.rejectNego(hash, tradeId, negoMaker).encodeABI()

    return await this.signWithMessage(data, {
      hash,
      detail
    })
  }

  async modifyUserInfo(params) {
    const stringifyParams = JSON.stringify({
      ...params,
      requestedAt: Store.$app.$date.getNow().toFormat('fff')
    }, null, 2)
    const hexlifyParams = `0x${new Buffer(stringifyParams).toString('hex')}`

    return await this.signWithMessage(hexlifyParams, {
      hash: this.getRandomHash(),
      detail: {}
    })
  }


  async getStakingAmount(walletAddress) {
    const _staking = this.getStakingContract();
    return await _staking.methods.stakingBalance(walletAddress).call();
  }

  async getUnstakingAmount(walletAddress) {
    const _staking = this.getStakingContract();
    return await _staking.methods.pendingBalance(walletAddress).call();
  }

  // 유저의 스테이킹 보상 > 청구 가능수량 디버깅용
  async getUserClaimableAmount(currency, rewardTokenIndex) {
    const $bn = Store.$app.$bn;
    const _staking = this.getStakingContract();
    const user = Store.getters.getUserInfo.address;

    const stakingBalance = await _staking.methods.stakingBalance(user).call();
    const IndexPrecision = await _staking.methods.IndexPrecision().call();
    const rewardIndex = await _staking.methods.rewardInfo(rewardTokenIndex).call().then(res => {
      Log('rewardInfo : ', res);
      return res.index;
    });
    const balanceIndex = await _staking.methods.userInfoList(user, currency).call().then(res => {
      Log('userInfoList : ', res);
      return res.index;
    });

    return $bn.toMaxUnit($bn.mulBN(stakingBalance, $bn.subBN(rewardIndex, balanceIndex)).divBN(IndexPrecision).toString(), 18);
  }
}
