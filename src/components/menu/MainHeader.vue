<template>
  <header class="main-header">
    <div>
      <div class="main-header__title">
        <router-link :to="{ path: '/home' }">
          <img :src="$static.getFileURL('img/logo/default-logo.svg')" />
        </router-link>
      </div>

      <div class="main-header__language">
        <div class="main-header__language__selected">
          <span>
            {{$i18n.locale.toUpperCase()}}
            <img class="v-m" :src="$static.getFileURL('img/icon/ic-chevron-bottom-gray.svg')" alt="chevron to bottom" />
          </span>

          <ui-popover ref="language" class="common-search-select main-header__language__dropdown">
            <ul>
              <li @click="handleSelectLang('en')">EN</li>
              <li @click="handleSelectLang('ko')">KO</li>
            </ul>
          </ui-popover>
        </div>
      </div>

      <div v-if="$_GlobalValueMixin_showRouterView" class="main-header__wallet">
        <img :src="$static.getFileURL(`img/logo/logo-${getAccessType}.svg`)" :alt="getAccessType" />

        <ui-popover v-if="getUserInfo.address" ref="userSetting" class="main-user-setting-wrap">
          <main-user-setting @onClose="() => $refs.userSetting.close()" />
        </ui-popover>
      </div>

      <div
          v-else
          class="main-header__wallet disabled"
          @click="handleConnectWallet"
      >
        <span v-if="$t('General.Language') === 'KOR'">지갑 연결</span>
        <span v-else style="font-size: 12px; font-weight: 300;">Connect Wallet</span>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MainUserSetting from '@/components/menu/MainUserSetting'
  import GlobalValueMixin from "@/mixins/common/GlobalValueMixin";

  let $t, component

  export default {
    name: 'MainHeader',

    props: {

    },

    mixins: [GlobalValueMixin],

    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {

    },

    beforeDestroy() {

    },

    data() {
      return {

      }
    },

    computed: {
      ...mapGetters([
        'getAccessType'
      ])
    },

    watch: {
      $route() {
        const { userSetting } = this.$refs

        if(!userSetting) {
          return
        }

        userSetting.close()
      }
    },

    methods: {
      handleSelectLang(lang) {
        this.$i18n.locale = lang
        this.$refs.language.close()
      },

      handleConnectWallet() {
        this.$router.push('/wallet/connect');
      }
    },

    components: {
      MainUserSetting
    }
  }
</script>
