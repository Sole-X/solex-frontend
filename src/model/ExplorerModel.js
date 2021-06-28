import Store from '@/store';

export class ActivityRow {
  constructor(props = {}) {
    this.accountAddress = props.accountAddress || '';
    this.accountAddressDesc = props.accountAddressDesc || {};
    this.nickname = props.nickname || '';
    this.toNickname = props.toNickname || '';
    this.amount = props.amount || '0';
    this.createdAt = props.createdAt || '';
    this.eventType = props.eventType || '';
    this.fromAddress = props.fromAddress || '';
    this.fromAddressDesc = props.fromAddressDesc || {};
    this.id = props.id || '';
    this.nftDesc = props.nftDesc || {};
    this.status = props.status || '';
    this.toAddress = props.toAddress || '';
    this.toAddressDesc = props.toAddressDesc || {};
    this.tokenAddress = props.tokenAddress || '';
    this.tokenId = props.tokenId || '';
    this.tradeId = props.tradeId || '';
    this.txHash = props.txHash || '';
    this.updatedAt = props.updatedAt || '';
    this.usdPrice = props.usdPrice || '';
    this.currency = props.currency || '';
    this.statusStr = props.statusStr || '';
    this.typeStr = props.typeStr || '';
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

  get tokenInfo() {
    const { tokenAddress, eventTypeToString } = this;

    if (eventTypeToString !== 'TOKEN') {
      return (
        _.find(Store.getters.getSupportNft, (token) => {
          return Store.$app.$wallet.isSameAddress(tokenAddress, token.addressToReserve);
        }) || {}
      );
    }

    if (eventTypeToString === 'TOKEN') {
      return (
        _.find(Store.getters.getSupportCurrency, (currency) => {
          return Store.$app.$wallet.isSameAddress(tokenAddress, currency.addressToReserve);
        }) || {}
      );
    }

    return {};
  }

  get currencyInfo() {
    const { currency } = this;
    const defaultObj = {
      decimal: 18,
      toFiat: () => '0',
    };

    if (!this.currency) {
      return defaultObj;
    }

    return (
      _.find(Store.getters.getSupportCurrency, (row) => {
        return Store.$app.$wallet.isSameAddress(row.addressToReserve, currency);
      }) || defaultObj
    );
  }
}

export class RankingRow {
  constructor(props = {}) {
    this.avgPrice = props.avgPrice || '0';
    this.beforeWeek = props.beforeWeek || '0';
    this.change = props.change || '0';
    this.dateKey = props.dateKey || '0';
    this.nftCnt = props.nftCnt || '0';
    this.ownerCnt = props.ownerCnt || '0';
    this.tokenAddress = props.tokenAddress || '0';
    this.total = props.total || '0';
    this.tradeCnt = props.tradeCnt || '0';
    this.week = props.week || '0';
  }

  get changeUnit() {
    const _change = parseFloat(this.change);

    if (_change === 0) {
      return '';
    }

    return _change > 0 ? '+' : '-';
  }
}
