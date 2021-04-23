import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'getWindowInfo',
      'getModalStatus',
      'getPlatformInfo',
      'getLoadingStatus',
      'getUserInfo',
      'getChainInfo'
    ]),

    $_GlobalValueMixin_showRouterView() {
      return this.$route.path === '/' || Boolean(this.getUserInfo.address)
    }
  },

  methods: {
    ...mapActions([
      'showModal',
      'showAlert'
    ]),

    $_GlobalValueMixin_showCopyTooltip() {
      this.showModal({
        component: 'DialogModal',
        params: {
          content: this.$t('General.CopySuccess')
        }
      })
    }
  }
}
