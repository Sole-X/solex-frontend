<template>
  <div class="asset-form-page">
    <section class="asset-form__body">
      <div class="asset-page__category">
        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Item')[0]}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', ['current'])">
          <span>{{$t('Market.Negotiation')}}</span>
          <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" />
        </div>

        <div :class="$bem('asset-page__category__tab', '', '')">
          <span>{{$t('General.Complete')}}</span>
        </div>
      </div>

      <div class="asset-form__title">
        <h1>
          <strong>{{$t('Market.DoNego')}}</strong>
        </h1>

        <p>{{getItemInfo.collectionName}} {{getItemInfo.itemName}}</p>
      </div>

      <div class="asset-form__row">
        <div class="asset-form__row__label">
          <h5>{{$t('General.Currency')}}</h5>
          <span class="asset-form__row__label__sub">
            {{$t('Market.SelectCurrencyToNego')}}
          </span>
        </div>

        <div class="asset-form__currency">
          <button
            v-for="currency in getSupportCurrency"
            v-if="isVisibleToken(currency)"
            :key="currency.symbol"
            :class="$bem('asset-form__currency__option', '', isVisibleToken(currency) ? usedCurrency.symbol === currency.symbol ? ['selected'] : [] : ['disabled'])"
            @click="isVisibleToken(currency) ? handleSelectCurrency(currency) : ''"
          >
            <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)">
            <strong>{{currency.symbol}}</strong>
          </button>
        </div>
      </div>

      <div class="asset-form__row">
        <div class="asset-form__row__label">
          <h5>{{$t('Market.AskingPrice')}}</h5>
          <button class="asset-item__request__more" @click="$_AssetSellMixin_openNegoStatusModal(getItemInfo)">
            <img :src="$static.getFileURL(`img/icon/ic-message-${getItemInfo.exchange.negos.length > 0 ? 'black' : 'gray'}.svg`)" />
            <span v-html="$t('Market.NegoCount', { total: getItemInfo.exchange.negos.length })" />
          </button>
        </div>

        <div class="asset-form__price">
          <div class="asset-form__price__input">
            <input type="number" step="any" placeholder="Please enter the amount to negotiation" v-model="price" />
            <button>
              <img :src="$static.getFileURL(`img/icon/ic-token-${usedCurrency.symbol.toLowerCase()}.svg`)">
              {{usedCurrency.symbol}}
            </button>
          </div>

          <div class="asset-form__price__balance">
            <span>{{$t('Market.UserBalanceLabel', { token: usedCurrency.symbol })}} : </span>
            <span><strong>{{usedCurrency.decDeposit.dprec(4) | addComma}}</strong> {{usedCurrency.symbol}} </span>
          </div>

          <div class="asset-form__price-error" v-if="priceError0">
            {{ $t('Market.ErrorMessage2', { token: usedCurrency.symbol }) }}
          </div>
        </div>
      </div>
    </section>

    <aside class="asset-form__aside">
      <asset-item-floating :note="getNegotiationNote" :info="getItemInfo">
        <div slot="submit" class="asset-item__floating__submit">
          <button :class="$bem('common-submit-button', '', [isActiveForm ? 'primary' : 'disabled'])" @click="handleMakeNegotiation()">
            {{$t('Market.NegoNow')}}
          </button>
        </div>
      </asset-item-floating>
    </aside>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import AssetSellMixin from '@/mixins/asset/AssetSellMixin'
  import AssetItemFloating from '@/components/asset/item/AssetItemFloating'

  let $t, component
  let eventFunction

  export default {
    name: 'AssetFormNegoPage',
    mixins: [AssetSellMixin],
    created() {
      component = this
      $t = this.$t.bind(this)

      eventFunction = function () {
        component.price = component.$_AssetSellMixin_limitMinPrice(component.price);
      }
    },

    mounted() {
      if(_.isEmpty(this.getItemInfo)) {
        return this.$router.replace({
          path: '/home'
        })
      }
      window.addEventListener('keyup', eventFunction);
    },

    beforeDestroy() {
      window.removeEventListener('keyup', eventFunction);
    },

    data() {
      return {
        price: '0',
        enableNego: true,
        usedCurrency: this.$store.getters.getItemInfo.currencyInfo,
        priceError: false,
        priceError0: false
      }
    },

    computed: {
      ...mapGetters([
        'getItemInfo',
        'getSupportCurrency',
        'getMaskedAddress'
      ]),

      getNegotiationNote() {
        return [
          {
            text: $t('Market.DoNegoWarning1')
          },
          {
            text:$t('Market.DoNegoWarning2')
          },
          {
            text: $t('Market.WeHaveNoPowerForChangeOffer')
          }
        ]
      },

      isActiveForm() {
        const priceToPeb = this.$bn.toMinUnit(this.price, this.usedCurrency.decimal)
        // 가격 미입력
        if(this.price.dcomp('0') !== 1) {
          return false
        }

        if(priceToPeb && this.usedCurrency.deposit && priceToPeb.dcomp(this.usedCurrency.deposit) === 1) {
          this.priceError0 = true;
          return false
        } else {
          this.priceError0 = false;
        }

        return true
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'addNego'
      ]),

      handleSelectCurrency(currency) {
        this.usedCurrency = currency
      },

      // TODO : 입력 에러 대응
      async handleMakeNegotiation() {
        const { usedCurrency, price, getItemInfo } = this
        const priceToPeb = this.$bn.toMinUnit(price, usedCurrency.decimal)

        if(priceToPeb.dcomp(usedCurrency.deposit) === 1) {
          return alert('예치 수량보단 적게')
        }

        return await this.addNego({
          tokenAddress: getItemInfo.tokenAddress,
          tokenId: getItemInfo.tokenId,
          tradeId: getItemInfo.tradeId,
          currency: usedCurrency.addressToReserve,
          newPrice: priceToPeb
        })
      },

      isVisibleToken(row) {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          if (row.symbol.toLowerCase() === 'klay') {
            return false;
          }
        }
        return true;
      }
    },

    components: {
      AssetItemFloating
    }
  }
</script>
