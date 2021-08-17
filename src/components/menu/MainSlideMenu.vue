<template>
  <section id="mainSlideMenu" class="main-slide-menu">
    <nav class="main-nav">
      <div class="main-nav-items">
        <ul>
          <li
            :class="$bem('main-nav__tab', '', isActiveMenu(tab) || isSelectedTab($route, tab) ? ['selected'] : '')"
            v-for="tab in getNavItems"
            :key="tab.path"
          >
            <strong class="main-nav-title" @click="[handleClickLink(tab), slideMenuClose(tab, $event)]">
              {{ tab.title }}
            </strong>

            <ol class="main-nav-sub-list" :ref="tab.type" v-if="tab.children" style="display: none;">
              <li
                v-for="child in tab.children"
                :key="child.path"
                :class="$bem('li', '', $route.path === child.path ? ['selected'] : '')"
                @click="mainSlideMenuClose()"
              >
                <router-link :to="{ path: child.path }">- {{ child.title }}</router-link>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    </nav>
    <div v-if="$_GlobalValueMixin_showRouterView" class="main-header__wallet">
      <img :src="$static.getFileURL(`img/logo/logo-${getAccessType}.svg`)" :alt="getAccessType" />

      <ui-popover v-if="getUserInfo.address" ref="userSetting" class="main-user-setting-wrap">
        <main-user-setting @onClose="() => $refs.userSetting.close()" />
      </ui-popover>
    </div>
    <div v-else class="main-header__wallet disabled" @click="handleConnectWallet">
      <span v-if="$t('General.Language') === 'KOR'">지갑 연결</span>
      <span v-else>Connect Wallet</span>
    </div>
    <div class="main-header__language">
        <div class="main-header__language__selected">
          <span>
            {{ $i18n.locale.toUpperCase() }}
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
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CommonSearchBar from '@/components/common/CommonSearchBar';
import CommonSearchDropdown from '@/components/common/CommonSearchDropdown';
import CommonSearchBarHtml from '@/components/common/CommonSearchBarHtml';

let $t, component;

export default {
  name: 'MainSlideMenu',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      keyword: '',
    };
  },

  computed: {
    ...mapGetters(['getSearchFilter']),

    getNavItems() {
      return [
        {
          type: 'buyTrade',
          title: $t('General.BuyMenu'),
          path: '/buy',
        },
        {
          type: 'sellTrade',
          title: $t('General.SellMenu'),
          path: '/sell',
        },
        {
          type: 'explorer',
          title: $t('General.ExplorerMenu'),
          path: '/explorer',
          children: [
            {
              title: $t('General.ExplorerActivityMenu'),
              path: '/explorer/history',
            },
            {
              title: $t('General.ExplorerRankingMenu'),
              path: '/explorer/ranking',
            },
          ],
        },
        {
          type: 'staking',
          title: $t('General.StakingMenu'),
          path: '/staking',
          children: [
            {
              title: $t('Staking.TrixStaking'),
              path: '/staking/trix',
            },
            {
              title: $t('Staking.MyActivity'),
              path: '/staking/activity',
            },
          ],
        },
        {
          type: 'userPage',
          title: $t('General.UserMenu'),
          path: '/user',
          children: [
            {
              title: $t('UserPage.MyInfo'),
              path: '/user/info',
            },
            {
              title: $t('UserPage.MyItems'),
              path: '/user/item',
            },
            {
              title: $t('UserPage.MyAssets'),
              path: '/user/asset',
            },
            {
              title: $t('UserPage.MyActivity'),
              path: '/user/history',
            },
            {
              title: $t('UserPage.MyWatchlist'),
              path: '/user/watchlist',
            },
          ],
        },
      ];
    },
  },

  watch: {
    'getSearchFilter.keyword'(newVal) {
      /*
        if(newVal && newVal.length >= 2) {
          return this.$refs.search.open()
        }
        this.$refs.search.close()
        */
    },
  },

  methods: {
    ...mapActions(['setSearchFilter']),

    handleSelectSearchType(type) {
      this.setSearchFilter({
        type,
      });

      this.$refs.select.close();
    },

    handleSearch() {
      // TODO : Query
      this.$router.push({
        path: `/asset/${this.getSearchFilter.type}`,
      });
    },

    handleClickLink(tab) {
      if (tab.children) {
        return;
      }

      this.$router.push({
        path: tab.path,
      });
    },

    handleClosePopover(tab) {
      const $popover = this.$refs[tab.type];

      if (!$popover || !$popover[0]) {
        return;
      }

      $popover[0].close();

      const mainSlideMenu = document.getElementById("mainSlideMenu");
      mainSlideMenu.style.display = "none"
    },

    isActiveMenu(menu) {
      const { path, name, query } = this.$route;

      return path.startsWith(menu.path);
    },

    getTranslateValue(val) {
      return $t(val);
    },

    isSelectedTab(route, child) {
      let routePath = '__init__';
      if (route && route.matched && route.matched.length > 0) routePath = route.matched[0].path;
      const childPath = child.path;

      if (childPath.includes(routePath)) {
        return true;
      }
      return false;
    },
    handleSelectLang(lang) {
      this.$i18n.locale = lang;
      this.$refs.language.close();
    },

    handleConnectWallet() {
      this.$router.push('/wallet/connect');
    },
    slideMenuClose(tab, event) {
      //const _this = event.target;
      const mainNavSubMenu = event.target.parentNode.childNodes[1];

      console.log(tab.type)
      
      if ( tab.type == "explorer" || tab.type == "staking" || tab.type == "userPage" ) {
        if ( mainNavSubMenu.style.display == "none" ) {
            mainNavSubMenu.style.display = "block"
          }
          else mainNavSubMenu.style.display = "none"
      } else {
        mainSlideMenu.style.display = "none"
      }
    },
    mainSlideMenuClose(){
      const mainSlideMenu = document.getElementById("mainSlideMenu");
      mainSlideMenu.style.display = "none"
    }
  },

  components: {
    CommonSearchBar,
    CommonSearchDropdown,
    CommonSearchBarHtml,
  },
};
</script>
