<template>
  <div class="staking-activity-no-data-page">
    <section class="staking-activity-no-data-page__main">
      <div class="staking-activity-no-data-page__main-image-container">
        <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" width="40px" alt="alert" />
      </div>
      <span class="no_items_found">{{ $t('Staking.NoDataTitle') }}</span>
      <div class="staking-activity-no-data-page__main-wallet" v-if="walletConnection">
        <span class="sorry_no_items_message">{{ $t('Staking.NoDataDesc') }}</span>
      </div>
      <div class="staking-activity-no-data-page__main-wallet" v-else>
        <div>To check your activity.</div>
        <div>please connect your wallet.</div>
        <button :class="$bem('common-submit-button', '', ['primary'])">Connect Wallet</button>
      </div>
    </section>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'StakingMyActivityNoData',

  props: {},

  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      walletConnection: true,
    };
  },

  computed: {},

  watch: {},

  methods: {},

  components: {},
};
</script>
