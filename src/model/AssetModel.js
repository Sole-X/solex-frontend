import Store from '@/store';
import { NftInfo } from '@/model/MarketModel';

export class AssetItemDetail extends NftInfo {
  constructor(props = {}) {
    super(props);
    this.currency = props.currency || '';
    this.usdPrice = props.usdPrice || '0';
    this.statusStr = props.statusStr || '';
  }

  get isMyItem() {
    const user = Store.getters.getUserInfo.address;

    // 수집된 NFT인 경우 DB에 들어간 ownerAddress와 대조isOnTrade
    if (user && this.ownerAddress) {
      return Store.$app.$wallet.isSameAddress(user, this.ownerAddress);
    }

    // 미수집(=미예치)된 NFT인 경우 내 아이템 목록에서 검색해보기
    return !!_.find(Store.getters.getUserBalance.nft, (row) => {
      return this.tokenId === row.tokenId && Store.$app.$wallet.isSameAddress(row.tokenAddress, this.tokenAddress);
    });
  }

  get isMyWriting() {
    const user = Store.getters.getUserInfo.address;

    if (user) {
      if (this.isBuy) {
        return Store.$app.$wallet.isSameAddress(user, this.buy.buyerAddress);
      } else if (this.isSell) {
        return Store.$app.$wallet.isSameAddress(user, this.sell.ownerAddress);
      } else if (this.isAuction) {
        return Store.$app.$wallet.isSameAddress(user, this.auction.ownerAddress);
      }
    }
    return false;
  }

  get writer() {
    if (this.isBuy) {
      return this.buy.buyerAddress;
    } else if (this.isSell) {
      return this.sell.ownerAddress;
    } else if (this.isAuction) {
      return this.auction.ownerAddress;
    }
  }

  get isOnTrade() {
    return this.isAuction || this.isExchange;
  }

  // 시간이 지났거나 status 값이 3(Auction)이 아닌 경우
  get isEndedAuction() {
    const $date = Store.$app.$date;
    const now = $date.getNow().ts;
    let isTimeOver = null;
    if (this.auction) isTimeOver = now > $date.getTimeObject(this.auction.endTime).ts;

    return this.isAuction && (isTimeOver || this.status !== 3);
  }

  get isEndedAuctionDecided() {
    return false;
  }

  get isEndedExchange() {
    return this.isExchange && (this.exchange.status === 3 || this.exchange.status === 7 || this.exchange.status === 8);
  }

  get isSoldout() {
    if (this.isAuction) {
      if (this.auction.status === 7) {
        return true;
      }
    } else if (this.isSell) {
      if (this.sell.status === 7) {
        return true;
      }
    }
    return false;
  }

  // 내가 낙찰자인 경우
  get isWillBeMine() {
    const user = Store.getters.getUserInfo.address;

    if (this.isExchange) {
      return Store.$app.$wallet.isSameAddress(this.exchange.toAddress, user);
    }

    if (this.isAuction) {
      return Store.$app.$wallet.isSameAddress(this.auction.buyerAddress, user);
    }

    return '';
  }

  getRemainAuctionTime(now) {
    const _endTime = Store.$app.$date.getTimeObject(this.auction.endTime);

    return Store.$app.$date.getDiff(_endTime, now);
  }

  get currentItemState() {
    let result = '';

    switch (this.status) {
      case 1: {
        result = 'deposit';
        break;
      }
      case 2: {
        result = 'inSale';
        break;
      }
      case 3: {
        result = 'auction';
        break;
      }
      case 4: {
        result = 'withdraw';
        break;
      }
      default: {
        break;
      }
    }

    return result;
  }

  get currentOfferState() {
    let result = '';

    if (this.isAuction) {
      switch (this.auction.status) {
        case 2: {
          result = 'start';
          break;
        }
        case 3: {
          result = 'cancel';
          break;
        }
        case 4: {
          result = 'expire';
          break;
        }
        case 7: {
          result = 'done';
          break;
        }
        default: {
          break;
        }
      }
    } else {
    }

    return result;
  }

  get currencyInfo() {
    let targetToken = this.currency;

    if (this.isAuction) {
      targetToken = this.auction.currency;
    }

    if (this.isExchange) {
      targetToken = this.exchange.currency;
    }

    return (
      _.find(Store.getters.getSupportCurrency, (row) => {
        return Store.$app.$wallet.isSameAddress(row.addressToReserve, targetToken);
      }) || {
        toFiat: () => '0',
      }
    );
  }

  get isInstantTrade() {
    if (this.isAuction) {
      return this.auction.type === 2;
    }

    return false;
  }

  get isNegotiable() {
    if (this.isExchange) {
      return this.exchange.type === 4;
    }

    return false;
  }

  get currentPrice() {
    if (this.isAuction) {
      return this.auction.currentPrice;
    }

    if (this.isExchange) {
      return this.exchange.basePrice;
    }

    return this.price;
  }

  get isItemOnMyWallet() {
    return !!_.find(Store.getters.getUserBalance.nft, (item) => {
      return Store.$app.$wallet.isSameAddress(this.tokenAddress, item.tokenAddress) && this.tokenId === item.tokenId;
    });
  }
}

