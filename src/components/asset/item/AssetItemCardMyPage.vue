<template>
  <article class="asset-item-card-my-page" @click="handleItemClicked">
    <section
        class="asset-item-card-my-page-thumbnail"
        :style="{
          'background-image': `url(${getItemImgSrc})`,
          'background-size': 'contain',
          'background-position': 'center center',
          'background-color': '#fafbfc'
        }"
    >
      <header class="asset-item-card-my-page-thumbnail-header">
        <div class="asset-item-card-my-page-thumbnail-header-left">
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
        <div class="asset-item-card-my-page-thumbnail-header-right">
          <img v-show="options.showChain" :src="getItemChainIcon" width="20px" :style="{marginRight: '8px'}">
          <img v-show="options.showHeart" :src="getItemHeartIcon" width="20px" :style="{cursor: 'pointer'}">
        </div>
      </header>
    </section>
    <div class="asset-item-card-my-page-info">
      <div class="asset-item-card-my-page-info-token-address">
        {{ getItemCollection }}
      </div>
      <div class="asset-item-card-my-page-info-title">
        {{ getItemTitle }}
      </div>
    </div>
  </article>
</template>

<script>
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
      if (this.item.metadata) {
        return this.item.metadata.name;
      }
      return '';
    },

    getItemChainIcon() {
      return this.item.chainIcon;
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

    getItemType() {
      if (!!this.item.buy) {
        return 'buy';
      } else if (!!this.item.sell) {
        return 'sell';
      } else if (!!this.item.auction) {
        return 'auction';
      }
    }
  },

  watch: {

  },

  methods: {
    handleItemClicked(event) {
      const tokenAddress = this.item.metadata ? this.item.metadata.tokenAddress : '';
      const tokenId = this.item.metadata ? this.item.metadata.tokenId : '';
      const tradeId = this.item.tradeId;

      if (tokenAddress && tokenId && tradeId) {
        this.$router.push({
          path: `/asset/item/${tokenAddress}/${tokenId}`,
          query: {
            type: this.getItemType,
            tradeId: tradeId,
            like: this.item.like
          }
        })
      } else if (tokenAddress && tokenId && !tradeId) {
        // TODO : deposit으로 가게 함.
      }

    }
  },

  components: {

  }
}
</script>