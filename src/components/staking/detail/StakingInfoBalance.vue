<template>
  <section class="staking-info-balance">
    <div class="staking-info-balance__token" v-for="currency in supportCurrency" :key="currency.symbol">
      <div class="staking-info-balance__icon">
        <img
          :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)"
          :alt="currency.symbol"
        />
      </div>

      <div class="staking-info-balance__info">
        <h6 class="text-gray">
          {{ currency.name }}
        </h6>
      </div>
    </div>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'StakingInfoBalance',
  props: {
    type: {
      // 0 : balance, 1 : deposit, 2 : on trade
      type: Number,
      default() {
        return 0;
      },
    },
    supportCurrency: Array,
  },

  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    getTargetBalance(currency) {
      const { type } = this;

      if (type === 0) {
        return currency.decBalance;
      }

      if (type === 1) {
        return currency.decDeposit;
      }

      if (type === 2) {
        return '0';
      }

      return '0';
    },
  },

  conponents: {},
};
</script>
