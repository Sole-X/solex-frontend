<template>
  <div class="wallet-connect">
    <main-connect-wallet />
  </div>
</template>

<script>
let $t, self;
import MainConnectWallet from '@/components/MainConnectWallet';

export default {
  name: '',

  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.$eventBus.$on('walletConnected', this.handleWalletConnected);
  },

  updated() {},

  beforeDestroy() {
    this.$eventBus.$off('walletConnected', this.handleWalletConnected);
  },

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    handleWalletConnected() {
      if (Boolean(this.getUserInfo.address)) {
        this.$router.go(-1);
      }
      this.$http.post('setAgreement', {
        body: {
          status: 'TRUE',
        },
        urlParams: {
          accountAddr: this.getUserInfo.address,
        },
      });
    },
  },

  components: {
    MainConnectWallet,
  },
};
</script>
