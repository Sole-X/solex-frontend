import Caver from 'caver-js';

import Store from '@/store';
import ContractList from '@/constants/ContractList';
import KIP7ABI from '@/constants/abi/KIP7Standard';
import KIP17ABI from '@/constants/abi/KIP17Standard';
import ReserveABI from '@/constants/abi/ReserveContract';
import AuctionABI from '@/constants/abi/AuctionContract';
import BuyOfferABI from '@/constants/abi/BuyOfferContract';
import SellOfferABI from '@/constants/abi/SellOfferContract';
import StakingABI from '@/constants/abi/StakingContract';
import EthvaultABI from '@/constants/abi/ethvault-abi.json';
import ExecutorABI from '@/constants/abi/ExecutorContract.json';
import KlayminterABI from '@/constants/abi/klayminter-abi.json';

const ethJsUtil = require('ethereumjs-util');

export default class RequestTxPlugin {
  constructor(props) {
    this._caver = {};
    this._wallet = props.wallet;

    this.initReserveCaver();
  }

  initReserveCaver() {
    const isMainNet = this._wallet.isMainNet();

    // const rpcUrl = isMainNet ? 'wss://cypress-rpc.klaytn.ozys.net:8652' : 'wss://api.cypress.ozys.net:8652'
    const rpcUrl = isMainNet ? process.env.VUE_APP_PROVIDER_URL_CYPRESS : process.env.VUE_APP_PROVIDER_URL_BAOBAB;

    this._caver = new Caver(new Caver.providers.WebsocketProvider(rpcUrl));
  }

  getContractAddress(contractName) {
    return ContractList[contractName];
  }

  getContractFunctionAbi(contractName, funcName) {
    let abi;

    switch (contractName) {
      case 'ReserveContract':
        abi = ReserveABI;
        break;
      case 'AuctionContract':
        abi = AuctionABI;
        break;
      case 'BuyOfferContract':
        abi = BuyOfferABI;
        break;
      case 'SellOfferContract':
        abi = SellOfferABI;
        break;
      case 'StakingContract':
        abi = StakingABI;
        break;
      case 'EthVaultContract':
        abi = EthvaultABI;
        break;
      case 'KlayMintContract':
        abi = KlayminterABI;
        break;
      case 'ExecutorContract':
        abi = ExecutorABI;
        break;
      case 'KIP7Contract':
        abi = KIP7ABI;
        break;
      case 'KIP17Contract':
        abi = KIP17ABI;
        break;
    }

    for (const item of abi) {
      if (item.name === funcName) {
        return item;
      }
    }

    return null;
  }

  // Only Klaytn ????????????
  getAuctionContract() {
    return new this._caver.contract(AuctionABI, ContractList.AuctionContract);
  }

  // Only Klaytn ????????????
  getReserveContract() {
    return new this._caver.contract(ReserveABI, ContractList.ReserveContract);
  }

  // Only Klaytn ????????????
  getStakingContract() {
    return new this._caver.contract(StakingABI, ContractList.StakingContract);
  }

  // Only Klaytn ????????????
  getBuyOfferContract() {
    return new this._caver.contract(BuyOfferABI, ContractList.BuyOfferContract);
  }

  // Only Klaytn ????????????
  getSellOfferContract() {
    return new this._caver.contract(SellOfferABI, ContractList.SellOfferContract);
  }

  getExecutorContract() {
    return new this._caver.contract(ExecutorABI, ContractList.ExecutorContract);
  }

  // ????????? ?????? ??????(???????????? : Reserve, ???????????? : ????????? Bridge ????????? Reserve)
  // inOrOut : 0(??????), 1(??????)
  getTargetCurrencyIO(inOrOut) {
    const { chain } = Store.getters.getChainInfo;
    const reserveAddress = this.getReserveContract()._address;
    const bridgeVaultAddress = this.getEthVaultContract()._address;

    if (chain === 'KLAYTN') {
      return reserveAddress;
    }

    if (chain === 'ETHEREUM') {
      if (inOrOut === 0) {
        return bridgeVaultAddress;
      }

      return reserveAddress;
    }

    return '';
  }

  getKip7Contract(address) {
    return new this._wallet.getContract({
      abi: KIP7ABI,
      address,
    });
  }

  getKip17Contract(address) {
    return new this._wallet.getContract({
      abi: KIP17ABI,
      address,
    });
  }

  getEthVaultContract() {
    return new this._caver.contract(EthvaultABI, ContractList.EthVaultContract);
  }

