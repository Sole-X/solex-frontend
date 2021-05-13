<template>
  <nav class="main-nav">
    <div class="main-nav-items">
      <ul>
        <li :class="$bem('main-nav__tab', '', isActiveMenu(tab) || isSelectedTab($route, tab) ? ['selected'] : '')" v-for="tab in getNavItems" :key="tab.path">
          <span @click="handleClickLink(tab)">
            {{tab.title}}
          </span>

          <ui-popover :ref="tab.type" class="main-nav__sub-path" v-if="tab.children">
            <ul>
              <li
                v-for="child in tab.children"
                :key="child.path"
                @click="handleClosePopover(tab)"
                :class="$bem('main-nav__sub-path__tab', '', $route.path === child.path ? ['selected'] : '')"
              >
                <router-link :to="{ path: child.path }">{{child.title}}</router-link>
              </li>
            </ul>
          </ui-popover>
        </li>
      </ul>
    </div>
    <common-search-bar-html></common-search-bar-html>
  </nav>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import CommonSearchBar from '@/components/common/CommonSearchBar'
  import CommonSearchDropdown from '@/components/common/CommonSearchDropdown';
  import CommonSearchBarHtml from '@/components/common/CommonSearchBarHtml';

  let $t, component

  export default {
    name: 'MainNav',
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
        keyword: ''
      }
    },

    computed: {
      ...mapGetters([
        'getSearchFilter'
      ]),

      getNavItems() {
        return [
          {
            type: 'buyTrade',
            title: $t('General.BuyMenu'),
            path: '/buy'
          },
          {
            type: 'sellTrade',
            title: $t('General.SellMenu'),
            path: '/sell'
          },
          {
            type: 'explorer',
            title: $t('General.ExplorerMenu'),
            path: '/explorer',
            children: [
              {
                title: $t('General.ExplorerActivityMenu'),
                path: '/explorer/history'
              },
              {
                title: $t('General.ExplorerRankingMenu'),
                path: '/explorer/ranking'
              }
            ]
          },
          {
            type: 'staking',
            title: $t('General.StakingMenu'),
            path: '/staking/trix'
          },
          {
            type: 'userPage',
            title: $t('General.UserMenu'),
            path: '/user/info'
          }
        ]
      }
    },

    watch: {
      'getSearchFilter.keyword'(newVal) {
        /*
        if(newVal && newVal.length >= 2) {
          return this.$refs.search.open()
        }
        this.$refs.search.close()
        */
      }
    },

    methods: {
      ...mapActions([
        'setSearchFilter'
      ]),

      handleSelectSearchType(type) {
        this.setSearchFilter({
          type
        })

        this.$refs.select.close()
      },

      handleSearch() { // TODO : Query
        this.$router.push({
          path: `/asset/${this.getSearchFilter.type}`
        })
      },

      handleClickLink(tab) {
        if(tab.children) {
          return
        }

        this.$router.push({
          path: tab.path
        })
      },

      handleClosePopover(tab) {
        const $popover = this.$refs[tab.type]

        if(!$popover || !$popover[0]) {
          return
        }

        $popover[0].close()
      },

      isActiveMenu(menu) {
        const { path, name, query } = this.$route

        return path.startsWith(menu.path)
      },

      getTranslateValue(val) {
        return $t(val)
      },

      isSelectedTab(route, child) {
        let routePath = '__init__';
        if (route && route.matched && route.matched.length > 0)
          routePath = route.matched[0].path;
        const childPath = child.path;

        if (childPath.includes(routePath)) {
          return true;
        }
        return false;
      }
    },

    components: {
      CommonSearchBar,
      CommonSearchDropdown,
      CommonSearchBarHtml
    }
  }
</script>
