<template>
  <div class="asset-item-card2" @click="itemClicked">
    <div
        class="asset-item-card2-thumbnail"
        :style="{
          'background-image': `url(${isImageLazyloading ? $static.getFileURL('img/thumbnail/thumb-lazyloading.svg') : getItemImgSrc})`,
          'background-size': 'contain'
        }"
        :data-imgsrc="getItemImgSrc"
    >
      <div class="asset-item-card2-thumbnail-header">
        <div class="asset-item-card2-thumbnail-header-left">
          <div v-if="type === 'sell'">
            <div v-if="isSell" :style="{'background-color': '#edf3fc', 'color': '#66a1ff'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelSaleOn') : $t('Market.LabelSaleOff') }}
            </div>
            <div v-else-if="isAuction" :style="{'background-color': '#faf7f2', 'color': '#e66d16'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelAuctionOn') : $t('Market.LabelAuctionOff') }}
            </div>
          </div>
          <div v-else-if="type === 'buy'">
            <div :style="{'background-color': '#edf3fc', 'color': '#6B7F99'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelBuyOn') : $t('Market.LabelBuyOff') }}
            </div>
          </div>
          <div v-else-if="type === 'home'">
            <div v-if="isBuy" :style="{'background-color': '#edf3fc', 'color': '#6B7F99'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelBuyOn') : $t('Market.LabelBuyOff') }}
            </div>
            <div v-if="isSell" :style="{'background-color': '#edf3fc', 'color': '#66a1ff'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelSaleOn') : $t('Market.LabelSaleOff') }}
            </div>
            <div v-if="isAuction" :style="{'background-color': '#faf7f2', 'color': '#e66d16'}">
              {{ getItemOnOff === 'on' ? $t('Market.LabelAuctionOn') : $t('Market.LabelAuctionOff') }}
            </div>
          </div>
        </div>
        <div class="asset-item-card2-thumbnail-header-right">
          <div class="asset-item-card2-thumbnail-header-right-chain">
            <img v-if="getPlatform === 1" :src="$static.getFileURL('img/icon/ic-chain-ethereum.svg')">
            <img v-if="getPlatform === 2" :src="$static.getFileURL('img/icon/ic-chain-klaytn.svg')">
          </div>
          <div v-if="options.showHeart" class="asset-item-card2-thumbnail-header-right-heart" @click="heartClicked">
            <img v-if="isHeart" :src="$static.getFileURL('img/icon/ic-heart-asset-on.svg')">
            <img v-else :src="$static.getFileURL('img/icon/ic-heart-asset-off.svg')">
          </div>
        </div>
      </div>
    </div>
    <div class="asset-item-card2-description">
      <div class="asset-item-card2-description-header">
        <div class="asset-item-card2-description-header-token">{{ item.tokenAddress }}</div>
        <div class="asset-item-card2-description-header-title">{{ getItemName }}</div>
      </div>

      <div class="asset-item-card2-description-footer">
        <div class="asset-item-card2-description-footer-eth">
          <span>{{ getItemPrice | addComma }}</span>
          <span>&nbsp;{{ getCurrency.symbol }}</span>
        </div>
        <div class="asset-item-card2-description-footer-usd">
          $ {{ getItemUsdPrice | addComma }}<div class="item-card-dot" v-if="type==='sell'"></div>
          <span v-if="getParticipation !== null">{{ getParticipation }} {{ getParticipationString }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

let $t, self

export default {
  name: 'AssetItemCard2',
  props: {
    item: {
      type: Object
    },
    type: {
      type: String
    },
    page : {
      type: String
    },
    info: {
      type: Object,
      default() {
        return {
          currencyInfo: {}
        }
      }
    },
    options: {
      type: Object,
      default() {
        return {
          showLabel: true,
          showChain: true,
          showHeart: true
        }
      }
    }
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
      'getSupportCurrency',
      'getSupportNft'
    ]),

    getItemPrice() {
      let basePrice = "0";

      if (this.type === 'buy') {
        basePrice = this.item.basePrice;
      } else if (this.type === 'sell') {
        basePrice = this.item.currentPrice;
      }

      const currency = this.getCurrency;
      if (currency.symbol !== 'null') {
        return this.$bn.toMaxUnit(basePrice, currency.decimal, 4);
      }

      return basePrice;
    },

    getItemUsdPrice() {
      let usdPrice = "0.00";

      if (this.type === 'buy') {
        const price = this.getItemPrice;
        const currency = this.getCurrency;
        if (currency && currency.toFiat) {
          usdPrice = currency.toFiat(price);
        }
      } else if (this.type === 'sell') {
        const price = this.getItemPrice;
        const currency = this.getCurrency;
        if (currency && currency.toFiat) {
          usdPrice = currency.toFiat(price);
        }
      }

      return usdPrice;
    },

    getCurrency() {
      const supportCurrency = this.getSupportCurrency;
      const itemCurrencyAddress = this.item ? this.item.currency : null;

      if (itemCurrencyAddress) {
        const itemCurrency = _.find(supportCurrency, row => {
          if (this.$wallet.isSameAddress(row.tokenAddress, itemCurrencyAddress)) return true;
          return false;
        });
        if (itemCurrency) {
          return itemCurrency;
        }
      }
      return {
        decimal: 1,
        symbol: 'Symbol',
        toFiat: () => {}
      }
    },

    isImageLazyloading() {
      if (this.page === 'itemcard') {
        return false;
      }
      return true;
    },

    getItemImgSrc() {
      if (this.item.nftInfo) {
        if (this.item.nftInfo.desc) {
          return this.item.nftInfo.desc.image;
        } else {
          return '';
        }
      } else {
        if (this.item.desc) {
          return this.item.desc.image;
        } else {
          return '';
        }
      }
    },

    getParticipation() {
      let participation = 0;
      if (this.type === 'buy') {
        participation = null;
      } else if (this.type === 'sell') {
        if (this.item.bids || this.item.negos) {
          participation = Math.max(this.item.bids.length, this.item.negos.length);
        }
      } else if (this.type === 'home') {
        if (!!this.item.sell) {
          participation = this.item.sell.negos.length;
        } else if (!!this.item.buy) {
          participation = null;
        } else if (!!this.item.auction) {
          participation = this.item.auction.bids.length;
        }
      }
      return participation;
    },

    getParticipationString() {
      let participationString = '';

      if (this.type === 'buy') {
        if (this.isBuy) participationString = '';
      } else if (this.type === 'sell') {
        if (this.isAuction) {
          participationString = this.$t('Market.Bids');
        } else if (this.isSell) {
          participationString = this.$t('Market.Negotiations');
        }
      } else if (this.type === 'home') {
        if (this.isBuy) {
          participationString = '';
        } else if (this.isSell) {
          participationString = this.$t('Market.Negotiations');
        } else if (this.isAuction) {
          participationString = this.$t('Market.Bids');
        }
      }
      return participationString;
    },

    getPlatform() {
      let platform = 0;
      let tokenAddress = this.item.tokenAddress;
      const supportNft = _.find(this.getSupportNft, row => {
        if (this.$wallet.isSameAddress(row.tokenAddress, tokenAddress)) return true;
        return false;
      });
      if (supportNft) {
        if (supportNft.platform === 'KLAY') platform = 2;
        else platform = 1;
      }

      return platform;
    },

    getItemName() {
      let name = '';
      if (this.type === 'buy') {
        if (this.item.nftInfo && this.item.nftInfo.desc) {
          name = this.item.nftInfo.desc.name;
        }
      } else if (this.type === 'sell') {
        if (this.item.nftInfo && this.item.nftInfo.desc) {
          name = this.item.nftInfo.desc.name;
        }
      } else if (this.type === 'home') {
        name = this.item.desc ? this.item.desc.name : '';
      }
      return name;
    },

    getItemType() {
      if (this.type === 'sell') {
        if (this.isAuction) return 'auction';
        else if (this.isSell) return 'sell';
      } else if (this.type === 'buy') {
        return 'buy';
      } else if (this.type === 'home') {
        if (this.isBuy) return 'buy';
        else if (this.isSell) return 'sell';
        else if (this.isAuction) return 'auction';
      }
    },

    getItemOnOff() {
      let status = null;

      if (this.type === 'home') {
        if (this.isBuy) {
          status = this.item.buy.status;
        } else if (this.isSell) {
          status = this.item.sell.status;
        } else if (this.isAuction) {
          status = this.item.auction.status;
        }
      } else if (this.type === 'buy' || this.type === 'sell') {
        status = this.item.status;
      }
      if (status === 3 || status === 7 || status === 8) return 'off';
      return 'on';
    },

    isBuy() {
      if (this.type === 'home') {
        return !!this.item.buy;
      } else if (this.type === 'buy') {
        return true;
      } else if (this.type === 'sell') {
        return false;
      }
    },

    isSell() {
      if (this.type === 'home') {
        return !!this.item.sell;
      } else if (this.type === 'buy') {
        return false;
      } else if (this.type === 'sell') {
        switch (this.item.type) {
          case 1:
          case 2:
            return false;
          case 3:
          case 4:
            return true;
          default:
            return false;
        }
      }
    },

    isAuction() {
      if (this.type === 'home') {
        return !!this.item.auction;
      } else if (this.type === 'buy') {
        return false;
      } else if (this.type === 'sell') {
        switch (this.item.type) {
          case 1:
          case 2:
            return true;
          case 3:
          case 4:
            return false;
          default:
            return false;
        }
      }
    }
  },

  watch: {

  },

  methods: {
    ...mapActions([
      'toggleNft'
    ]),

    heartClicked(event) {
      event.preventDefault();
      event.stopPropagation();

      const tradeId = this.item.id;
      this.isHeart = !this.isHeart;

      return this.toggleNft({
        type: this.isHeart ? 'on' : 'off',
        tradeId: tradeId
      })
    },

    itemClicked() {
      const { type, item } = this

      this.$router.push({
        path: `/asset/item/${item.tokenAddress}/${item.tokenId}`,
        query: {
          type,
          tradeId: item.id,
          like: this.item.like
        }
      })
    }
  },

  components: {

  }
}
</script>
