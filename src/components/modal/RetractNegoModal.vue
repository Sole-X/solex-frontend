<template>
  <section class="gen-modal retract-nego-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>{{$t('Market.DoRejectNegoTitle')}}</strong>
      </h6>
    </article>

    <article
        class="retract-nego-modal__thumbnail"
        :style="{'background-image': `url(${data.info.metadata.image})`, 'background-size': 'contain', 'background-position': 'center'}"
    >
    </article>

    <article class="gen-modal__content retract-nego-modal__detail">
      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('General.Item')[0]}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong>{{data.info.itemName}}</strong>
        </div>
      </div>

      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('Market.Collection')}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong>{{data.info.tokenAddress.slice(0, 8)}}</strong>
        </div>
      </div>

      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('General.TokenId')}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong># {{data.info.tokenId}}</strong>
        </div>
      </div>

      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('General.Blockchain')}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong>{{data.info.chainName}}</strong>
        </div>
      </div>

      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('Market.YourOfferPrice')}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong>{{$bn.toMaxUnit(data.nego.negoPrice, data.info.currencyInfo.decimal, 4) | addComma}} {{data.info.currencyInfo.symbol}}</strong>
        </div>
      </div>

      <div class="retract-nego-modal__detail__row">
        <div class="retract-nego-modal__detail__label">
          {{$t('Market.OfferAt')}}
        </div>

        <div class="retract-nego-modal__detail__value">
          <strong>{{$date.formatDate(data.info.createdAt, 'fff')}}</strong>
        </div>
      </div>
    </article>

    <article class="gen-modal__content retract-nego-modal__question">
      <h6>{{$t('Market.DoRejectNegoConfirmTitle')}}</h6>
      <p v-html="$t('Market.DoRejectNegoConfirmDescription')"></p>
    </article>

    <article class="gen-modal__submit">
      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleSubmitRetract()">
        {{$t('Market.DoRejectNegoTitle')}}
      </button>
    </article>
  </section>
</template>

<script>
  import { mapActions } from 'vuex'

  let $t, component

  export default {
    name: 'RetractNegoModal',
    props: {
      data: Object,
      close: Function
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {}
    },

    computed: {},

    watch: {},

    methods: {
      ...mapActions([
        'cancelNegotiation'
      ]),

      async handleSubmitRetract() {
        const { info } = this.data
        const res = await this.cancelNegotiation({
          tradeId: info.exchange.id,
          userAddress: this.getUserInfo.address,
          order: {
            symbol: info.currencyInfo.symbol,
            price: this.$bn.toMaxUnit(this.data.nego.negoPrice, info.currencyInfo.decimal, 4)
          }
        })

        if(!res.success) {
          return false
        }

        return this.close()
      }
    },

    components: {}
  }
</script>
