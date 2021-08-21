<template>
  <div class="asset-form-page">
    <section class="asset-form__body">
      <div class="asset-page__category">
        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{ $t('General.Item')[0] }}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', ['current'])">
          <span>{{ $t('Market.Bid') }}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{ $t('General.Complete') }}</span>
        </div>
      </div>

      <div class="asset-form__title">
        <h1>
          <strong>{{ $t('Market.DoBid') }}</strong>
        </h1>

        <p>{{ getItemInfo.collectionName }} {{ getItemInfo.itemName }}</p>
      </div>

      <div class="asset-form__image">
        <img :src="getItemInfo.metadata.image" />
      </div>

      <div class="asset-form__row">
        <div class="asset-form__row__label">
          <div class="asset-form__row__label__in">
            <h5>{{ getBidsLength() === 0 ? $t('Market.Bids0') : $t('Market.Bids1') }}</h5>
            <button class="asset-item__request__more" @click="$_AssetAuctionMixin_openBidStatusModal(getItemInfo)">
              <img
                :src="
                  $static.getFileURL(`img/icon/ic-message-${getItemInfo.auction.bids.length > 0 ? 'black' : 'gray'}.svg`)
                "
              />
              <span v-html="$t('Market.BidCount', { total: getItemInfo.auction.bids.length })" />
            </button>
          </div>
          <span class="asset-form__row__label__sub">
            {{ $t('Market.DoNegoCheckStatus') }}
          </span>
        </div>

        <div class="asset-form__current-bid">
          <p>
            <strong>{{
              $bn.toMaxUnit(getItemInfo.auction.currentPrice, getItemInfo.currencyInfo.decimal, 4) | addComma
            }}</strong>
            {{ getItemInfo.currencyInfo.symbol }}
          </p>

          <p><!--usdPrice--></p>
        </div>
      </div>

      <div class="asset-form__row">
        <div class="asset-form__row__label">
          <h5>{{ $t('Market.MyBidPrice') }}</h5>
          <span class="asset-form__row__label__sub">
            {{
              $t('Market.MyBidPriceWarning', {
                price: $bn.toMaxUnit(getItemInfo.auction.basePrice, getItemInfo.currencyInfo.decimal, 4 | addComma),
                token: usedCurrency.symbol,
              })
            }}
          </span>
        </div>

        <div class="asset-form__price">
          <div class="asset-form__price__input">
            <input type="number" step="any" :placeholder="$t('Market.BidFormPlaceholder')" v-model="price" />
            <button>
              <img :src="$static.getFileURL(`img/icon/ic-token-${usedCurrency.symbol.toLowerCase()}.svg`)" />
              {{ usedCurrency.symbol }}
            </button>
          </div>

          <div class="asset-form__price__balance">
            <span>{{ $t('Market.UserBalanceLabel', { token: usedCurrency.symbol }) }} : </span>
            <span
              ><strong>{{ usedCurrency.decDeposit.dprec(4) | addComma }}</strong> {{ usedCurrency.symbol }}
            </span>
          </div>

          <div class="asset-form__price-error" v-if="priceError0">
            {{ $t('Market.ErrorMessage2', { token: usedCurrency.symbol }) }}
          </div>
          <div class="asset-form__price-error" v-if="priceError1">
            {{ $t('Market.ErrorMessage3') }}
          </div>
          <div class="asset-form__price-error" v-if="priceErrorOverStraightPrice">
            {{ $t('Market.ErrorMessage4') }}
          </div>
        </div>
      </div>

      <div class="asset-form__row">
        <div class="asset-form__row__label">
          <h5>{{ $t('Market.TimeRemaining') }}</h5>
          <span class="asset-form__row__label__sub">
            {{ $t('Market.CheckBidEndedAt') }}
          </span>
        </div>

        <div class="asset-form__price">
          <div class="asset-form__price__timer">
            <strong>{{ remainPeriod.days.setPadding(2) }}</strong
            >d : <strong>{{ remainPeriod.hours.setPadding(2) }}</strong
            >h : <strong>{{ remainPeriod.minutes.setPadding(2) }}</strong
            >m
          </div>

          <div class="asset-form__price__ended">
            {{ $t('Market.EndedAt') }} <span class="divider">|</span>
            {{ $date.formatDate(getItemInfo.auction.endTime, 'fff') }}
          </div>
        </div>
      </div>

      <div class="asset-form__button">
        <div slot="submit" class="asset-item__floating__submit">
          <button
            :class="$bem('common-submit-button', '', [isActiveForm ? 'primary' : 'disabled'])"
            @click="handleMakeBid()"
          >
            {{ $t('Market.BidNow') }}
          </button>
        </div>
      </div>
    </section>

    <aside class="asset-form__aside m-dis-none">
      <asset-item-floating :note="getBidNote" :info="getItemInfo">
        <div slot="submit" class="asset-item__floating__submit">
          <button
            :class="$bem('common-submit-button', '', [isActiveForm ? 'primary' : 'disabled'])"
            @click="handleMakeBid()"
          >
            {{ $t('Market.BidNow') }}
          </button>
        </div>
      </asset-item-floating>
    </aside>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AssetAuctionMixin from '@/mixins/asset/AssetAuctionMixin';
