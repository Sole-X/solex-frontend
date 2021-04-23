<template>
  <section class="gen-modal decline-nego-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>{{$t('Market.DeclineNego')}}</strong>
      </h6>
    </article>

    <article class="gen-modal__content gen-modal__sub-title">
      <div>
        <h4 v-html="$t('Market.DeclineNegoWhy', { user: getMaskedAddress(data.negoInfo.accountAddress) })" />
      </div>
    </article>

    <article class="gen-modal__content decline-nego-modal__option">
      <ul>
        <li v-for="option in getDeclineOptions()" :key="option.type" :class="$bem('decline-nego-modal__radio', '', option.isSelected ? ['selected'] : '')" @click="handleSelectOption(option)">
          <div class="decline-nego-modal__radio__box"></div>
          <div class="decline-nego-modal__radio__label">{{option.text()}}</div>
        </li>
      </ul>
    </article>

    <article class="gen-modal__content decline-nego-modal__message">
      <label for="decline-message">
        {{$t('Market.DeclineNegoFormTitle')}} <span>({{$t('General.Optional')}})</span>
      </label>

      <textarea
        id="decline-message"
        class="decline-nego__message-box"
        v-model="message"
        :placeholder="$t('Market.DeclineNegoFormPlaceholder')"
      />

      <p class="decline-nego-modal__message__sub">
        {{$t('Market.LeftCharLength', { length: getRemainLength })}}
      </p>
    </article>

    <article class="gen-modal__submit">
      <button :class="$bem('common-submit-button', '', [!enableSubmit ? 'disabled' :  'primary'])" @click="handleDeclineNegotiation()">
        {{$t('General.Confirm')}}
      </button>
    </article>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  let $t, component

  export default {
    name: 'DeclineNegoModal',
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
      return {
        message: '',
        selectedOptions: {}
      }
    },

    computed: {
      ...mapGetters([
        'getMaskedAddress',
          'getSupportCurrency'
      ]),

      getRemainLength() {
        return Math.max(0, 300 - this.message.length)
      },

      enableSubmit() {
        return !_.isEmpty(this.selectedOptions.type) && this.message.length <= 300
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'rejectNegotiation'
      ]),

      handleSelectOption(option) {
        this.selectedOptions = option
      },

      async handleDeclineNegotiation() {
        if(!this.enableSubmit) {
          return
        }

        const { message } = this
        const { item, negoInfo } = this.data

        const res = await this.rejectNegotiation({
          tradeId: item.exchange.id,
          negoId: negoInfo.id,
          negoMaker: negoInfo.accountAddress,
          reason: {
            type: this.selectedOptions.id,
            message
          }
        })

        if(!res.success) {
          return false
        }

        /*
        this.showModal({
          component: 'DeclineNegoSuccessModal',
          params: {

          }
        })
         */

        this.showAlert({
          title: '협상 거절이 완료되었습니다.',
        })
        return this.close()
      },

      getDeclineOptions() {
        const { id } = this.selectedOptions

        const tokenAddress = this.data.negoInfo.currency;
        const supportCurrencies = this.getSupportCurrency;

        const currency = _.find(supportCurrencies, {tokenAddress: tokenAddress});
        let currencyName = currency ? currency.symbol : '';

        const RejectNegoTypes = [
          {
            id: 1,
            type: 'price',
            text: () => {
              return this.$t('Market.DeclineNegoReason1');
            }
          },
          {
            id: 2,
            type: 'interest',
            text: () => {
              return this.$t('Market.DeclineNegoReason2', {
                token: currencyName
              })
            }
          },
          {
            id: 3,
            type: 'other',
            text: () => {
              return $t('Market.DeclineNegoReason3')
            }
          }
        ];

        return _.map(RejectNegoTypes, row => {
          return {
            ...row,
            isSelected: id === row.id
          }
        })
      },
    },

    components: {}
  }
</script>
