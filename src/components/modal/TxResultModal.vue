<template>
  <section class="gen-modal dialog-modal tx-result-modal">
    <div class="gen-modal__close" @click="close()" />

    <div class="dialog-modal__icon">
      <img :src="$static.getFileURL('img/icon/ic-modal-check.svg')" />
    </div>

    <div class="tx-result-modal__title">
      <h5>{{$t('Network.TxRequestSuccess')}}</h5>
    </div>

    <div class="tx-result-modal__detail">
      <div class="tx-result-modal__detail__row" v-if="data.amount">
        <p>
          {{getAmountTitle}}
        </p>

        <p>
          <strong>{{$bn.toMaxUnit(data.amount, data.currency.decimal, 4) | addComma}}</strong>
          <span class="text-gray"> {{data.currency.symbol}}</span>
        </p>
      </div>

      <div class="tx-result-modal__detail__row">
        <p>Tx Hash</p>
        <p>
          <a :href="$wallet.getTxUrl(data.txHash, getChainType)" target="_blank" rel="noopener noreferrer">
            {{getMaskedAddress(data.txHash)}}
          </a>
        </p>
      </div>
    </div>

    <div class="tx-result-modal__detail tx-result-modal__notice">
      <ul>
        <li>
          <img :src="$static.getFileURL('img/icon/ic-check-black.svg')" alt="check" />
          <span>{{$t('Network.TxRequestCheckInActivity')}}</span>
        </li>
      </ul>
    </div>

    <div :class="$bem('gen-modal__submit', ['confirm'], '')">
      <button :class="$bem('common-submit-button', '', ['cancel'])" @click="close()">
        {{$t('General.Close')}}
      </button>

      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleSubmit()">
        {{$t('General.MyActivity')}}
      </button>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  let $t, component

  export default {
    name: 'TxResultModal',
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

    computed: {
      ...mapGetters([
        'getMaskedAddress'
      ]),

      getAmountTitle() {
        const { action } = this.data

        if(action === 'deposit') {
          return $t('UserPage.DepositAmount')
        }

        if(action === 'withdraw') {
          return $t('UserPage.WithdrawAmount')
        }

        if(action === 'staking') {
          return $t('UserPage.StakingAmount')
        }

        if (action === 'unstaking') {
          return $t('UserPage.UnstakingAmount')
        }

        return $t('UserPage.TransactionAmount')
      },

      getChainType() {
        const { action } = this.data

        return action === 'deposit' ? this.getChainInfo.chain : 'KLAYTN'
      }
    },

    watch: {},

    methods: {
      handleSubmit() {
        const { action } = this.data

        if (action === 'staking' || action ==='unstaking') {
          this.$router.push({
            path: '/staking/activity'
          })
        } else {
          this.$router.push({
            path: '/user/history'
          })
        }

      }
    },

    components: {}
  }
</script>
