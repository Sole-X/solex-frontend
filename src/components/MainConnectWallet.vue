<template>
  <section class="main-connect-wallet router-view">
    <div class="main-connect-wallet__title">
      <h4>
        <strong>{{ $t('General.NotConnectedWalletTitle') }}</strong>
      </h4>
      <p>{{ $t('General.NotConnectedWalletDescription') }}</p>
    </div>

    <div class="main-connect-wallet__select">
      <div class="select-wallet__options">
        <div
          v-for="service in getAvailableService"
          :key="service.type"
          :class="service.className"
          @click="$_UserWalletMixin_handleConnect(service)"
        >
          <img :src="service.icon" :alt="service.name" />
          <div>
            <div>
              {{ service.name }}
            </div>
            <div>
              {{ service.appear }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-connect-wallet__warning">
      <p class="text-gray"></p>
      <p class="text-gray"></p>
    </div>
  </section>
</template>

<script>
import UserWalletMixin from '@/mixins/user/UserWalletMixin';

let $t, component;

export default {
  name: 'MainConnectWallet',

  mixins: [UserWalletMixin],

  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    getAvailableService() {
      return this.$_UserWalletMixin_getAvailableService();
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
