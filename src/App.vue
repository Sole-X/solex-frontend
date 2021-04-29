<template>
  <div id="app">
    <div :class="$bem('main-menu', '', getMenuClass)" v-if="showMainNav">
      <main-header />
      <main-nav />
    </div>

    <main :class="!showMainNav ? 'home' : ''">
      <router-view v-if="showRouterView" class="router-view" />
      <main-connect-wallet v-else />
    </main>

    <main-footer v-if="!$route.meta.hideFooter" />
  </div>
</template>

<style lang="scss">
  @import 'styles/keenUi';
  @import 'styles/nativeScrollbar';
  @import 'styles/animation';
</style>

<style lang="scss">
  @import 'styles/app';
  @import 'styles/common';
  @import 'styles/menu';
  @import 'styles/modal';
  @import 'styles/landing';
  @import 'styles/main';
  @import 'styles/marketplace';
  @import 'styles/asset';
  @import 'styles/user';
  @import 'styles/explorer';
  @import 'styles/request';
  @import 'styles/customer';
  @import 'styles/skeleton';
  @import 'styles/staking';
  @import 'styles/svg';
</style>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import SocketMixin from '@/mixins/SocketMixin'
  import MainHeader from '@/components/menu/MainHeader'
  import MainFooter from '@/components/menu/MainFooter'
  import MainNav from '@/components/menu/MainNav'
  import MainConnectWallet from '@/components/MainConnectWallet'

  export default {
    name: 'App',
    mixins: [SocketMixin],
    created() {
      console.log(`SOLE-X version is ${process.env.version}`)
    },
    mounted() {
      this.initApp()
    },
    beforeDestroy() {
      this.clearWindowEvent()
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
          'getUserActivities'
      ]),

      showMainNav() {
        return !this.$route.meta.hideNav
      },

      getMenuClass() {
        return this.$route.name === 'MarketHomePage' ? ['home'] : ''
      },

      showRouterView() {
        return !this.$route.meta.needLogin || this.getUserInfo.address
      },
    },
    watch: {
      '$i18n.locale'(newVal) {
        this.setUserLang(newVal)
        this.$date.setTimeLocale(newVal)
      }
    },
    methods: {
      ...mapActions([
        'setWindowInfo',
        'setUserLang',
        'setWhitelist'
      ]),

      initApp() {
        this.setWhitelist()
        this.initWindowEvent()
        this.initPersistData()


      },

      initPersistData() {
        this.$i18n.locale = this.$store.state.userLang
        this.$date.setTimeLocale(this.$i18n.locale)
      },

      initWindowEvent() {
        this.handleResize()

        window.addEventListener('resize', this.handleResize)
        window.addEventListener('scroll', this.handleScroll)
      },

      clearWindowEvent() {
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('scroll', this.handleScroll)
      },

      handleResize() {
        const clientRect = document.body.getBoundingClientRect()

        this.setWindowInfo({
          width: clientRect.width,
          height: clientRect.height
        })
      },

      handleScroll() {
        this.setWindowInfo({
          scrollTop: window.scrollY,
          scrollLeft: window.scrollX
        })
      }
    },
    components: {
      MainNav,
      MainHeader,
      MainFooter,
      MainConnectWallet
    }
  }
</script>
