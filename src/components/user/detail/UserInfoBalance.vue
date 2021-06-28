<template>
  <section class="user-info-balance">
    <div class="user-info-balance__token" v-for="currency in supportCurrency" :key="currency.symbol">
      <div class="user-info-balance__icon">
        <img :src="$static.getFileURL(`img/icon/ic-token-${currency.symbol.toLowerCase()}.svg`)" />
      </div>

      <!-- TODO : 반응형 -->
      <div
        :class="
          $bem('user-info-balance__info', '', getTargetBalance(currency).dprec(2).length >= 6 ? ['overflow'] : '')
        "
      >
        <h6 class="text-gray">
          {{ currency.name }}
        </h6>
        <p>
          <strong>{{ getTargetBalance(currency).dprec(2) | addComma }}</strong> <span> {{ currency.symbol }}</span>
        </p>
      </div>
    </div>

    <slot name="itemInfo"></slot>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'UserInfoBalance',
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

  components: {},
};
</script>
