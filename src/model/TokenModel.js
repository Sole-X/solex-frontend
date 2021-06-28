import Store from '@/store';

export class WhitelistNft {
  constructor(props = {}) {
    this.name = props.name || '';
    this.symbol = props.symbol || '';
    this.address = {
      ETHEREUM: props.ethAddress || '',
      KLAYTN: props.tokenAddress || '',
    };
    this.chain = ['KLAYTN'];
    this.logoUrl = props.logoUrl || '';
    this.platform = props.platform || '';
    this.tokenAddress = props.tokenAddress || '';
  }

  get currentAddress() {
    return this.address[Store.getters.getChainInfo.chain];
  }

  // 우리 내부 컨트랙트에서 자금이 도는 경우 현재는 무조건 KLAYTN 기반 주소로 요청
  get addressToReserve() {
    return this.address.KLAYTN;
  }

  get chainName() {
    if (this.platform === 'KLAY') {
      return 'Klaytn';
    } else {
      return 'Ethereum';
    }
  }
}

export class WhitelistToken {
  constructor(props = {}) {
    this.name = props.name || '';
    this.symbol = props.symbol || '';
    this.address = {
      ETHEREUM: props.ethAddress || '',
      KLAYTN: props.tokenAddress || '',
    };
    this.decimal = props.decimal || props.decimals || 18;
    this.chain = ['KLAYTN'];
    this.usdPrice = props.usdPrice || '0';
    this.tokenAddress = props.tokenAddress || '0';
    this.desc = props.desc || '';

    this.balance = '0';
    this.deposit = '0';
    this.onTrade = '0';
    this.totalDeposit = '0'; // deposit + onTrade + onBuy ...

    this.staking = '0';
    this.unstaking = '0';
  }

  get decBalance() {
    return Store.$app.$bn.toMaxUnit(this.balance, this.decimal, this.decimal);
  }

  get decDeposit() {
    return Store.$app.$bn.toMaxUnit(this.deposit, this.decimal, this.decimal);
  }

  get decOnTrade() {
    return Store.$app.$bn.toMaxUnit(this.onTrade, this.decimal, this.decimal);
  }

  get decTotalDeposit() {
    return Store.$app.$bn.toMaxUnit(this.totalDeposit, this.decimal, this.decimal);
  }

  get decStaking() {
    return Store.$app.$bn.toMaxUnit(this.staking, this.decimal, this.decimal);
  }

  get decUnstaking() {
    return Store.$app.$bn.toMaxUnit(this.unstaking, this.decimal, this.decimal);
  }

  get currentAddress() {
    return this.address[Store.getters.getChainInfo.chain];
  }

  // 우리 내부 컨트랙트에서 자금이 도는 경우 현재는 무조건 KLAYTN 기반 주소로 요청
  get addressToReserve() {
    return this.address.KLAYTN;
  }

  toFiat(amount, price = this.usdPrice) {
    return Store.$app.$bn.mulBN(amount, price).toString();
  }
}
