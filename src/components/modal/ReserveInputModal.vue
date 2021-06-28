<template>
  <section class="gen-modal reserve-input-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__title">
      <h6>
        <strong>{{ getModalTitle }}</strong>
      </h6>
    </article>

    <article class="gen-modal__content">
      <template v-if="data.action === 'transferNft'">
        <div :class="$bem('reserve-input-modal__form', '', ['token'])">
          <h6 class="text-lightblack">{{ getMyTokenTitle }}</h6>
          <div class="reserve-input-modal__form__input">
            <span>
              <strong>{{ getTokenId }}</strong>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="$bem('reserve-input-modal__form', '', ['balance'])">
          <h6 class="text-lightblack">{{ getMyBalanceTitle }}</h6>
          <div class="reserve-input-modal__form__input">
            <span>
              <strong>{{ getMyBalanceAmount | addComma }}</strong>
            </span>
            <span class="text-gray">{{ getCurrencyInfo.symbol }}</span>
          </div>
        </div>
      </template>

      <div v-if="data.action !== 'transferNft'" :class="$bem('reserve-input-modal__form', '', ['amount'])">
        <h6 class="text-lightblack">{{ getInputTitle }}</h6>
        <div class="reserve-input-modal__form__input">
          <input type="number" v-model="inputAmount" placeholder="0" />
          <div class="reserve-input-modal__form__select">
            <div>{{ $bn.mulBN(String(selectedPercent), '100').toString() }}%</div>
            <img :src="$static.getFileURL('img/icon/ic-chevron-bottom-modal.svg')" />

            <ui-popover ref="percent" class="ui-popover__in-modal reserve-input-modal__form__select__option">
              <ul>
                <li @click="handleSelectedPercent(0)">0%</li>

                <li @click="handleSelectedPercent(0.25)">25%</li>

                <li @click="handleSelectedPercent(0.5)">50%</li>
                <li @click="handleSelectedPercent(1)">100%</li>
              </ul>
            </ui-popover>
          </div>
        </div>
        <div v-if="amountErrorInfo.text" class="reserve-input-modal__form__amount-error">
          <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="question" />
          <span>{{ amountErrorInfo.text }}</span>
        </div>
      </div>

      <div
        v-if="data.action === 'transfer' || data.action === 'transferNft'"
        :class="$bem('reserve-input-modal__form', '', ['address'])"
      >
        <h6 class="text-lightblack">{{ getAddressTitle }}</h6>
        <div class="reserve-input-modal__form__input">
          <input type="text" v-model="inputAddress" placeholder="wallet address" />
          <div v-clipboard:copy="inputAddress" v-clipboard:success="inputAddressCopied">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
              <g fill="none" fill-rule="evenodd">
                <g fill="#D8D8D8">
                  <path
                    d="M9.1 0c1.16 0 2.1.94 2.1 2.1v.699l.7.001c1.16 0 2.1.94 2.1 2.1v7c0 1.16-.94 2.1-2.1 2.1h-7c-1.16 0-2.1-.94-2.1-2.1l-.001-.7H2.1C.94 11.2 0 10.26 0 9.1v-7C0 .94.94 0 2.1 0h7zm2.8 3.85h-7c-.58 0-1.05.47-1.05 1.05v7c0 .58.47 1.05 1.05 1.05h7c.58 0 1.05-.47 1.05-1.05v-7c0-.58-.47-1.05-1.05-1.05z"
                    transform="translate(-1896 -53) translate(1690 30) translate(206 23)"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div v-if="addressErrorInfo.text" class="reserve-input-modal__form__amount-error">
          <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="question" />
          <span>{{ addressErrorInfo.text }}</span>
        </div>
      </div>

      <div class="reserve-input-modal__notice">
        <ul>
          <li>
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" alt="question" />
            <span class="text-lightblack">{{ $t('UserPage.ReserveInputNeedConfirm') }}</span>
          </li>
        </ul>
      </div>

      <div class="reserve-input-modal__agree-terms">
        <div
          v-if="data.action === 'transfer'"
          class="reserve-input-modal__agree-terms__text"
          v-html="$t('UserPage.ReserveInputTransferWarning')"
        />
        <div
          v-else-if="data.action === 'transferNft'"
          class="reserve-input-modal__agree-terms__text"
          v-html="$t('UserPage.ReserveInputTransferNftWarning')"
        />
        <div v-else class="reserve-input-modal__agree-terms__text" v-html="$t('UserPage.ReserveInputWarning')" />
        <template v-if="getChainInfo.chain === 'ETHEREUM'">
          <div
            v-if="data.action === 'deposit'"
            class="reserve-input-modal__agree-terms__text"
            v-html="$t('UserPage.ReserveInputWarningDepositBridge')"
          />
          <div
            v-else-if="data.action === 'withdraw'"
            class="reserve-input-modal__agree-terms__text"
            v-html="$t('UserPage.ReserveInputWarningWithdrawBridge')"
          />
          <div
            v-if="data.action === 'deposit'"
            class="reserve-input-modal__agree-terms__text"
            v-html="$t('UserPage.ReserveInputWarning2Deposit')"
          />
          <div
            v-else-if="data.action === 'withdraw'"
            class="reserve-input-modal__agree-terms__text"
            v-html="$t('UserPage.ReserveInputWarning2Withdraw')"
          />
        </template>
        <div class="reserve-input-modal__agree-terms__check">
          <div @click="agreeTerms = !agreeTerms" :class="agreeTerms ? 'selected' : ''">
            <img :src="$static.getFileURL(`img/icon/ic-check-${agreeTerms ? 'on' : 'off'}.svg`)" alt="check" />
          </div>
          <span @click="agreeTerms = !agreeTerms" v-html="$t('UserPage.ReserveInputAgree')" />
        </div>
      </div>
    </article>

    <div class="reserve-input-modal__notice">
      <ul>
        <li v-if="errorInfo.text" class="reserve-input-modal__error">
          <img :src="$static.getFileURL('img/icon/ic-info-primary.svg')" alt="question" />
          <span>{{ errorInfo.text }}</span>
        </li>
      </ul>
    </div>

    <article class="gen-modal__submit">
      <button
        :class="$bem('common-submit-button', '', isAmountAvail && agreeTerms ? ['primary'] : ['disabled'])"
        @click="handleSubmit()"
      >
        {{ $t('General.Confirm') }}
      </button>
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

