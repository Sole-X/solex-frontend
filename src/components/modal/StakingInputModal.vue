<template>
  <section class="gen-modal reserve-input-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>{{getModalTitle}}</strong>
      </h6>
    </article>

    <article class="gen-modal__content">
      <div :class="$bem('reserve-input-modal__form', '', ['balance'])">
        <h6 class="text-lightblack">내 {{getCurrencyInfo.symbol}} 잔액</h6>
        <div class="reserve-input-modal__form__input">
        <span>
          <strong>{{getSelectedBalance.dprec(4) | addComma}}</strong>
        </span>
          <span class="text-gray">{{getCurrencyInfo.symbol}}</span>
        </div>
      </div>

      <div :class="$bem('reserve-input-modal__form', '', ['amount'])">
        <h6 class="text-lightblack">{{getInputTitle}}</h6>
        <div class="reserve-input-modal__form__input">
          <input type="number" v-model="inputAmount" placeholder="0" />
          <div class="reserve-input-modal__form__select">
            {{$bn.mulBN(String(selectedPercent), '100').toString()}}%

            <ui-popover ref="percent" class="ui-popover__in-modal reserve-input-modal__form__select__option">
              <ul>
                <li @click="handleSelectedPercent(0)">
                  0%
                </li>

                <li @click="handleSelectedPercent(0.25)">
                  25%
                </li>

                <li @click="handleSelectedPercent(0.5)">
                  50%
                </li>
                <li @click="handleSelectedPercent(1)">
                  100%
                </li>
              </ul>
            </ui-popover>
          </div>
        </div>
      </div>

      <div class="reserve-input-modal__notice">
        <ul>
          <li>
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" alt="question" />
            <span class="text-lightblack">사용자의 지갑에서 거래를 승인해주세요.</span>
          </li>

          <li v-if="errorInfo.text" class="reserve-input-modal__error">
            <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="question" />
            <span>{{errorInfo.text}}</span>
          </li>
        </ul>
      </div>

      <div class="reserve-input-modal__agree-terms">
        <div class="reserve-input-modal__agree-terms__text">
          사용 중인 지갑의 비밀번호, 시드 문구, 프라이빗 키를 분실한 경우<br> 복구가 <strong class="text-primary">절대 불가능</strong>합니다.
        </div>

        <div class="reserve-input-modal__agree-terms__check">
          <div @click="agreeTerms = !agreeTerms" :class="agreeTerms ? 'selected' : ''">
            <img :src="$static.getFileURL(`img/icon/ic-check-${agreeTerms ? 'on' : 'off'}.svg`)" alt="check" />
          </div>
          <span @click="agreeTerms = !agreeTerms">위의 내용에 동의합니다.</span>
        </div>
      </div>
    </article>

    <article class="gen-modal__submit">
      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleSubmit()">
        확인
      </button>
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

let $t, component

export default {
  name: 'StakingInputModal',
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
      errorInfo: {
        text: ''
      },
      agreeTerms: false,
      inputAmount: '0',
      selectedPercent: 0
    }
  },

  computed: {
    ...mapGetters([
      'getSupportCurrency'
    ]),

    getModalTitle() {
      const { action } = this.data
      const { getCurrencyInfo } = this

      if(action === 'staking') {
        return `${getCurrencyInfo.symbol} 스테이킹하기`
      }

      if(action === 'unstaking') {
        return `${getCurrencyInfo.symbol} 언스테이킹하기`
      }

      return ''
    },

    getCurrencyInfo() {
      return _.find(this.getSupportCurrency, currency => {
        return this.$wallet.isSameAddress(this.data.currency, currency.currentAddress)
      }) || {}
    },

    getInputTitle() {
      const { action } = this.data

      if (action === 'staking') {
        return '스테이킹 수량'
      }

      if (action === 'unstaking') {
        return '언스테이킹 수량'
      }

      return ''
    },

    getSelectedBalance() {
      const { action } = this.data
      const { getCurrencyInfo } = this

      if(action === 'deposit') {
        return getCurrencyInfo.decBalance
      }

      if(action === 'withdraw') {
        return getCurrencyInfo.decDeposit
      }

      if (action === 'staking') {
        // decBalance와 decDeposit 차이 알기.
      }

      if (action === 'unstaking') {

      }

      return '0'
    }
  },

  watch: {
    selectedPercent(newVal) {
      this.$refs.percent.close()
      this.inputAmount = this.$bn.mulBN(this.getSelectedBalance, String(newVal)).toString().dprec(4)
    }
  },

  methods: {
    handleSubmit() {
      const { inputAmount, agreeTerms, getSelectedBalance } = this

      if(!agreeTerms) {
        this.errorInfo.text = '지갑 분실 관련 안내 항목을 읽고 동의해주세요.'
        return
      }

      if(inputAmount.dcomp(getSelectedBalance) === 1) {
        this.errorInfo.text = '금액을 낮춰 다시 시도해주세요.'
        return
      }

      this.errorInfo.text = ''
      let sendInputAmount = inputAmount;
      // TODO : 로딩 끝나고 실제로 성공하면 닫기
      this.close()
      this.data.onSubmit(String(Number(inputAmount * 1.001)));
    },

    handleSelectedPercent(percent) {
      this.$refs.percent.close()
      this.selectedPercent = percent
      this.inputAmount = this.$bn.mulBN(this.getSelectedBalance, String(percent)).toString().dprec(4)
    }
  },

  components: {}
}
</script>