<template>
  <article class="asset-item-card-home" @click="handleItemClicked">
    <section
        class="asset-item-card-home-thumbnail"
        :style="{
          'background-image': `url(${getItemImgSrc})`,
          'background-size': 'contain',
          'background-position': 'center center',
          'background-color': '#fafbfc'
        }"
    >
      <header class="asset-item-card-home-thumbnail-header">
        <div class="asset-item-card-home-thumbnail-header-left">
          <label v-if="getItemType === 'buy'" :style="{'background-color': '#edf3fc', 'color': '#6B7F99'}">
            {{ getItemOnOff === 'on' ? $t('Market.LabelBuyOn') : $t('Market.LabelBuyOff') }}
          </label>
          <label v-else-if="getItemType === 'sell'" :style="{'background-color': '#edf3fc', 'color': '#66a1ff'}">
            {{ getItemOnOff === 'on' ? $t('Market.LabelSaleOn') : $t('Market.LabelSaleOff') }}
          </label>
          <label v-else-if="getItemType === 'auction'" :style="{'background-color': '#faf7f2', 'color': '#e66d16'}">
            {{ getItemOnOff === 'on' ? $t('Market.LabelAuctionOn') : $t('Market.LabelAuctionOff') }}
          </label>
        </div>
        <div class="asset-item-card-home-thumbnail-header-right">
          <img v-show="options.showChain" :src="getItemChainIcon" width="20px" :style="{marginRight: '8px'}">
          <img v-show="options.showHeart" :src="getItemHeartIcon" width="20px" :style="{cursor: 'pointer'}">
        </div>
      </header>
    </section>
    <div class="asset-item-card-home-info">
      <div class="asset-item-card-home-info-token-address">
        {{ getItemTokenAddress }}
      </div>
      <div class="asset-item-card-home-info-title">
        {{ getItemTitle }}
      </div>
      <div class="asset-item-card-home-info-price">
        <span>{{ getItemPrice }}</span>
        <span>{{ getItemSymbol }}</span>
      </div>
      <div class="asset-item-card-home-info-detail">
        <span>$ {{ getUsdPrice }}</span> <div v-if="getItemType!=='buy'" class="info-detail-dot"></div> <span>{{ getNumOfParticipation }}</span> <span>{{ getStringOfParticipation }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

let $t, self

export default {
  name: 'AssetItemCardMyPage',

  mixins: [],

  props: {
    item: Object,
    options: {
      type: Object,
      default() {
        return {
          showLabel: true,
          showChain: true,
          showHeart: false
        }
      }
    },
    category: String
  },

  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {

  },

  beforeDestroy() {

  },

  data() {
    return {
      isHeart: this.item.like
    }
  },

  computed: {
    ...mapGetters([
        'getSupportCurrency'
    ]),

    getItemImgSrc() {
      if (this.item.nftInfo) {
        if (this.item.nftInfo.desc) {
          if (this.item.nftInfo.desc.image !== '') {
            return this.item.nftInfo.desc.image;
          }
        }
      }
      if (this.item.desc) {
        if (this.item.desc.image !== '') {
          return this.item.desc.image;
        }
      }
      if (this.item.metadata) {
        if (this.item.metadata.image !== '') {
          return this.item.metadata.image;
        }
      }
      return this.$static.getFileURL('img/thumbnail/thumb-lazyloading.svg');
    },

    getItemCollection() {
      if (this.item) {
        return this.item.collectionName;
      }
      return '';
    },

    getItemTitle() {
      if (this.category === 'popular') {
        if (this.item.desc) {
          return this.item.desc.name;
        }
        return this.item.tokenName;
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        return this.item.tokenName;
      }

      if (this.category === 'recentlyView') {
        return this.item.tokenName;
      }
    },

    getItemChainIcon() {
      if (this.category === 'popular') {
        if(this.item.platform === 1) {
          return this.$static.getFileURL('img/icon/ic-token-eth.svg')
        }
        if(this.item.platform === 2) {
          return this.$static.getFileURL('img/icon/ic-token-klay.svg')
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        if(this.item.nftInfo.platform === 1) {
          return this.$static.getFileURL('img/icon/ic-token-eth.svg')
        }
        if(this.item.nftInfo.platform === 2) {
          return this.$static.getFileURL('img/icon/ic-token-klay.svg')
        }
      }

      if (this.category === 'recentlyView') {
        if(this.item.nftInfo && this.item.nftInfo.platform === 1) {
          return this.$static.getFileURL('img/icon/ic-token-eth.svg')
        }
        if(this.item.nftInfo && this.item.nftInfo.platform === 2) {
          return this.$static.getFileURL('img/icon/ic-token-klay.svg')
        }
      }

      return ''
    },

    getItemHeartIcon() {
      if (this.item.like) {
        return this.$static.getFileURL('img/icon/ic-heart-asset-on.svg');
      } else {
        return this.$static.getFileURL('img/icon/ic-heart-asset-off.svg');
      }
    },

    getItemOnOff() {
      let status = null;

      if (this.category === 'popular') {
        if (this.getItemType === 'buy') {
          status = this.item.status;
        } else if (this.getItemType === 'sell') {
          status = this.item.status;
        } else if (this.getItemType === 'auction') {
          status = this.item.status;
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        if (this.getItemType === 'buy') {
          status = this.item.status;
        } else if (this.getItemType === 'sell') {
          status = this.item.status;
        } else if (this.getItemType === 'auction') {
          status = this.item.status;
        }
      }

      if (this.category === 'recentlyView') {
        if (this.getItemType === 'buy') {
          status = this.item.status;
        } else if (this.getItemType === 'sell') {
          status = this.item.status;
        } else if (this.getItemType === 'auction') {
          status = this.item.status;
        }
      }

      if (status === 3 || status === 7 || status === 8) return 'off';
      return 'on';
    },

    getItemType() {
      if (this.category === 'popular') {
        // 가장 인기 있는 아이템
        if (this.item.type === 1 || this.item.type === 2) {
          return 'auction';
        } else if (this.item.type === 3 || this.item.type === 4) {
          return 'sell';
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        // 최신 아이템
        if (this.item.type === 1 || this.item.type === 2) {
          return 'auction';
        } else if (this.item.type === 3 || this.item.type === 4) {
          return 'sell';
        } else {
          return 'buy';
        }
      }

      if (this.category === 'collectibles') {
        // 수집품
      }

      if (this.category === 'recentlyView') {
        // 최근에 본 아이템
        if (this.item.saleType === 'BUY') {
          return 'buy';
        } else if (this.item.saleType === 'SELL') {
          if (this.item.type === 1 || this.item.type === 2) {
            return 'auction';
          } else if (this.item.type === 3 || this.item.type === 4) {
            return 'sell';
          }
        }
      }
    },

   getItemTokenAddress() {
      if (this.category === 'popular') {
        return this.item.tokenAddress;
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        return this.item.tokenAddress;
      }

      if (this.category === 'recentlyView') {
        return this.item.tokenAddress;
      }
    },

    getItemTokenId() {
      if (this.category === 'popular') {
        return this.item.tokenId;
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        return this.item.tokenId;
      }

      if (this.category === 'recentlyView') {
        return this.item.tokenId;
      }
    },

    getItemTradeId() {
      if (this.category === 'popular') {
        return this.item.id;
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        return this.item.id;
      }

      if (this.category === 'recentlyView') {
        return this.item.id;
      }
    },

    getItemPrice() {
      let price;

      if (this.category === 'popular') {
        if (this.getItemType === 'buy') {
          price = this.item.price
        } else if (this.getItemType === 'sell') {
          price = this.item.currentPrice;
        } else if (this.getItemType === 'auction') {
          price = this.item.currentPrice;
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        price = this.item.currentPrice;
      }

      if (this.category === 'recentlyView') {
        if (this.getItemType === 'buy') {
          price = this.item.basePrice;
        } else if (this.getItemType === 'sell' || this.getItemType === 'auction') {
          price = this.item.currentPrice;
        }
      }

      price = this.$bn.toMaxUnit(price, this.getCurrency(this.item.currency).decimal, 4);

      return price;
    },

    getItemSymbol() {
      if (this.category === 'popular') {
        if (this.getItemType === 'sell') {
          return this.getCurrency(this.item.currency).symbol;
        } else if (this.getItemType === 'auction') {
          return this.getCurrency(this.item.currency).symbol;
        }
        return this.getCurrency(this.item.currency).symbol;
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        return this.getCurrency(this.item.currency).symbol;
      }

      if (this.category === 'recentlyView') {
        return this.getCurrency(this.item.currency).symbol;
      }
    },

    getUsdPrice() {
      let currency;

      if (this.category === 'popular') {
        if (this.getItemType === 'buy') {
          currency = this.getCurrency(this.item.currency);
          if (currency && currency.toFiat) return currency.toFiat(this.getItemPrice).dprec(4);
          return this.item.usdPrice;
        } else if (this.getItemType === 'sell') {
          currency = this.getCurrency(this.item.currency);
          if (currency && currency.toFiat) return currency.toFiat(this.getItemPrice).dprec(4);
          return this.item.usdPrice;
        } else if (this.getItemType === 'auction') {
          currency = this.getCurrency(this.item.currency);
          if (currency && currency.toFiat) return currency.toFiat(this.getItemPrice).dprec(4);
          return this.item.usdPrice;
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        currency = this.getCurrency(this.item.currency);
        if (currency && currency.toFiat) return currency.toFiat(this.getItemPrice).dprec(4);
        return this.item.usdPrice;
      }

      if (this.category === 'recentlyView') {
        currency = this.getCurrency(this.item.currency);
        if (currency && currency.toFiat) return currency.toFiat(this.getItemPrice).dprec(4);
      }
    },

    getNumOfParticipation() {
      if (this.category === 'popular') {
        if (this.getItemType === 'buy') {
          return '';
        } else if (this.getItemType === 'sell') {
          return this.item.negos ? this.item.negos.length : 0;
        } else if (this.getItemType === 'auction') {
          return this.item.bids ? this.item.bids.length : 0;
        }
      }

      if (this.category === 'recently' || this.category === 'ethereum' || this.category === 'klaytn' || this.category === 'collectibles') {
        if (this.getItemType === 'buy') {
          return '';
        } else if (this.getItemType === 'sell') {
          return this.item.negos.length;
        } else if (this.getItemType === 'auction') {
          return this.item.bids.length;
        }
      }

      if (this.category === 'recentlyView') {
        if (this.getItemType === 'buy') {
          return '';
        } else if (this.getItemType === 'sell') {
          return this.item.negos ? this.item.negos.length : 0;
        } else if (this.getItemType === 'auction') {
          return this.item.bids ? this.item.bids.length : 0;
        }
      }
    },

    getStringOfParticipation() {
      if (this.getItemType === 'buy') {
        return '';
      } else if (this.getItemType === 'sell') {
        return this.$t('Market.Negotiations');
      } else if (this.getItemType === 'auction') {
        return this.$t('Market.Bids');
      }
    }
  },

  watch: {

  },

  methods: {
    handleItemClicked(event) {
      const tokenAddress = this.getItemTokenAddress;
      const tokenId = this.getItemTokenId;
      const tradeId = this.getItemTradeId;

      if (tokenAddress && tokenId && tradeId) {
        this.$router.push({
          path: `/asset/item/${tokenAddress}/${tokenId}`,
          query: {
            type: this.getItemType==='buy' ? 'buy' : 'sell',
            tradeId: tradeId,
          }
        })
      } else if (tokenAddress && tokenId && !tradeId) {
        // TODO : deposit으로 가게 함.
      }
    },

    getCurrency(address) {
      const currency = _.find(this.getSupportCurrency, (row) => {
        if (this.$wallet.isSameAddress(row.tokenAddress, address)) return true;
        return false;
      })

      if (currency) {
        return currency
      }

      return {
        decimal: 1,
        symbol: 'Symbol'
      };
    }
  },

  components: {

  }
}
</script>