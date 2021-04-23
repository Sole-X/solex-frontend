<template>
  <div class="main-page explorer-page">
    <main-sidebar />
    <div ref="content" class="main-page__content explorer-page__content">
      <router-view @onMovePage="handlePage" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import qs from 'querystring'
  import MainSidebar from '@/components/MainSidebar'

  let $t, component

  export default {
    name: 'ExplorerPage',
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.handleRefreshFilter()

      if(!this.$route.meta.tab) {
        this.$router.replace({
          path: '/explorer/history'
        })
      }
    },

    beforeDestroy() {
      this.clearSearchFilter()
    },

    data() {
      return {}
    },

    computed: {
      ...mapGetters([
        'getSearchFilter',
        'getSearchQuery'
      ])
    },

    watch: {
      $route(newVal, oldVal) {
        if(newVal.meta.tab !== oldVal.meta.tab) {
          this.handleRefreshFilter()
        }
      },

      getSearchFilter(newVal) {
        this.initPage(newVal)
      }
    },

    methods: {
      ...mapActions([
        'setSearchFilter',
        'clearSearchFilter',
        'setAllActivities',
        'setAllRanks',
        'refreshTokenFilter'
      ]),

      initPage(filter) {
        const { tab } = this.$route.meta
        const newQuery = {
          ...this.getSearchQuery()
        }

        if(filter.page) {
          newQuery.page = filter.page
        }

        const newPath = qs.encode(newQuery)
        const prevPath = qs.encode(this.$route.query)

        const onInitSuccess = () => {
          if(newPath !== prevPath) {
            this.$router.replace({
              query: newQuery
            })
          }
        }

        // 상단으로 스크롤 이동
        // TODO : 최하단에 자동 배치시키기
        this.$refs.content.scroll(0, 0)

        if(tab === 'history') {
          return this.initHistoryPage(newQuery).then(() => {
            return onInitSuccess()
          })
        }

        return this.initRankingPage(newQuery).then(() => {
          return onInitSuccess()
        })
      },

      async initHistoryPage(query) {
        return await this.setAllActivities({
          query
        })
      },

      async initRankingPage(query) {
        return await this.setAllRanks({
          query
        })
      },

      handlePage(page) {
        this.initPage({
          page
        })
      },

      async handleRefreshFilter() {
        const filterAboutToken = await this.refreshTokenFilter()

        this.clearSearchFilter({
          ...filterAboutToken
        })
      }
    },

    components: {
      MainSidebar
    }
  }
</script>
