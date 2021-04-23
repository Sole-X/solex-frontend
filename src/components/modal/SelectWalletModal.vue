<template>
  <section class="gen-modal select-wallet-modal">
    <div class="gen-modal__close" @click="close()" />

    <article class="gen-modal__content gen-modal__sub-title">
      <div>
        <h4>{{$t('General.ConnectWalletModalTitle')}}</h4>
        <div class="gen-modal__desc">{{$t('General.ConnectWalletModalTitle')}}</div>
      </div>
    </article>

    <article class="gen-modal__content select-wallet__options">
      <div
        v-for="service in getAvailableService"
        :key="service.type"
        class="select-wallet__option"
        @click="handleSelectService(service)"
      >
        <img :src="service.icon" :alt="service.name" />
        <h6>
          <strong>{{service.name}}</strong>
        </h6>
        <span>
          {{service.chain}}
        </span>
      </div>
    </article>
  </section>
</template>

<script>
  import UserWalletMixin from '@/mixins/user/UserWalletMixin'

  let $t, component

  export default {
    name: 'SelectWalletModal',
    mixins: [UserWalletMixin],
    props: {
      data: Object,
      close: Function
    },
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {}
    },

    computed: {
      getAvailableService() {
        return this.$_UserWalletMixin_getAvailableService()
      }
    },

    watch: {},

    methods: {
      async handleSelectService(service) {
        const res = await this.$_UserWalletMixin_handleConnect(service)
        Log('d res', res);

        if(!res.success) {
          return
        }

        this.close()
        this.$router.push({
          path: '/home'
        })
      }
    },

    components: {}
  }
</script>
