<template>
  <section :class="$bem('asset-item__profile', '', ['deposited'])">
    <article class="asset-item__profile__title">
      <div class="asset-item__profile__collection">
        <h6 @click="collectionClicked">{{ info.collectionName || '-' }}</h6>
      </div>

      <h1>{{ info.itemName }}</h1>
      <div class="asset-item__hypen-row">
        <span class="asset-item__hypen-row__label">{{ $t('Market.OwnerTitle') }}</span>
        <span class="divider"></span>
        <span v-if="info.isMyItem" class="asset-item__hypen-row__value text-secondary">{{
          $t('Market.OwnerIsMe')
        }}</span>
        <span
          v-else
          v-clipboard:copy="info.ownerAddress"
          class="asset-item__hypen-row__value text-secondary writer-copy"
          v-clipboard:success="handleWriterClicked"
          >{{ info.ownerAddress }}</span
        >
        <div class="writer-copied" v-if="isCopy">copied</div>
      </div>
    </article>

    <article class="asset-item__profile__detail">
      <ul>
        <li class="asset-item__profile__detail__price">
          <div>{{ getPriceLabel }}</div>
          <div>
            <p>
              <strong class="text-secondary">
                {{ getItemPrice | addComma }}
              </strong>
              {{ info.currencyInfo ? info.currencyInfo.symbol : '' }}
            </p>
            <p>$ {{ getUsdPrice }}</p>
          </div>
        </li>
      </ul>
    </article>

    <article v-if="walletConnected" class="asset-item__profile__action">
      <button
        :class="
          info.isCollected && $route.query.tradeId
            ? 'asset-item__profile__action__bookmark'
            : 'asset-item__profile__action__bookmark disabled'
        "
        @click="handleLikeClicked"
      >
        <img :src="$static.getFileURL(`img/icon/ic-heart-asset-${likeLocal ? 'on' : 'off'}.svg`)" />
      </button>

      <button
        v-if="buttonProps.leftButton"
        :class="$bem('common-submit-button', '', buttonProps.leftButton.classes)"
        @click="buttonProps.leftButton.click"
      >
        {{ buttonProps.leftButton.title }}
        <ui-tooltip v-if="buttonProps.leftButton.tooltip" position="bottom">
          {{ buttonProps.leftButton.tooltip }}
        </ui-tooltip>
      </button>
      <button
        v-if="buttonProps.rightButton"
        :class="$bem('common-submit-button', '', buttonProps.rightButton.classes)"
        @click="buttonProps.rightButton.click"
      >
        {{ buttonProps.rightButton.title }}
        <ui-tooltip v-if="buttonProps.rightButton.tooltip" position="bottom">
          {{ buttonProps.rightButton.tooltip }}
        </ui-tooltip>
      </button>
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

let $t, component;

export default {
  name: 'AssetItemProfileDeposited',
  props: {
    info: Object,
    buttonProps: Object,
    walletConnected: Boolean,
    page: String,
    like: Boolean,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      likeLocal: this.like,
      isCopy: false,
    };
  },

  computed: {
    ...mapGetters(['getMaskedAddress', 'getSupportCurrency']),

    getPriceLabel() {
      let label = $t('Market.AveragePrice');
      return label;
    },

    getItemPrice() {
      let basePrice = this.info.price ? this.info.price : '0';

      const currency = this.getCurrency;
      if (currency.symbol !== 'null') {
        return this.$bn.toMaxUnit(basePrice, currency.decimal, 4);
      }

      return basePrice;
    },

    getCurrency() {
      const supportCurrency = this.getSupportCurrency;
      const itemCurrencyAddress = this.info ? this.info.currency : null;

      if (itemCurrencyAddress) {
        const itemCurrency = _.find(supportCurrency, (row) => {
          if (this.$wallet.isSameAddress(row.tokenAddress, itemCurrencyAddress)) return true;
          return false;
        });
        if (itemCurrency) {
          return itemCurrency;
        }
      }
      return {
        decimal: 18,
        symbol: 'Symbol',
      };
    },

    getUsdPrice() {
      let usdPrice = this.info.usdPrice;

      const currency = this.getCurrency;
      if (currency.symbol !== 'Symbol') {
        usdPrice = currency.toFiat(this.getItemPrice);
      }
      return usdPrice.dprec(4);
    },
  },

  watch: {},

  methods: {
    handleMakeAuction() {
      this.$router.push({
        path: '/asset/make-offer/auction',
      });
    },

    handleMakeExchange(isMyItem) {
      this.$router.push({
        path: '/asset/make-offer/normal',
        query: {
          type: isMyItem ? 'sell' : 'buy',
          tokenAddress: this.info.tokenAddress,
          tokenId: this.info.tokenId,
        },
      });
    },

    handleLikeClicked() {
      if (!this.info.isCollected || !this.$route.query.tradeId) {
        return;
      }
      this.$emit('onClickLike');
      this.likeLocal = !this.likeLocal;
    },

    handleWriterClicked(event) {
      this.isCopy = true;
      setTimeout(() => {
        this.isCopy = false;
      }, 500);
    },

    collectionClicked() {
      const collectionName = this.info.collectionName;
      const collectionTokenAddress = this.info.tokenAddress;

      if (collectionName && collectionTokenAddress) {
        this.$router.push({
          path: '/collection',
          query: {
            collection: collectionName,
            collectionAddress: collectionTokenAddress,
          },
        });
      }
    },
  },

  components: {},
};
</script>