let $t, component;

export default {
  name: 'ReserveInputModal',
  props: {
    data: Object,
    close: Function,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      errorInfo: {
        text: '',
      },
      amountErrorInfo: {
        text: '',
      },
      addressErrorInfo: {
        text: '',
      },
      agreeTerms: false,
      isAmountAvail: true,
      inputAmount: '0',
      inputAmountComplete: null,
      inputAddress: '',
      selectedPercent: 0,
    };
  },

  computed: {
    ...mapGetters(['getSupportCurrency', 'getStakingAmount', 'getChainInfo']),
    getMyBalanceTitle() {
      const { getCurrencyInfo } = this;
      return $t('UserPage.MyTokenBalance', {
        token: getCurrencyInfo.symbol,
      });
    },

    getMyBalanceAmount() {
      const { action } = this.data;

      let appearDecimal;
      if (action === 'deposit' || action === 'withdraw' || action === 'transfer') {
        appearDecimal = 8;
      } else {
        appearDecimal = 4;
      }

      if (this.getSelectedBalance) {
        return this.getSelectedBalance.dprec(appearDecimal);
      }
      return this.getSelectedBalance;
    },

    getMyTokenTitle() {
      return $t('UserPage.TitleTransferNftToken');
    },

    getModalTitle() {
      const { action } = this.data;
      const { getCurrencyInfo } = this;

      if (action === 'deposit') {
        return $t('UserPage.DepositTokenTitle', {
          token: getCurrencyInfo.symbol,
        });
      }

      if (action === 'withdraw') {
        return $t('UserPage.WithdrawTokenTitle', {
          token: getCurrencyInfo.symbol,
        });
      }

      if (action === 'staking') {
        return $t('Staking.TitleStake', {
          token: getCurrencyInfo.symbol,
        });
      }

      if (action === 'unstaking') {
        return $t('Staking.TitleUnstake', {
          token: getCurrencyInfo.symbol,
        });
      }

      if (action === 'transfer') {
        return $t('UserPage.TitleTransfer', {
          token: getCurrencyInfo.symbol,
        });
      }

      if (action === 'transferNft') {
        return $t('UserPage.TitleTransferNft');
      }

      return '';
    },

    getCurrencyInfo() {
      const { action } = this.data;

      if (action === 'staking' || action === 'unstaking') {
        return _.find(this.getSupportCurrency, (currency) => {
          return this.$wallet.isSameAddress(this.data.currency, currency.tokenAddress);
        });
      } else if (action === 'transfer') {
        return _.find(this.getSupportCurrency, (currency) => {
          return this.$wallet.isSameAddress(this.data.currency, currency.tokenAddress);
        });
      } else {
        return (
          _.find(this.getSupportCurrency, (currency) => {
            return this.$wallet.isSameAddress(this.data.currency, currency.currentAddress);
          }) || {}
        );
      }
    },

    getInputTitle() {
      const { action } = this.data;

      if (action === 'deposit') {
        return $t('UserPage.DepositAmount');
      }

      if (action === 'withdraw') {
        return $t('UserPage.WithdrawAmount');
      }

      if (action === 'staking') {
        return $t('Staking.AmountStakes')[0];
      }

      if (action === 'unstaking') {
        return $t('Staking.AmountStakes')[1];
      }

      if (action === 'transfer') {
        return $t('UserPage.TransferAmount');
      }

      return '';
    },

    getAddressTitle() {
      const { action } = this.data;

      if (action === 'transfer') {
        return $t('UserPage.TransferAddress');
      }

      if (action === 'transferNft') {
        return $t('UserPage.TransferAddress');
      }
    },

    getSelectedBalance() {
      const { action } = this.data;
      const { getCurrencyInfo } = this;

      if (action === 'deposit') {
        return getCurrencyInfo.decBalance;
      }

      if (action === 'withdraw') {
        return getCurrencyInfo.decDeposit;
      }

      if (action === 'staking') {
        return getCurrencyInfo.decDeposit;
      }

      if (action === 'unstaking') {
        return String(this.getStakingAmount / 10 ** 18);
      }

      if (action === 'transfer') {
        return getCurrencyInfo.decDeposit;
      }

      return '0';
    },

    getSelectedOriginalBalance() {
      const { action } = this.data;
      const { getCurrencyInfo } = this;

      if (action === 'deposit') {
        return getCurrencyInfo.balance;
      }

      if (action === 'withdraw') {
        return getCurrencyInfo.deposit;
      }

      if (action === 'staking') {
        return getCurrencyInfo.deposit;
      }

      if (action === 'unstaking') {
        return String(this.getStakingAmount);
      }

      if (action === 'transfer') {
        return getCurrencyInfo.deposit;
      }
    },

    getTokenId() {
      let tokenId;
      if (
        this.data.token &&
        this.data.token.metadata &&
        this.data.token.metadata.tokenId &&
        this.data.token.metadata.tokenId !== ''
      ) {
        tokenId = this.data.token.metadata.tokenId;
      } else if (this.data.token && this.data.token.tokenId && this.data.token.tokenId !== '') {
        tokenId = this.data.token.tokenId;
      }
      return tokenId;
    },
  },

  watch: {
    selectedPercent(newVal) {
      this.$refs.percent.close();
      this.inputAmount = this.$bn.mulBN(this.getSelectedBalance, String(newVal)).toString();
    },

    inputAmount(newVal) {
      const inputAmountNum = Number(newVal);
      const amountNum = Number(this.getSelectedBalance);

      if (inputAmountNum <= amountNum) {
        this.isAmountAvail = true;
        this.amountErrorInfo.text = '';
      } else {
        this.isAmountAvail = false;
        this.amountErrorInfo.text = $t('Staking.AmountErrorInfo');
      }

      // 소숫점 4자리 밑으로 출력 x
      let appearDecimal;

      const { action } = this.data;
      if (action === 'deposit' || action === 'withdraw' || action === 'transfer') {
        appearDecimal = 8;
      } else {
        appearDecimal = 4;
      }

      let dotIdx = null;
      let flag = false;
      let cnt = 0;
      for (let i = 0; i < newVal.length; i++) {
        const c = this.inputAmount[i];
        if (flag) cnt += 1;
        if (c === '.') {
          flag = true;
          dotIdx = i;
        }
      }
      if (cnt > appearDecimal && dotIdx) {
        this.inputAmount = newVal.substring(0, dotIdx + appearDecimal + 1);
      }
    },
  },

  methods: {
    handleSubmit() {
      if (!this.isAmountAvail || !this.agreeTerms) {
        return;
      }
      const { inputAmount, inputAddress, agreeTerms, getSelectedBalance, isAmountAvail } = this;
      const { action } = this.data;

      if (!agreeTerms) {
        this.errorInfo.text = $t('UserPage.WalletWarning');
        return;
      }

      if (!isAmountAvail) {
        return;
      }

      if (inputAmount.dcomp(getSelectedBalance) === 1) {
        this.errorInfo.text = $t('UserPage.ReserveInputAmountErr');
      }

      // TODO : 큰 금액의 경우 overflow가 발생할 수 있으므로 string 형식으로 변환해야 함.
      this.errorInfo.text = '';
      let sendInputAmount = Number(inputAmount);
      if (this.getChainInfo.chain === 'ETHEREUM') {
        sendInputAmount *= 0.999;
      }

      if (this.data.action === 'transfer' || this.data.action === 'transferNft') {
        if (!inputAddress || (inputAddress && inputAddress.length !== 42)) {
          this.addressErrorInfo.text = $t('UserPage.ReserveInputAddressErr');
          return;
        }
      }

      // TODO : 로딩 끝나고 실제로 성공하면 닫기
      this.close();
      if (action === 'transfer') {
        // 전송하기는 파라미터가 2개이므로 분기 처리.
        this.data.onSubmit(String(sendInputAmount), inputAddress);
      } else if (action === 'transferNft') {
        // transferNft 는 toAddress가 파라미터
        this.data.onSubmit(inputAddress);
      } else {
        if (this.getChainInfo.chain === 'ETHEREUM') {
          this.data.onSubmit(String(sendInputAmount));
        } else {
          this.data.onSubmit(this.inputAmount);
        }
      }
    },

    handleSelectedPercent(percent) {
      this.$refs.percent.close();
      this.selectedPercent = percent;
      this.inputAmount = this.$bn.mulBN(this.getSelectedBalance, String(percent)).toString();
    },

    inputAddressCopied() {},
  },

  components: {},
};
</script>
