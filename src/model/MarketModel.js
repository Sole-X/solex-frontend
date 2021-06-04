import Store from '@/store'

const getDate = () => {
  return Store.$app.$date
}

const getFileURL = () => {
  return Store.$app.$static.getFileURL
}

export class NftInfo {
  constructor(props = {}) {
    this.createdAt = props.createdAt || 'now'
    this.ownerAddress = props.ownerAddress || ''
    this.platform = props.platform || 0
    this.price = props.price || '0'
    this.status = props.status || 0
    this.tokenAddress = props.tokenAddress || ''
    this.tokenId = props.tokenId || '0'
    this.tokenUri = props.tokenUri || ''
    this.tokenName = props.tokenName || '';
    this.tradeId = props.tradeId || ''
    this.type = props.type || 0;
    this.updatedAt = props.updatedAt || 'now'
    this.isCollected = props.isCollected ?? true
    this.like = props.like || false
    this.metadata = props.desc || {
      name: '',
      description: '',
      animationUrl: null,
      image: '',
      tokenUri: ''
    }
    this.nftInfo = props.nftInfo || {}

    // 이 값이 true로 넘어온다면 buy, sell, auction 등 기본 설정하지 않기
    if(!props.isDetail) {
      this.buy = props.buy
      this.sell = props.sell
      this.auction = props.auction
      this.exchange = this.buy || this.sell
    }
  }

  get id() {
    return `${this.platform}:${this.tokenAddress}:${this.tokenId}:${this.tradeId}`
  }

  get isDeposited() {
    return this.status === 1
  }

  get isInWallet() {
    return this.status === 0
  }

  get isOnWithdraw() {
    return this.status === 7
  }

  get isOnTrade() {
    return this.status === 2 || this.status === 3;
  }

  get isAuction() {
    return !!this.auction;
  }

  get isBuy() {
    return !!this.buy;
  }

  get isSell() {
    return !!this.sell;
  }

  get isExchange() {
    return !!(this.isBuy || this.isSell);
  }

  get isLiked() {
    if(this.isExchange) {
      return this.exchange.liked
    }

    if(this.isAuction) {
      return this.auction.liked
    }

    if(this.isBuy) {
      return this.buy.liked;
    }

    return false
  }

  get chainIcon() {
    if (this.nftInfo.platform === 'ETH') {
      return getFileURL()('img/icon/ic-token-eth.svg')
    }

    if (this.nftInfo.platform === 'KLAY') {
      return getFileURL()('img/icon/ic-token-klay.svg')
    }

    return ''
  }

  get chainName() {
    if (this.nftInfo.platform === 'ETH') {
      return 'Ethereum'
    }

    if (this.nftInfo.platform === 'KLAY') {
      return 'Klaytn'
    }

    return ''
  }

  get itemName() {
    return this.metadata.name || this.tokenId
  }

  get collectionName() {
    return this.nftInfo?.name ?? `${this.tokenAddress.slice(0, 8) }...`
  }
}
