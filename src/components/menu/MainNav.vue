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

    <!--
    <common-search-bar
      :keyword="getSearchFilter.keyword"
      @onInput="value => keyword = value"
    >
      <div slot="option" class="common-search-bar__option">
        <span>{{getSearchFilter.type}}</span>
        <ui-popover ref="select" class="common-search-bar__select" animation="shift-away">
          <ul>
            <li @click="handleSelectSearchType('sell')">{{$t('General.SellMenu')}}</li>
            <li @click="handleSelectSearchType('buy')">{{$t('General.BuyMenu')}}</li>
          </ul>
        </ui-popover>
      </div>
      <ui-popover slot="result" ref="search" :class="$bem('common-search-bar__result', '', ['menu'])" openOn="click">
        <div class="common-search-bar__result__item" v-for="i in 3" :key="i">
          <div class="common-search-bar__result__title">
            {{['Items', 'Collections', 'Accounts'][i - 1]}}
          </div>

          <div class="common-search-bar__result__list">
            <div class="common-search-bar__result__row" v-for="j in 4" :key="j">
              <div></div>
              <div>
                <span class="highlighted">hi</span> everyone
                <button>test</button>
              </div>
            </div>
          </div>
        </div>
      </ui-popover>
    </common-search-bar>
    -->
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

        if(menu.type === 'buyTrade') {
          /*
          if(name === 'AssetMainPage' && path === '/buy') {
            return true
          }

          if(name === 'AssetItemPage' && path === '/buy') {
            return true
          }

          return false

           */
        }

        if(menu.type === 'sellTrade') {
          // return (name === 'AssetMainPage' && query.type === 'sell') || (name.startsWith('AssetItem') && query.type !== 'buy')
        }

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
