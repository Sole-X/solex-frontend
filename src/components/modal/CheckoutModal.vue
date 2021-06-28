<template>
  <section class="gen-modal checkout-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>{{ this.data.info.isBuy ? $t('Market.SellItNow') : $t('Market.BuyItNow') }}</strong>
        <span class="gen-modal__title__sub">({{ step }}/{{ step + 1 }})</span>
      </h6>
    </article>

    <div class="checkout-modal__checkout" v-if="step === 1">
      <article class="gen-modal__content gen-modal__sub-title">
        <div>
          <h4>{{ this.data.info.isBuy ? $t('Market.ContinueCheckoutSell') : $t('Market.ContinueCheckout') }}</h4>
          <div class="gen-modal__desc">
            {{
              this.data.info.isBuy
                ? $t('Market.ContinueCheckoutSellDescription')
                : $t('Market.ContinueCheckoutDescription')
            }}
          </div>
        </div>
      </article>

      <article class="gen-modal__content">
        <div class="checkout-modal__order">
          <div class="checkout-modal__order__head">
            <div class="checkout-modal__order__head__thumbnail" :style="$_AssetCardMixin_getImage(data.info)"></div>

            <div class="checkout-modal__order__head__name">
              <p>{{ data.info.collectionName }}</p>
              <p>{{ data.info.itemName }}</p>
            </div>
          </div>

          <div class="checkout-modal__order__info">
            <div class="checkout-modal__order__info__row">
              <div class="checkout-modal__order__info__label">
                {{ $t('Market.ItemOwner') }}
              </div>

              <div class="checkout-modal__order__info__value">
                <p class="checkout-modal__order__info__value__address">
                  {{ data.info.ownerAddress }}
                </p>
              </div>
            </div>

            <div class="checkout-modal__order__info__row">
              <div class="checkout-modal__order__info__label">
                {{ $t('Market.Price') }}
              </div>

              <div class="checkout-modal__order__info__value">
                <p>
                  <strong
                    >{{ $bn.toMaxUnit(data.checkoutPrice, data.info.currencyInfo.decimal, 4) | addComma }}
                  </strong>
                  {{ data.info.currencyInfo.symbol }}
                </p>
                <p class="checkout-modal__order__info__value__fiat">
                  $
                  {{
                    data.info.currencyInfo
                      .toFiat($bn.toMaxUnit(data.checkoutPrice, data.info.currencyInfo.decimal))
                      .dprec(4) | addComma
                  }}
                </p>
              </div>
            </div>

            <div class="checkout-modal__order__info__row">
              <div class="checkout-modal__order__info__label">
                {{ $t('Market.ServiceFee') }}
              </div>

              <div class="checkout-modal__order__info__value">
                <template v-if="getItemType === 'buy'">
                  <p>
                    <strong>{{ $bn.toMaxUnit(estimateFee, data.info.currencyInfo.decimal, 4) | addComma }} </strong>
                    {{ data.info.currencyInfo.symbol }}
                  </p>
                  <p class="checkout-modal__order__info__value__fiat">
                    $
                    {{
                      data.info.currencyInfo.toFiat($bn.toMaxUnit(estimateFee, data.info.currencyInfo.decimal)).dprec(4)
                        | addComma
                    }}
                  </p>
                </template>
                <template v-else>
                  <p>
                    <strong>{{ '0.0000' }}</strong> {{ data.info.currencyInfo.symbol }}
                  </p>
                  <p class="checkout-modal__order__info__value__fiat">$ 0.0000</p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div :class="$bem('checkout-modal__order__info', ['total'], '')">
          <div class="checkout-modal__order__info__row">
            <div class="checkout-modal__order__info__label">
              {{ $t('Market.TotalAmountOfOffer') }}
            </div>

            <div class="checkout-modal__order__info__value">
              <template v-if="getItemType === 'buy'">
                <strong>{{
                  $bn.toMaxUnit(Number(data.checkoutPrice) - Number(estimateFee), data.info.currencyInfo.decimal, 4)
                }}</strong>
                {{ data.info.currencyInfo.symbol }}
              </template>
              <template v-else>
                <strong>{{ $bn.toMaxUnit(Number(data.checkoutPrice), data.info.currencyInfo.decimal, 4) }}</strong>
                {{ data.info.currencyInfo.symbol }}
              </template>
            </div>
          </div>
        </div>

        <div class="checkout-modal__order__notice">
          <span v-html="getCheckoutDescription" />
        </div>
      </article>

      <article class="gen-modal__submit" @click="handleSubmit()">
        <button :class="$bem('common-submit-button', '', getButtonClass)">
          {{ this.data.info.isBuy ? $t('Market.DoCheckoutSell') : $t('Market.DoCheckout') }}
        </button>
      </article>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import AssetCardMixin from '@/mixins/asset/AssetCardMixin';

let $t, component;

export default {
  name: 'CheckoutModal',
  props: {
    data: Object,
    close: Function,
  },
  mixins: [AssetCardMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      step: 1,
    };
  },

  computed: {
    ...mapGetters(['getTradingFee', 'getUserItems']),

    getItemType() {
      let type = '';
      if (this.data.info.isBuy) type = 'buy';
      else if (this.data.info.isSell) type = 'sell';
      else if (this.data.info.isAuction) type = 'auction';
      return type;
    },

    getButtonClass() {
      return [this.isEnableCheckout ? 'primary' : 'disabled'];
    },

    estimateFee() {
      return this.$bn.mulBN(this.data.checkoutPrice, this.$bn.divBN(this.getTradingFee, '100'));
    },

    isEnableCheckout() {
      if (this.data.info && this.data.info.isBuy) {
        const { onTrade } = this.getUserItems;

        const onTradeObj = _.find(onTrade, (row) => {
          if (this.$wallet.isSameAddress(row.tokenAddress, this.data.info.tokenAddress)) return true;
        });

        if (onTradeObj) return false;
        return true;
      } else if ((this.data.info && this.data.info.isSell) || this.data.info.isAuction) {
        const { userDeposited, checkoutPrice } = this.data;

        return checkoutPrice.dcomp(userDeposited) !== 1;
      }
    },

    getCheckoutDescription() {
      const { info } = this.data;

      if (info && info.isBuy) {
        if (!this.isEnableCheckout) {
          return '해당 아이템이 판매/경매 중 입니다.';
        }
      } else {
        if (!this.isEnableCheckout) {
          return $t('Market.NotEnoughToken', {
            symbol: info.currencyInfo.symbol,
          });
        }
      }

      return info.isBuy ? $t('Market.SubmitCheckoutSellDescription') : $t('Market.SubmitCheckoutDescription');
    },
  },

  watch: {},

  methods: {
    handleSubmit() {
      // 즉시구매 가격 + 수수료보다 예치 수량이 더 많아야 거래 가능
      if (!this.isEnableCheckout) {
        return;
      }

      let finalAmount;

      if (this.getItemType === 'buy') {
        finalAmount = Number(this.data.checkoutPrice) - Number(this.estimateFee);
      } else {
        finalAmount = Number(this.data.checkoutPrice) + Number(this.estimateFee);
      }

      this.data.submit && this.data.submit(finalAmount);
      this.close();
    },
  },

  components: {},
};
</script>