export class AssetOfUser {
  constructor(props) {
    this.depositAmount = props.amount || '0';
    this.lockAuctionAmount = props.lockAuctionAmount || '0';
    this.lockBidAmount = props.lockBidAmount || '0';
    this.lockSellAmount = props.lockSellAmount || '0';
    this.lockNegoAmount = props.lockNegoAmount || '0';
    this.lockBuyAmount = props.lockBuyAmount || '0';
    this.lockRewardAmount = props.lockRewardAmount || '0';
    this.tokenAddr = {
      KLAYTN: props.tokenAddress || props.tokenAddr || '',
      ETHEREUM: props.ethAddress || props.ethAddr || '',
    };
    this.tokenAddress = props.tokenAddress || '';
  }

  get tokenInfo() {
    return (
      _.find(Store.getters.getSupportCurrency, (currency) => {
        return Store.$app.$wallet.isSameAddress(currency.addressToReserve, this.tokenAddr.KLAYTN);
      }) || {}
    );
  }

  get currentAddress() {
    return this.tokenInfo.currentAddress;
  }

  get onOrderAmount() {
    const { lockNegoAmount, lockSellAmount, lockBidAmount, lockAuctionAmount } = this;

    return Store.$app.$bn
      .addBN(lockSellAmount, lockBidAmount)
      .addBN(lockNegoAmount)
      .addBN(lockAuctionAmount)
      .toString();
  }

  get totalAmount() {
    return Store.$app.$bn.addBN(this.depositAmount, this.onOrderAmount).addBN(this.lockBuyAmount).toString();
  }

  getDecAmount(amount) {
    return Store.$app.$bn.toMaxUnit(amount, this.tokenInfo.decimal, this.tokenInfo.decimal);
  }
}

export class AssetSaleOffer {
  constructor(props = {}) {
    this.basePrice = props.basePrice || '0';
    this.saleType = props.type === 1 || props.type === 2 ? 'auction' : 'sell';

    this.bids = props.bids || [];
    this.buyerAddress = props.buyerAddress || '';

    this.createTxHash = props.createTxHash || '';
    this.createdAt = props.createdAt || 'now';
    this.currency = props.currency || '';
    this.currentPrice = props.currentPrice || '';
    this.straightPrice = props.straightPrice || '';

    this.endTime = props.endTime || '';
    this.id = props.id || '';
    this.lastTxHash = props.lastTxHash || '';
    this.like = props.like || false;
    this.liked = props.liked || '';
    this.negos = props.negos || [];

    this.ownerAddress = props.ownerAddress || '';
    this.startTime = props.startTime || '';
    this.status = props.status || 1;
    this.toAddress = props.toAddress || '';
    this.tokenAddress = props.tokenAddress || '';
    this.tokenId = props.tokenId || '';
    this.tokenName = props.tokenName || '';
    this.tradeId = props.tradeId || '';
    this.type = props.type || '';

    this.updatedAt = props.updatedAt || 'now';
    this.usdPrice = props.usdPrice || '0';

    this.desc = props.desc || {};
    this.nftInfo = props.nftInfo || {
      id: 0,
      tokenId: '',
      tokenAddress: '',
      currentPrice: 0,
      usdPrice: 0,
    };
    this.currentNegos = props.negos ? props.negos.filter((nego) => nego.status === 2) : [];
  }

  isFinished() {
    return this.status === 7;
  }

  // 활성화된 내 협상 내역이 있는 지(status 1 : 진행, 3 : 실패 혹은 취소, 4 : 성공, 5 : ?)
  get myNego() {
    return _.find(this.currentNegos, (nego) => {
      return Store.$app.$wallet.isSameAddress(nego.accountAddress, Store.getters.getUserInfo.address);
    });
  }

  get myNegoForReject() {
    return _.find(this.negos, (nego) => {
      return Store.$app.$wallet.isSameAddress(nego.accountAddress, Store.getters.getUserInfo.address);
    });
  }

  get isMyNego() {
    if (!!this.myNego) return true;
    return false;
  }

  get isAuctionSeller() {
    if (Store.$app.$wallet.isSameAddress(Store.getters.getUserInfo.address, this.ownerAddress)) return true;
    return false;
  }

  // 경매 기간 계산
  get getPeriod() {
    const res = Store.$app.$date.getDiff(this.endTime, this.startTime);

    if (!res.success) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      };
    }

    return res.info;
  }

  // 내 경매 입찰 내역
  get myBid() {
    return _.find(this.bids, (bidInfo) => {
      return Store.$app.$wallet.isSameAddress(Store.getters.getUserInfo.address, bidInfo.accountAddress);
    });
  }

  // 내 입찰이 최고 입찰이 아닌 경우 추가 입찰 가능
  get enableBid() {
    const { myBid } = this;

    if (!myBid) {
      return true;
    }

    const prevMaxBid = _.orderBy(this.bids, (bidInfo) => {
      return parseFloat(-bidInfo.bidPrice);
    })[0];

    return !Store.$app.$wallet.isSameAddress(prevMaxBid.id, myBid.id);
  }

  get isLowerThanStraightPrice() {
    const currentPrice = Number(this.currentPrice);
    const straightPrice = Number(this.straightPrice);

    if (currentPrice * 1.1 < straightPrice) {
      return true;
    }
    return false;
  }

  get isNormalAuction() {
    if (this.type === 1) {
      return true;
    }
    return false;
  }
}

