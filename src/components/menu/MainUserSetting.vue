<template>
  <section class="main-user-setting">
    <header class="main-user-setting__header">
      <div class="main-user-setting__header__icon">
        <img ref="profile_image" />
      </div>

      <div class="main-user-setting__header__info">
        <div class="main-user-setting__header__info__address">
          <p>{{getMaskedAddress(getUserInfo.address)}}</p>
          <button v-clipboard:copy="getUserInfo.address" v-clipboard:success="$_GlobalValueMixin_showCopyTooltip">
            <img :src="$static.getFileURL('img/icon/ic-copy-gray.svg')" />
          </button>
        </div>

        <div class="main-user-setting__header__info__nickname">
          <span>{{ getUserInfo.username || 'No activity' }}</span>
          <router-link :to="{ path: '/user/info', query: { mode: 'profile' } }">
            <button class="user-setting-link"></button>
          </router-link>
        </div>
      </div>
    </header>

    <article class="main-user-setting__menu">
      <ul>
        <li v-for="menu in getMainMenu" :key="menu.path">
          <router-link :to="{ path: menu.path }">
            <span>{{menu.title}}</span>
            <img :src="$static.getFileURL('img/icon/ic-chevron-right-gray.svg')" alt="chevron to right" class="v-m" />
          </router-link>
        </li>
      </ul>
    </article>

    <article class="main-user-setting__action">
      <button :class="$bem('common-submit-button', '', ['primary'])" @click="handleLogout()">
        {{ $t('UserPage.DisconnectWallet') }}
      </button>
    </article>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from "axios";

  let $t, component

  export default {
    name: 'MainUserSetting',
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.getUserProfileImageSrc;
    },

    beforeDestroy() {

    },

    data() {
      return {

      }
    },

    computed: {
      ...mapGetters([
          'getMaskedAddress'
      ]),

      getMainMenu() {
        return [
          {
            title: this.$t('UserPage.MyInfo'),
            path: '/user/info'
          },
          {
            title: this.$t('UserPage.MyItems'),
            path: '/user/item'
          },
          {
            title: this.$t('UserPage.MyAssets'),
            path: '/user/asset'
          },
          {
            title: this.$t('UserPage.MyActivity'),
            path: '/user/history'
          },
          {
            title: this.$t('UserPage.MyWatchlist'),
            path: '/user/watchlist'
          }
        ]
      },

      getUserProfileImageSrc() {
        const baseURL = process.env.VUE_APP_API_ENDPOINT;
        const userAddress = this.getUserInfo.address;
        if (userAddress) {
          const pathURL = `images/${userAddress}.png`;
          const targetURL = `${baseURL}/${pathURL}`;

          axios.get(targetURL).then(res => {
            this.$refs.profile_image.src = targetURL
          }).catch(res => {
            this.$refs.profile_image.src = this.$static.getFileURL('img/icon/ic-profile-default.svg');
          })
        }
      }
    },

    watch: {},

    methods: {
      ...mapActions([
        'logout'
      ]),

      async handleLogout() {
        await this.logout()
        this.$emit('onClose')
      }
    },

    components: {}
  }
</script>
