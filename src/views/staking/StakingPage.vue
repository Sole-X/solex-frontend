<template>
  <div>
    <div class="staking-page">
      <div>
        <h1 class="staking__title">
          {{ getTranslateValue('Staking') }}
        </h1>
        <p class="staking__description">
          {{ getTranslateValue('Description') }}
        </p>
        <div class="staking-page__staking-container">
          <div class="staking-page__staking-container__item">
            <section class="container__item">
              <span class="staking-page__staking-container__item-title">{{ getTranslateValue('TotalSupply') }}</span>
            </section>
            <section class="container__item right">
              <span class="staking-page__staking-container__item-description">{{ getTotalSupply | addComma }}</span>
              <span class="staking-page__staking-container__item-description">TRIX</span>
            </section>
          </div>
          <div class="staking-page__staking-container__dot" />
          <div class="staking-page__staking-container__item">
            <section class="container__item">
              <span class="staking-page__staking-container__item-title">{{ getTranslateValue('TotalStaked') }}</span>
            </section>
            <section class="container__item right">
              <span class="staking-page__staking-container__item-description">{{ getTotalStaked | addComma }}</span>
              <span class="staking-page__staking-container__item-description">TRIX</span>
            </section>
          </div>
          <div class="staking-page__staking-container__dot" />
          <div class="staking-page__staking-container__item">
            <section class="container__item">
               <span class="staking-page__staking-container__item-title">{{
                getTranslateValue('RewardsDistributed')
              }}</span>
            </section>
            <section class="container__item right">
              <span class="staking-page__staking-container__item-description">{{
                getRewardsDistributed | addComma
              }}</span>
              <span class="staking-page__staking-container__item-description">USD</span>
            </section>
          </div>
          <div class="staking-page__staking-container__dot" />
          <div class="staking-page__staking-container__item">
            <section class="container__item">
              <span class="staking-page__staking-container__item-title">{{ getTranslateValue('TriumphxPrice') }}</span>
            </section>
            <section class="container__item right">
              <span class="staking-page__staking-container__item-description">{{ getTrixPrice | addComma }}</span>
              <span class="staking-page__staking-container__item-description">USD</span>
            </section>
          </div>
          <div class="staking-page__staking-container__dot" />
          <div class="staking-page__staking-container__item">
            <section class="container__item">
              <span class="staking-page__staking-container__item-title">{{ getTranslateValue('UnstakingPeriod') }}</span>
            </section>
            <section class="container__item right">
              <span class="staking-page__staking-container__item-description">{{ getUnstakingPeriod | addComma }}</span>
              <span class="staking-page__staking-container__item-description">h</span>
            </section>
          </div>
        </div>
      </div>
      <nav class="staking-page__inner-nav">
        <ul>
          <li
            v-for="tab in getStakingTabs"
            :key="tab.path"
            :class="$bem('staking-page__nav__tab', '', tab.type === $route.meta.tab ? ['selected'] : '')"
          >
            <router-link :to="{ path: tab.path }" class="text-gray">
              {{ getTranslateValue(getKeyOfTranslate(tab.name)) }}
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="staking-page__detail">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

let $t, component, intervalFunc;

export default {
  name: 'StakingPage',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.setIsSetAmount(false);
    setTimeout(() => {
      this.setStakingTotalAmount();
    }, 1000);
    this.setTotalAmount();

    intervalFunc = setInterval(() => {
      this.setStakingTotalAmount();
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(intervalFunc);
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters([
      'getStakingCommit',
      'getTotalSupply',
      'getTotalStaked',
      'getRewardsDistributed',
      'getTrixPrice',
      'getUnstakingPeriod',
    ]),

    getStakingTabs() {
      return [
        {
          type: 'trix',
          name: 'TRIX Staking',
          path: '/staking/trix',
        },
        {
          type: 'activity',
          name: 'MY Activity',
          path: '/staking/activity',
        },
      ];
    },
  },

  watch: {
    getStakingCommit: function () {
      const commitInfo = this.getStakingCommit;
      const { sessionKey, date, amount, token, type, claimed } = commitInfo;

      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          sessionKey,
          date,
          amount,
          token,
          type,
          claimed,
        }),
      );
    },

    $_GlobalValueMixin_showRouterView: function () {
      this.setStakingTotalAmount();
    },
  },

  methods: {
    ...mapActions(['setTotalAmount', 'setStakingTotalAmount', 'setIsSetAmount']),

    getTranslateValue(val) {
      if (val in $t('Staking')) {
        return $t('Staking')[val];
      }
      return val;
    },

    getKeyOfTranslate(val) {
      switch (val) {
        case 'TRIX Staking':
          return 'TrixStaking';
        case 'MY Activity':
          return 'MyActivity';
        default:
          return val;
      }
    },
  },

  components: {},
};
</script>

<style></style>
