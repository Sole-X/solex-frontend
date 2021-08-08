<template>
  <div class="landing-page">
    <header class="landing-page__header">
      <button :class="$bem('common-submit-button', '', ['outline-primary'])" @click="handleConnectWallet()">
        <strong>{{ $t('General.ConnectWallet') }}</strong>
      </button>
    </header>

    <div class="landing-page__body">
      <section :class="$bem('landing-page__section', ['graphic'])">
        <img :src="$static.getFileURL('img/article/article-home-cloud-bg.jpg')" alt="background of home" />
      </section>

      <section :class="$bem('landing-page__section', ['description'])">
        <article>
          <div>
            <div>
              <img :src="$static.getFileURL('img/logo/default-logo.jpg')" />
            </div>

            <h1>
              <strong>{{ $t('General.LandingPageTitle') }}</strong>
            </h1>

            <p>
              {{ $t('General.LandingPageDescription')[0] }}
              <br />
              {{ $t('General.LandingPageDescription')[1] }}
            </p>

          <!--반응형 지갑 열기 버튼 추가-->
            <button :class="$bem('common-submit-button', '', ['outline-primary none'])" @click="handleConnectWallet()">
              <strong>{{ $t('General.ConnectWallet') }}</strong>
            </button>

            <router-link :to="{ path: '/home' }">
              <button :class="$bem('common-submit-button', '', ['primary'])">
                <strong>{{ $t('General.LandingPageSubmit') }}</strong>
              </button>
            </router-link>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'LandingPage',
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
    handleConnectWallet() {
      this.showModal({
        component: 'SelectWalletModal',
      });
    },
  },

  components: {},
};
</script>
