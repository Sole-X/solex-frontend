import Store from '@/store';

export class UserActivity {
  constructor(props) {
    this.type = props.type;
    this.accountAddress = props.accountAddress || '';
    this.amount = props.amount || '0';
    this.createdAt = props.createdAt || '';
    this.eventType = props.eventType || '';
    this.id = props.id || '';
    this.status = props.status || 1;
    this.statusStr = props.statusStr || '';
    this.currency = props.currency || '';
    this.tokenAddress = props.tokenAddress || '';
    this.tokenId = props.tokenId || '';
    this.tradeId = props.tradeId || '';
    this.txHash = props.txHash || '';
    this.updatedAt = props.updatedAt || '';
    this.nftInfo = props.nftInfo || {};
    this.typeStr = props.typeStr || '';
    this.fromAddressForAsset = props.fromAddress || '-';
    this.toAddressForAsset = props.toAddress || '-';
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

  get realEventName() {
    const { eventTypeToString, statusStr } = this;

    return `${eventTypeToString}_${statusStr}`;
  }

  get eventState() {
    const { status, eventType } = this;

    switch (eventType) {
      case 1:
        // AUCTION
        switch (status) {
          case 1:
            return 'pending';
          case 2:
            return 'start';
          case 3:
            return 'cancel';
          case 7:
            return 'done';
          case 8:
            return 'fail';
        }
      case 2:
        // SELL
        switch (status) {
          case 1:
            return 'pending';
          case 2:
            return 'start';
          case 3:
            return 'cancel';
          case 7:
            return 'done';
          case 8:
            return 'fail';
        }
      case 3:
        // BUY
        switch (status) {
          case 2:
            return 'start';
          case 3:
            return 'cancel';
          case 7:
            return 'done';
          case 8:
            return 'fail';
        }
      case 4:
        // BID
        switch (status) {
          case 2:
            return 'start';
          case 3:
            return 'cancel';
          case 5:
            return 'reject';
          case 7:
            return 'done';
          case 8:
            return 'fail';
        }
      case 5:
        // NEGO
        switch (status) {
          case 2:
            return 'start';
          case 3:
            return 'cancel';
          case 5:
            return 'reject';
          case 7:
            return 'done';
          case 8:
            return 'fail';
        }
      case 6:
        // NFT
        switch (status) {
          case 1:
            return 'deposit';
          case 2:
            return 'sell';
          case 3:
            return 'auction';
          case 4:
            return 'buy';
          case 7:
            return 'withdraw';
          case 9:
            return 'vault';
          case 10:
            return 'send';
          case 11:
            return 'mint';
          case 12:
            return 'burn';
        }
      case 7:
        // TOKEN
        switch (status) {
          case 1:
            return 'deposit';
          case 2:
            return 'sell';
          case 3:
            return 'auction';
          case 4:
            return 'buy';
          case 5:
            return 'bid';
          case 6:
            return 'nego';
          case 7:
            return 'withdraw';
          case 8:
            return 'retrieve';
          case 9:
            return 'vault';
          case 10:
            return 'send';
          case 11:
            return 'mint';
          case 12:
            return 'burn';
        }
    }
  }

  get isProgress() {
    const { eventState, eventType } = this;

    switch (eventType) {
      case 6:
      case 7: {
        // 입출금의 경우 브릿지 통과 과정은 Progress 상태로 취급
        return eventState === 'vault' || eventState === 'burn' || eventState === 'mint';
      }

      default: {
        // 기타는 pending, start 타입을 Progress 상태로 취급
        return eventState === 'pending' || eventState === 'start';
      }
    }
  }

  get currencyInfo() {
    return (
      _.find(Store.getters.getSupportCurrency, (row) => {
        return Store.$app.$wallet.isSameAddress(
          row.addressToReserve,
          this.type === 'token' ? this.tokenAddress : this.currency,
        );
      }) || {
        toFiat: () => '0',
      }
    );
  }

  get isDeposit() {
    const { statusStr } = this;

    return statusStr === 'DEPOSIT' || statusStr === 'MINT' || statusStr === 'VAULT';
  }

  get isWithdraw() {
    const { statusStr } = this;

    return statusStr === 'WITHDRAW' || statusStr === 'BURN' || statusStr === 'SEND';
  }

  get fromAddress() {
    const { accountAddress, eventTypeToString, statusStr, isDeposit, isWithdraw } = this;

    if (isDeposit) {
      return accountAddress;
    }

    if (isWithdraw) {
      return Store.$app.$tx.getReserveContract()._address;
    }

    if (statusStr === 'AUCTION' || statusStr === 'BID') {
      return accountAddress;
    }

    if (statusStr === 'RETRIVE') {
      return '';
    }

    if (eventTypeToString === 'NEGO') {
      return statusStr === 'START' ? accountAddress : Store.$app.$tx.getSellOfferContract()._address;
    }

    return '';
  }

  get toAddress() {
    const { accountAddress, eventTypeToString, statusStr, isDeposit, isWithdraw } = this;

    if (isDeposit) {
      return Store.$app.$tx.getTargetCurrencyIO(0);
    }

    if (isWithdraw) {
      return accountAddress;
    }

    if (statusStr === 'AUCTION' || statusStr === 'BID') {
      return Store.$app.$tx.getAuctionContract()._address;
    }

    if (statusStr === 'RETRIVE') {
      return accountAddress;
    }

    if (eventTypeToString === 'NEGO') {
      return statusStr === 'START' ? Store.$app.$tx.getSellOfferContract()._address : accountAddress;
    }

    return '';
  }

  // 유저에게 보여줄 이벤트명
  get eventToString() {
    const { statusStr, typeStr, isDeposit, isWithdraw } = this;
    const $t = Store.$app.$t.bind(Store.$app);

    // 자산 관련 이벤트라면 statusStr, NFT 관련 이벤트라면 typeStr 기반으로 체크
    const targetState = this.type === 'token' ? statusStr : typeStr;

    if (isDeposit) {
      return $t('General.Deposit');
    }

    if (isWithdraw) {
      return $t('General.Withdraw');
    }

    switch (targetState) {
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
      case 'TOKEN': {
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
