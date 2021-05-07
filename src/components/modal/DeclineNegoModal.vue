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
        <h4 v-if="!isKlip" v-html="$t('Market.DeclineNegoWhy', { user: getMaskedAddress(data.negoInfo.accountAddress) })" />
        <h4 v-else-if="isKlip" v-html="$t('Market.DeclineNegoKlip', { user: getMaskedAddress(data.negoInfo.accountAddress) })" />
      </div>
    </article>

    <template v-if="!isKlip">
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
    </template>

    <article class="gen-modal__submit">
      <button :class="$bem('common-submit-button', '', [(!enableSubmit && !isKlip) ? 'disabled' :  'primary'])" @click="handleDeclineNegotiation()">
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
      },

      isKlip() {
        return this.$wallet.getWallet().platform.wallet.name === 'klip';
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
        if(!this.enableSubmit && !this.isKlip) {
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
          this.showAlert({
            title: this.$t('Market.DeclineNegoFail')
          })
          return false
        }

        this.showAlert({
          title: this.$t('Market.DeclineNegoSuccess')
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