import AssetItemFloating from '@/components/asset/item/AssetItemFloating';
import AssetSellMixin from '@/mixins/asset/AssetSellMixin';

let $t, component;
let eventFunction;

export default {
  name: 'AssetFormBidPage',
  mixins: [AssetAuctionMixin, AssetSellMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);

    eventFunction = function () {
      component.price = component.$_AssetSellMixin_limitMinPrice(component.price);
    };
  },

  mounted() {
    this.initPage();

    window.addEventListener('keyup', eventFunction);
  },

  beforeDestroy() {
    window.removeEventListener('keyup', eventFunction);
  },

  data() {
    return {
      price: '0',
      addComma: window.addComma,
      usedCurrency: this.$store.getters.getItemInfo.currencyInfo,
      priceError0: false,
      priceError1: false,
      priceErrorOverStraightPrice: false,
    };
  },

  computed: {
    ...mapGetters(['getItemInfo', 'getSupportCurrency', 'getMaskedAddress']),

    getBidNote() {
      return [
        {
          text: $t('Market.DoBidWarning1'),
        },
        {
          text: $t('Market.DoBidWarning2'),
        },
        {
          text: $t('Market.WeHaveNoPowerForChangeOffer'),
        },
      ];
    },

    isActiveForm() {
      const priceToPeb = this.$bn.toMinUnit(this.price, this.usedCurrency.decimal);
      let straightPrice = Math.pow(10, 999);
      if (this.getItemInfo.auction) {
        straightPrice = Number(this.getItemInfo.auction.straightPrice);
      }
      const inputPrice = Number(priceToPeb);

      if (this.getItemInfo.auction && !this.getItemInfo.auction.isNormalAuction && inputPrice >= straightPrice) {
        this.priceErrorOverStraightPrice = true;
        return false;
      } else {
        this.priceErrorOverStraightPrice = false;
      }

      // 가격 미입력
      if (this.price.dcomp('0') !== 1) {
        return false;
      }

      if (priceToPeb && this.usedCurrency.deposit && priceToPeb.dcomp(this.usedCurrency.deposit) === 1) {
        this.priceError0 = true;
        return false;
      } else {
        this.priceError0 = false;
      }

      if (priceToPeb < Number(this.getItemInfo.auction.currentPrice) * 1.1) {
        this.priceError1 = true;
        return false;
      } else {
        this.priceError1 = false;
      }

      return true;
    },
  },

  watch: {},

  methods: {
    ...mapActions(['placeBid']),

    initPage() {
      if (_.isEmpty(this.getItemInfo)) {
        return this.$router.replace({
          path: '/home',
        });
      }

      this.$_AssetAuctionTimer_initAuctionTimer(this.getItemInfo);
    },

    // TODO : 입력 에러 대응
    async handleMakeBid() {
      const { usedCurrency, price, getItemInfo } = this;
      const priceToPeb = this.$bn.toMinUnit(price, usedCurrency.decimal);

      if (priceToPeb.dcomp(usedCurrency.deposit) === 1) {
        return alert('내 보유수량보다 적게');
      }

      if (priceToPeb.dcomp(getItemInfo.auction.basePrice) !== 1) {
        return alert('시작가보다 크게');
      }

      if (priceToPeb.dcomp(getItemInfo.auction.currentPrice) !== 1) {
        return alert('현재가보다 크게');
      }

      const res = await this.placeBid({
        tradeId: getItemInfo.tradeId,
        amount: priceToPeb,
        token: getItemInfo.currencyInfo,
        isCheckout: false,
      });

      if (!res.success) {
        return;
      }

      this.$router.push({
        path: '/request/complete',
        query: {
          type: 'bid',
          tokenAddress: getItemInfo.tokenAddress,
          tokenId: getItemInfo.tokenId,
        },
      });
    },

    getBidsLength() {
      let len = 0;
      if (this.getItemInfo.auction && this.getItemInfo.auction.bids) {
        len = this.getItemInfo.auction.bids.length;
      }
      return len;
    },

    isVisibleToken(row) {
      if (this.getChainInfo.chain === 'ETHEREUM') {
        if (row.symbol.toLowerCase() === 'klay') {
          return false;
        }
      }
      return true;
    },
  },

  components: {
    AssetItemFloating,
  },
};
</script>
