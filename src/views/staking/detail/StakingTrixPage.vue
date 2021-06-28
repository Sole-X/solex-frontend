<template>
  <div class="staking-trix-page">
    <section class="staking-trix-amount">
      <div class="staking-trix-amount-container">
        <div class="staking-trix-amount-item">
          <div class="staking-trix-amount-item__title">
            <div v-if="$t('General.Language') === 'KOR'">
              <span
                class="staking-account"
                @click="
                  () => {
                    this.$router.push('/user/asset?tab=2');
                  }
                "
                >Sole-X 계정</span
              >
              내 TRIX 수량
            </div>
            <div v-else>
              Available TRIX in your
              <span
                class="staking-account"
                @click="
                  () => {
                    this.$router.push('/user/asset?tab=2');
                  }
                "
                >Sole-X Account</span
              >
            </div>
            <div
              v-if="$t('General.Language') === 'KOR'"
              class="staking-trix-amount-item__title-tooltip"
              data-tooltip-text="사용자 Sole-X 계정의 현재 TRIX 토큰 수량을 의미합니다."
            >
              <img :src="$static.getFileURL('img/icon/ic-staking-question.svg')" />
            </div>
            <div
              v-else
              class="staking-trix-amount-item__title-tooltip"
              data-tooltip-text="The current amount of TRIX deposited in your Sole-X account."
            >
              <img :src="$static.getFileURL('img/icon/ic-staking-question.svg')" />
            </div>
          </div>
          <div class="staking-trix-amount-item__balance-container">
            <div class="staking-trix-amount-item__balance-info">
              <div class="top">
                <span>{{ getSolexAmountLocal | addComma }}</span>
                <span>TRIX</span>
              </div>
              <div class="bottom">
                <span>≈</span>
                <span>{{ getSolexAmountUSD | addComma }}</span>
                <span>USD</span>
              </div>
            </div>
            <div class="staking-trix-amount-item__balance-image">
              <img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt="trix" />
              <img
                class="staking-trix-amount-item__balance-image-sub"
                :src="$static.getFileURL('img/icon/ic-staking-account.svg')"
              />
            </div>
          </div>
          <div>
            <button
              v-if="Number(getSolexAmountLocal) > 0"
              :class="$bem('common-submit-button', '', ['primary'])"
              @click="handleStakingCurrency(getCurrency(getTokenAddress))"
            >
              {{ translated('StakeTrix') }}
            </button>
            <button v-else :class="$bem('common-submit-button', '', ['disabled'])" disabled>
              {{ translated('StakeTrix') }}
            </button>
          </div>
        </div>
        <div class="staking-trix-amount-item">
          <div class="staking-trix-amount-item__title">
            <div v-if="$t('General.Language') === 'KOR'">Sole-X에 스테이킹한 TRIX 수량</div>
            <div v-else>Staked TRIX in Sole-X</div>
            <div
              v-if="$t('General.Language') === 'KOR'"
              class="staking-trix-amount-item__title-tooltip"
              data-tooltip-text="사용자가 Sole-X에 스테이킹한 TRIX 토큰의 현재 수량을 의미합니다."
            >
              <img :src="$static.getFileURL('img/icon/ic-staking-question.svg')" />
            </div>
            <div
              v-else
              class="staking-trix-amount-item__title-tooltip"
              data-tooltip-text="The current amount you have staked in Sole-X"
            >
              <img :src="$static.getFileURL('img/icon/ic-staking-question.svg')" />
            </div>
          </div>
          <div class="staking-trix-amount-item__balance-container">
            <template v-if="getIsSetAmount">
              <div class="staking-trix-amount-item__balance-info">
                <div class="top">
                  <span>{{ getStakingAmountLocal | addComma }}</span>
                  <span>TRIX</span>
                </div>
                <div class="bottom">
                  <span>≈</span>
                  <span>{{ getStakingAmountUSD | addComma }}</span>
                  <span>USD</span>
                </div>
              </div>
            </template>
            <template v-else>
              <common-loader />
            </template>

            <div class="staking-trix-amount-item__balance-image">
              <img :src="$static.getFileURL('img/icon/ic-token-trix.jpg')" alt="trix" />
              <img
                class="staking-trix-amount-item__balance-image-sub"
                :src="$static.getFileURL('img/icon/ic-staking-solex.svg')"
              />
            </div>
          </div>
          <div>
            <button
              v-if="Number(getStakingAmountLocal) > 0"
              :class="$bem('common-submit-button', '', ['primary'])"
              @click="handleUnStakingCurrency(getCurrency(getTokenAddress))"
            >
              {{ translated('UnstakeTrix') }}
            </button>
            <button v-else :class="$bem('common-submit-button', '', ['disabled'])" disabled>
              {{ translated('UnstakeTrix') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="staking-trix-balance">
      <div class="staking-trix-balance-container">
        <template v-for="(item, i) in getSupportCurrency">
          <div class="staking-trix-balance-item">
            <div class="staking-trix-balance-item-title">
              <img :src="$static.getFileURL(getImgSrc(item.name))" :alt="item.symbol" width="30px" />
              <span>{{ translated(item.name) }}</span>
            </div>
            <div class="staking-trix-balance-item-content">
              <div class="unclaim claim-section">
                <div class="top">
                  <span>{{ translated('UnclaimedRewards') }}</span>
                </div>
                <div class="bottom">
                  <template v-if="true || getIsSetAmount">
                    <span>{{ getReward(item.tokenAddress).amount }}</span>
                  </template>
                  <template v-else>
                    <common-loader />
                  </template>
                  <span>{{ item.symbol }}</span>
                </div>
              </div>
              <hr />
              <div class="claim claim-section">
                <div class="top">
                  <span>{{ translated('EarnedRewards') }}</span>
                </div>
                <div class="bottom">
                  <template v-if="true || getIsSetAmount">
                    <span>{{ getRewardToken(item) }}</span>
                  </template>
                  <template v-else>
                    <common-loader />
                  </template>
                  <span>{{ item.symbol }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="staking-trix-balance-footer">
        <div class="staking-trix-balance-footer-policy">
          <div>
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" alt="info" />
            {{ translated('Policy00') }}
          </div>
          <div>
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" alt="info" />
            {{ translated('Policy01') }}
          </div>
        </div>
        <div class="staking-trix-balance-footer-button">
          <button
            v-if="isEnableClaimTokenReward"
            :class="$bem('common-submit-button', '', ['primary'])"
            @click="rewardButtonClicked(getCurrency(getTokenAddress))"
          >
            {{ translated('ClaimRewards') }}
          </button>
          <button v-else :class="$bem('common-submit-button', '', ['disabled'])" disabled>
            {{ translated('ClaimRewards') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import StakingPager from '@/components/staking/StakingPager';

let $t, component, intervalFunc;

export default {
  name: 'StakingTrixPage',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initPage();
    this.$eventBus.$on('refreshPage', this.initPage);

    intervalFunc = setInterval(() => this.initPage(), 5000);
  },

  beforeDestroy() {
    clearInterval(intervalFunc);
    this.$eventBus.$off('refreshPage', this.initPage);
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      'getSupportCurrency',
      'getStakingAmount',
      'getRewardAmount',
      'getRewards',
      'getTrixPrice',
      'getIsSetAmount',
    ]),

    // 클레임 가능한 보상이 하나라도 있다면 true
    isEnableClaimTokenReward() {
      for (const value of Object.values(this.getRewards)) {
        if (value.amount > 0) {
          return true;
        }
      }

      return false;
    },

    getSolexAmountLocal() {
      let solexAmount = 0;
      if (this.getCurrency(this.getTokenAddress)) {
        solexAmount = this.getCurrency(this.getTokenAddress).decDeposit.dprec(4);
      }
      return solexAmount;
    },

    getSolexAmountUSD() {
      const solexAmountStr = this.getSolexAmountLocal;
      const trixPriceStr = this.getTrixPrice;
      const solexAmount = Number(solexAmountStr);
      const trixPrice = Number(trixPriceStr);

      let solexAmountUSD = 0;
      if (Boolean(solexAmount) && Boolean(trixPrice)) {
        solexAmountUSD = solexAmount * trixPrice;
      }
      return String(solexAmountUSD).dprec(4);
    },

    getStakingAmountLocal() {
      const currency = this.getCurrency(this.getTokenAddress);
      let decimal = 18;
      if (!!currency) decimal = currency.decimal;
      const stakingAmount = this.$bn.toMaxUnit(this.getStakingAmount, decimal, 4);
      return stakingAmount;
    },

    getStakingAmountUSD() {
      const stakingAmountStr = this.getStakingAmountLocal;
      const trixPriceStr = this.getTrixPrice;
      const stakingAmount = Number(stakingAmountStr);
      const trixPrice = Number(trixPriceStr);

      let stakingAmountUSD = 0;
      if (Boolean(stakingAmount) && Boolean(trixPrice)) {
        stakingAmountUSD = stakingAmount * trixPrice;
      }
      return String(stakingAmountUSD).dprec(4);
    },

    getTokenName() {
      return process.env.VUE_APP_TOKEN_NAME;
    },

    getTokenAddress() {
      return process.env.VUE_APP_TOKEN_ADDRESS;
    },

    getTokenSymbol() {
      return process.env.VUE_APP_TOKEN_SYMBOL;
    },
  },

  watch: {},

  methods: {
    ...mapActions(['stakingToken', 'unstakingToken', 'claimRewardToken', 'setRewards', 'setStakingTotalAmount']),

    initPage() {
      // TODO: Not used yet.
    },

    handleStakingCurrency(row) {
      const targetAddress = row.addressToReserve;
      if (!targetAddress) {
        return;
      }

      this.showModal({
        component: 'ReserveInputModal',
        params: {
          action: 'staking',
          currency: targetAddress,
          onSubmit: (input) => {
            return this.stakingToken({
              token: row,
              amount: this.$bn.toMinUnit(input, row.decimal),
            });
          },
        },
      });
    },

    handleUnStakingCurrency(row) {
      const targetAddress = row.addressToReserve;

      if (!targetAddress) {
        return;
      }

      this.showModal({
        component: 'ReserveInputModal',
        params: {
          action: 'unstaking',
          currency: targetAddress,
          onSubmit: (input) => {
            return this.unstakingToken({
              token: row,
              amount: this.$bn.toMinUnit(input, row.decimal),
            });
          },
        },
      });
    },

    async rewardButtonClicked(row) {
      const targetAddress = row.addressToReserve;

      if (!targetAddress) {
        return;
      }

      const claimResult = await this.claimRewardToken({
        token: row,
        currency: targetAddress,
      });

      if (claimResult.success) {
        this.showAlert({
          title: '',
          content: '보상 청구 완료',
        });

        this.setStakingTotalAmount();
        this.$eventBus.$emit('refreshPage');
      } else {
        alert('보상 청구 실패');
      }
    },

    getTranslateValue(val) {
      if (val in $t('Staking')) {
        return $t('Staking')[val];
      }
      return val;
    },

    getKeyOfTranslate(val) {
      switch (val) {
        case 'Ethereum':
          return 'Ethereum';
        case 'Klaytn':
          return 'Klaytn';
        case 'Tether USD':
          return 'Tether';
        case 'TriumpX':
          return 'TriumphX';
        default:
          return val;
      }
    },

    translated(val) {
      return this.getTranslateValue(this.getKeyOfTranslate(val));
    },

    getCurrency(tokenAddress) {
      return _.find(this.getSupportCurrency, (currency) => {
        if (this.$wallet.isSameAddress(currency.tokenAddress, tokenAddress)) return true;
        return false;
      });
    },

    getImgSrc(currencyName) {
      const strBase = 'img/icon/';
      let retStr = strBase;

      switch (currencyName) {
        case 'TriumphX':
          retStr += 'ic-token-trix.svg';
          break;
        case 'Klaytn':
          retStr += 'ic-token-klay.svg';
          break;
        case 'Tether USD':
          retStr += 'ic-token-usdt.svg';
          break;
        case 'KTJ3':
          retStr += 'ic-token-ktj3.svg';
          break;
        case 'Ethereum':
          retStr += 'ic-token-eth.svg';
          break;
      }
      return retStr;
    },

    getReward(tokenAddress) {
      const rewards = this.getRewards;

      const rewardObj = _.find(rewards, (reward) => {
        if (this.$wallet.isSameAddress(tokenAddress, reward.currency)) return true;
        return false;
      });

      if (rewardObj) {
        return rewardObj;
      }

      return {
        amount: 0,
        totalReward: 0,
      };
    },

    getRewardToken(item) {
      let rewardAmountObject = this.getReward(item.tokenAddress);
      let rewardAmount = rewardAmountObject ? rewardAmountObject.totalReward : 0;

      const currencies = this.getSupportCurrency;
      const currency = _.find(currencies, {
        tokenAddress: item.tokenAddress,
      });

      if (currency) {
        rewardAmount = this.$bn.toMaxUnit(rewardAmount, currency.decimal, 4);
      }

      return rewardAmount;
    },
  },

  components: {
    StakingPager,
  },
};
</script>

<style></style>