export class AssetBuyOffer {
  constructor(props = {}) {
    this.basePrice = props.basePrice || '0';
    this.buyerAddress = props.buyerAddress || '';
    this.createTxHash = props.createTxHash || '';
    this.createdAt = props.createdAt || '';
    this.currency = props.currency || '';
    this.endTime = props.endTime || '';
    this.id = props.id || '';
    this.lastTxHash = props.lastTxHash || '';
    this.like = props.like || false;
    this.liked = props.liked || 0;
    this.sellerAddres = props.sellerAddress || '';
    this.startTime = props.startTime || '';
    this.status = props.status || '';
    this.tokenAddress = props.tokenAddress || '';
    this.tokenId = props.tokenId || '';
    this.updatedAt = props.updatedAt || '';
    this.usdPrice = props.usdPrice || '';
    this.desc = props.desc || {};
    this.nftInfoObject = props.nftInfo || {};
  }

  get isBuyer() {
    return Store.$app.$wallet.isSameAddress(Store.getters.getUserInfo.address, this.buyerAddress);
  }

  get nftInfo() {
    return _.find(Store.getters.getSupportNft, (nft) => {
      return Store.$app.$wallet.isSameAddress(nft.addressToReserve, this.tokenAddress);
    });
  }
}

export class AssetItemHistory {
  constructor(props = {}) {
    this.accountAddress = props.accountAddress || '';
    this.amount = props.amount || '0';
    this.bridgeId = props.bridgeId || 0;
    this.createdAt = props.createdAt || '';
    this.currency = props.currency || '';
    this.eventType = props.eventType || 0;
    this.fromAddress = props.fromAddress || '-';
    this.id = props.id || 0;
    this.status = props.status || 0;
    this.toAddress = props.toAddress || '-';
    this.tokenAddress = props.tokenAddress || '';
    this.tokenId = props.tokenId || '';
    this.tradeId = props.tradeId || '';
    this.tradeType = props.tradeType || 0;
    this.txHash = props.txHash || '';
    this.updatedAt = props.updatedAt || '';
    this.usdPrice = props.usdPrice || '0';
  }

  get eventTypeToString() {
    const eventTypes = {
      AUCTION: 1,
      SELL: 2,
      BUY: 3,
      BID: 4,
      NEGO: 5,
      NFT: 6,
      TOKEN: 7,
    };

    for (const type in eventTypes) {
      if (eventTypes[type] === this.eventType) {
        return type;
      }
    }

    return '';
  }

  get currencyInfo() {
    return (
      _.find(Store.getters.getSupportCurrency, (row) => {
        return Store.$app.$wallet.isSameAddress(row.addressToReserve, this.currency);
      }) || {
        toFiat: () => '0',
      }
    );
  }

  get fromAddressGetter() {
    const { accountAddress, eventTypeToString } = this;

    if (eventTypeToString === 'DEPOSIT') {
      return accountAddress;
    }

    if (eventTypeToString === 'WITHDRAW') {
      return Store.$app.$tx.getReserveContract()._address;
    }

    if (eventTypeToString === 'AUCTION' || eventTypeToString === 'BID') {
      return accountAddress;
    }

    if (eventTypeToString === 'SELL') {
    }

    if (eventTypeToString === 'RETRIVE') {
      return '';
    }

    return '';
  }

  get toAddressGetter() {
    const { accountAddress, eventTypeToString } = this;

    if (eventTypeToString === 'DEPOSIT') {
      return Store.$app.$tx.getReserveContract()._address;
    }

    if (eventTypeToString === 'WITHDRAW') {
      return accountAddress;
    }

    if (eventTypeToString === 'AUCTION' || eventTypeToString === 'BID') {
      return Store.$app.$tx.getAuctionContract()._address;
    }

    if (eventTypeToString === 'RETRIVE') {
      return accountAddress;
    }

    return '';
  }

  // 유저에게 보여줄 이벤트명
  get eventToString() {
    const $t = Store.$app.$t.bind(Store.$app);

    switch (this.eventTypeToString) {
      case 'DEPOSIT': {
        return $t('General.Deposit');
      }
      case 'WITHDRAW': {
        return $t('General.Withdraw');
      }
      case 'BUY': {
        return $t('Market.Buy');
      }
      case 'SELL': {
        return $t('Market.Sales');
      }
      case 'AUCTION': {
        return $t('Market.Auctions');
      }
      case 'BID': {
        return $t('Market.Bid');
      }
      case 'NEGO': {
        return $t('Market.Negotiation');
      }
      // devjoo Activity event 추가
      case 'TOKEN': {
        // vue-i18n 버그로 인해 번역 적용 x
        return $t('Market.Token');
      }
      case 'NFT': {
        return $t('Market.Nft');
      }
      default: {
        return '';
      }
    }
  }
}