  getKlayminterContract() {
    const caver = new Caver(
      this._wallet.isMainNet() ? process.env.VUE_APP_PROVIDER_URL_CYPRESS : process.env.VUE_APP_PROVIDER_URL_BAOBAB,
    );
    return new caver.contract(KlayminterABI, ContractList.KlayMintContract);
  }

  getKlaytnReserveContract() {
    const caver = new Caver(
      this._wallet.isMainNet() ? process.env.VUE_APP_PROVIDER_URL_CYPRESS : process.env.VUE_APP_PROVIDER_URL_BAOBAB,
    );
    return new caver.contract(ReserveABI, ContractList.ReserveContract);
  }

  getERC20TestContract() {
    return new this._wallet.getContract({
      abi: EthvaultTestABI,
      address: ContractList.EthVaultContract,
    });
  }

  // RandomHash 32 Byte = ?????? RandomHash 28 byte + 16???????????? Unix TimeStamp 4 Byte
  getRandomHash(byteLength = 28) {
    const defaultHex = this._wallet.utils.randomHex(byteLength);
    const now = this._wallet.utils.toHex(parseInt(Store.$app.$date.getNow().ts / 1000)).slice(2);

    return `${defaultHex}${now}`;
  }

  async signWithMessage(data, params) {
    Store.dispatch('showModal', {
      component: 'TxProgressModal',
      params: {
        ...(params.detail || {}),
        hash: params.hash,
      },
    });

    const signedResult = await this._wallet.signMessage(data);

    if (!signedResult.success) {
      Store.$app.showAlert({
        title: Store.$app.$t('General.TransactionFail'),
      });

      Store.$app.$eventBus.$emit('onReceiveTxPending', {
        result: 'fail',
        hash: params.hash,
      });

      return signedResult;
    }

    const signatureBuffer = ethJsUtil.toBuffer(signedResult.data);
    const signatureParams = ethJsUtil.fromRpcSig(signatureBuffer);

    return {
      success: true,
      data: {
        requestHash: params.hash,
        message: data,
        signature: signedResult.data,
        v: this._wallet.utils.numberToHex(signatureParams.v),
        r: signatureParams.r.toString('hex'),
        s: signatureParams.s.toString('hex'),
      },
    };
  }

  async sendTransaction({ sendParams, methodDetail, klipDetail }) {
    return new Promise((resolve, reject) => {
      this._wallet
        .sendTransaction(methodDetail.name, {
          ...sendParams,
          methodDetail,
          klipDetail,
        })
        .then((receipt) => {
          resolve(receipt);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async addAuction(params, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const data = _auction.methods
      .addAuction(
        hash,
        params.tokenAddress,
        params.tokenId,
        params.biddingToken,
        params.minAmount,
        params.maxAmount,
        params.duration,
        params.isInstantTrade,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async placeBid(tradeId, amount, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const methodParams = [hash, tradeId, amount];
    const data = _auction.methods.placeBid(...methodParams).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async editAuction(params, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const data = _auction.methods
      .editAuction(
        hash,
        params.tradeId,
        params.biddingToken,
        params.minAmount,
        params.maxAmount,
        params.duration,
        params.isInstantTrade,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async cancelAuction(tradeId, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const data = _auction.methods.cancelAuction(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async closeAuction(tradeId, detail) {
    const hash = this.getRandomHash();
    const _auction = this.getAuctionContract();
    const data = _auction.methods.closeAuction(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async isApproved(params, isNft) {
    const _reserve = this.getReserveContract();
    const tokenContract = isNft
      ? this.getKip17Contract(params.tokenAddress)
      : this.getKip7Contract(params.tokenAddress);
    const userAddress = Store.getters.getUserInfo.address;

    const methodName = isNft ? 'getApproved' : 'allowance';
    const methodParams = isNft ? [params.tokenId] : [userAddress, _reserve._address];

    return await tokenContract.methods[methodName](...methodParams)
      .call()
      .catch(() => {
        return -1;
      });
  }

  generateBridgeRandomHash() {
    return this._wallet.collection.eth.abi.encodeParameters(
      ['address', 'bytes32'],
      [Store.getters.getUserInfo.address, this._wallet.utils.randomHex(32)],
    );
  }

  async approveToken(params, isNft) {
    // ????????? ????????? ?????? ?????? ????????? EthVault
    const target = (params.isBridge ? this.getEthVaultContract() : this.getReserveContract())._address;
    const tokenContract = isNft
      ? this.getKip17Contract(params.tokenAddress)
      : this.getKip7Contract(params.tokenAddress);
    const spendValue = this._wallet.utils.hexToNumberString(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    );

    const methodName = 'approve';
    const methodParams = isNft ? [target, params.tokenId] : [target, spendValue];
    const data = tokenContract.methods[methodName](...methodParams).encodeABI();

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: tokenContract._address,
        data,
        value: '0',
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: isNft ? KIP17ABI : KIP7ABI,
      },
      klipDetail: {
        to: tokenContract._address,
        value: '0',
        abi: JSON.stringify(this.getContractFunctionAbi(isNft ? 'KIP17Contract' : 'KIP7Contract', methodName)),
        params: JSON.stringify(methodParams),
      },
    }).catch((err) => {
      Log('error : ', err);
    });
  }

  // TODO : ?????? ?????? ????????? ?????? ?????? Approve ?????? ?????????
  async depositToken(token, amount, chainInfo) {
    const isToken = parseInt(token) !== 0;

    if (isToken) {
      const getIsApproved = await this.isApproved(
        {
          tokenAddress: token,
        },
        false,
      );

      if (getIsApproved === -1) {
        return {
          success: false,
          error: new Error('allowance_failed'),
        };
      }

      if (getIsApproved === '0') {
        const approveRes = await this.approveToken(
          {
            tokenAddress: token,
            isBridge: chainInfo.chain === 'ETHEREUM',
          },
          false,
        );

        if (approveRes && !approveRes.success) {
          return {
            success: false,
            error: new Error('approve_failed'),
          };
        }
      }
    }

    if (chainInfo.chain === 'ETHEREUM') {
      return await this.depositBridgeToken(token, amount);
    }

    const _reserve = this.getReserveContract();
    const methodName = isToken ? 'depositToken' : 'deposit';
    const methodParams = isToken ? [token, amount] : [];
    const data = _reserve.methods[methodName](...methodParams).encodeABI();

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: _reserve._address,
        data,
        value: isToken ? '0' : amount,
        contract: isToken ? token : '',
        amount: amount,
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI,
      },
      klipDetail: {
        to: this.getContractAddress('ReserveContract'),
        value: isToken ? '0' : amount,
        abi: JSON.stringify(this.getContractFunctionAbi('ReserveContract', methodName)),
        params: JSON.stringify(methodParams),
      },
    });
  }

  async depositBridgeToken(token, amount) {
    const ethVault = this.getEthVaultContract();
    const toAddr = this.getReserveContract()._address;

    const isToken = parseInt(token) !== 0;
    const dataHash = this.generateBridgeRandomHash();

    const methodName = isToken ? 'depositToken' : 'deposit';
    const methodParams = isToken ? [token, 'KLAYTN', toAddr, amount, dataHash] : ['KLAYTN', toAddr, dataHash];

    const data = ethVault.methods[methodName](...methodParams).encodeABI();

    return await this.sendTransaction({
      sendParams: {
        to: ethVault._address,
        data,
        value: isToken ? '0' : amount,
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI,
      },
    });
  }

  // TODO : ?????? ?????? ????????? ?????? ?????? Approve ?????? ?????????
  async depositNft(tokenAddress, tokenId, chain) {
    const _reserve = this.getReserveContract();
    const getIsApproved = await this.isApproved(
      {
        tokenAddress,
        tokenId,
      },
      true,
    );

    if (getIsApproved === -1) {
      return {
        success: false,
        error: new Error('allowance_failed'),
      };
    }

    if (parseInt(getIsApproved) === 0 || !this._wallet.isSameAddress(getIsApproved, _reserve._address)) {
      const approveRes = await this.approveToken(
        {
          tokenAddress,
          tokenId,
          isBridge: chain === 'ETHEREUM',
        },
        true,
      );

      if (approveRes && !approveRes.success) {
        return {
          success: false,
          error: new Error('approve_failed'),
        };
      }
    }

    if (chain === 'ETHEREUM') {
      return this.depositBridgeNft(tokenAddress, tokenId);
    }

    const methodName = 'depositNft';
    const methodParams = [tokenAddress, tokenId];
    const data = _reserve.methods[methodName](...methodParams).encodeABI();

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: _reserve._address,
        data,
        value: '0',
        tokenAddress,
        tokenId,
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI,
      },
      klipDetail: {
        to: this.getContractAddress('ReserveContract'),
        value: '0',
        abi: JSON.stringify(this.getContractFunctionAbi('ReserveContract', methodName)),
        params: JSON.stringify(methodParams),
      },
    });
  }

  async depositBridgeNft(tokenAddress, tokenId) {
    const ethVault = this.getEthVaultContract();
    const toAddr = this.getReserveContract()._address;

    const _klayMinter = this.getKlayminterContract();
    let kAddress = null;
    try {
      kAddress = await _klayMinter.methods.getTokenAddress(tokenAddress).call();
    } catch (e) {}

    let isWhiteList = true;
    if (!kAddress || this._wallet.isSameAddress(kAddress, '0x0000000000000000000000000000000000000000')) {
      isWhiteList = false;
    } else {
      const _kReserve = this.getKlaytnReserveContract();
      try {
        isWhiteList = await _kReserve.methods.whiteListNfts(kAddress).call();
      } catch (e) {
        isWhiteList = false;
      }
    }

    if (!isWhiteList) {
      // TODO: white list??? ?????? ???????????? ????????? ?????? ??????????????? ???????????????.
      //
      // const methodName = 'depositNFT'
      // const methodParams = [tokenAddress, 'KLAYTN', "???????????? ??????", tokenId, '0x']
      // const data = ethVault.methods.depositNFT(...methodParams).encodeABI()
      //
      // await this.sendTransaction({
      //   sendParams: {
      //     type: 'SMART_CONTRACT_EXECUTION',
      //     to: ethVault._address,
      //     data,
      //     value: '0'
      //   },
      //   methodDetail: {
      //     name: methodName,
      //     params: methodParams,
      //     abi: ReserveABI
      //   }
      // })
      Store.$app.showAlert({
        title: Store.$app.$t('General.TransactionFail'),
      });
      return {
        success: false,
        error: new Error('not_white_list'),
      };
    }

    const methodName = 'depositNFT';
    const dataHash = this.generateBridgeRandomHash();
    const methodParams = [tokenAddress, 'KLAYTN', toAddr, tokenId, dataHash];
    const data = ethVault.methods.depositNFT(...methodParams).encodeABI();

    return await this.sendTransaction({
      sendParams: {
        type: 'SMART_CONTRACT_EXECUTION',
        to: ethVault._address,
        data,
        value: '0',
      },
      methodDetail: {
        name: methodName,
        params: methodParams,
        abi: ReserveABI,
      },
    });
  }

  async withdrawToken(token, amount, detail, chain, toAddress) {
    const hash = this.getRandomHash();
    const _reserve = this.getReserveContract();
    const data = _reserve.methods.withdraw(hash, token, amount, toAddress).encodeABI();

    if (chain === 'ETHEREUM' && detail.action !== 'transfer') {
      return this.withdrawBridgeToken(token, amount, hash, detail, chain);
    }

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  // TODO : isSendToOrigin ?????? ??????
  async withdrawBridgeToken(token, amount, hash, detail, chain) {
    const _reserve = this.getReserveContract();

    const data = _reserve.methods
      .bridgeWithdrawToken(
        hash,
        ContractList.KlayMintContract,
        Store.getters.getUserInfo.address,
        token,
        amount,
        true,
        chain === 'ETHEREUM' ? 'ETH' : chain,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail: {},
    });
  }

  async stakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();
    const msg = _staking.methods.staking(hash, amount).encodeABI();

    return await this.signWithMessage(msg, {
      hash,
      detail,
    });
  }

  async unstakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();

    const data = _staking.methods.unstaking(hash, amount).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async claimUnstakingToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();
    const uid = detail.uid;

    const data = _staking.methods.claimUnstaking(hash, uid).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async claimRewardToken(token, amount, detail) {
    const hash = this.getRandomHash();
    const _staking = this.getStakingContract();
    const data = _staking.methods.claimReward(hash).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async withdrawNft(tokenAddress, tokenId, detail, chain, toAddress) {
    const hash = this.getRandomHash();
    const _reserve = this.getReserveContract();
    const data = _reserve.methods.withdrawNft(hash, tokenAddress, tokenId, toAddress).encodeABI();

    if (chain === 'ETHEREUM' && detail.action !== 'transferNft') {
      return this.withdrawBridgeNft(tokenAddress, tokenId, hash, detail, chain, toAddress);
    }

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async withdrawBridgeNft(tokenAddress, tokenId, hash, detail, chain) {
    const _reserve = this.getReserveContract();
    const data = _reserve.methods
      .bridgeWithdrawNft(
        hash,
        ContractList.KlayMintContract,
        Store.getters.getUserInfo.address,
        tokenAddress,
        tokenId,
        true,
        chain === 'ETHEREUM' ? 'ETH' : chain,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async addBuyOffer(params, detail) {
    const hash = this.getRandomHash();
    const _buyOffer = this.getBuyOfferContract();
    const data = _buyOffer.methods
      .addBuyOffer(hash, params.tokenAddress, params.tokenId, params.currency, params.amount)
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async editBuyOffer(params, detail) {
    const hash = this.getRandomHash();
    const _buyOffer = this.getBuyOfferContract();
    const data = _buyOffer.methods.editBuyOffer(hash, params.tradeId, params.currency, params.amount).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async cancelBuyOffer(params, detail) {
    const hash = this.getRandomHash();
    const _buyOffer = this.getBuyOfferContract();
    const data = _buyOffer.methods.cancelBuyOffer(hash, params.tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  // ?????? ?????? ??????.
  async closeBuyOffer(tradeId, detail) {
    const hash = this.getRandomHash();
    const _buyOffer = this.getBuyOfferContract();

    const data = _buyOffer.methods.sellNft(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async addSellOffer(params, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods
      .addSellOffer(
        hash,
        params.tokenAddress,
        params.tokenId,
        params.currency,
        params.amount, // ?????? ?????????
        params.isNegotiable,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async editSellOffer(params, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods
      .editSellOffer(
        hash,
        params.tradeId,
        params.currency,
        params.amount, // ?????? ?????????
        params.isNegotiable,
      )
      .encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async cancelSellOffer(params, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.cancelSellOffer(hash, params.tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  // ??? ???????????? ?????? retrieve ???????????? ?????? ??? ?????????????????? ??????
  async retrieveAsset(tradeId, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    // const data = _sellOffer.methods.retrieve(hash, tradeId).encodeABI()
    const data = _sellOffer.methods.cancelNego(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async addNego(params, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.addNego(hash, params.tradeId, params.currency, params.newPrice).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async directExchange(cate, tradeId, detail) {
    if (cate === 'buy') {
      return await this.closeBuyOffer(tradeId, detail);
    }

    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.buyNft(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async cancelNegotiation(tradeId, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.cancelNego(hash, tradeId).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async acceptNegotiation(tradeId, negoMaker, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.acceptNego(hash, tradeId, negoMaker).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async rejectNegotiation(tradeId, negoMaker, detail) {
    const hash = this.getRandomHash();
    const _sellOffer = this.getSellOfferContract();
    const data = _sellOffer.methods.rejectNego(hash, tradeId, negoMaker).encodeABI();

    return await this.signWithMessage(data, {
      hash,
      detail,
    });
  }

  async modifyUserInfo(params) {
    const stringifyParams = JSON.stringify(
      {
        ...params,
        requestedAt: Store.$app.$date.getNow().toFormat('fff'),
      },
      null,
      2,
    );
    const hexlifyParams = `0x${new Buffer(stringifyParams).toString('hex')}`;

    return await this.signWithMessage(hexlifyParams, {
      hash: this.getRandomHash(),
      detail: {},
    });
  }

  async getStakingAmount(walletAddress) {
    const _staking = this.getStakingContract();
    return await _staking.methods.stakingBalance(walletAddress).call();
  }

  async getUnstakingAmount(walletAddress) {
    const _staking = this.getStakingContract();
    return await _staking.methods.pendingBalance(walletAddress).call();
  }

  async getUserClaimableAmount(currency, rewardTokenIndex) {
    const $bn = Store.$app.$bn;
    const _staking = this.getStakingContract();
    const user = Store.getters.getUserInfo.address;

    const stakingBalance = await _staking.methods.stakingBalance(user).call();
    const IndexPrecision = await _staking.methods.IndexPrecision().call();
    const rewardIndex = await _staking.methods
      .rewardInfo(rewardTokenIndex)
      .call()
      .then((res) => {
        return res.index;
      });
    const balanceIndex = await _staking.methods
      .userInfoList(user, currency)
      .call()
      .then((res) => {
        return res.index;
      });

    return $bn.toMaxUnit(
      $bn.mulBN(stakingBalance, $bn.subBN(rewardIndex, balanceIndex)).divBN(IndexPrecision).toString(),
      18,
    );
  }
}
