<template>
  <div class="main-page trade-main-page">
    <main-sidebar />

    <section class="main-page__content trade-main-page__content" @scroll="handleMainScroll">
      <div class="main-item-search" :style="getSearchAreaStyle">
        <div class="main-item-search__filter">
          <h6 class="text-lightblack" v-html="$t('Market.TotalCount', { total: getSearchedNft.total })" />

          <common-search-dropdown
            :list="getFilterList"
            :selected="selectedFilter"
            :defaultTitle="'sortBy'"
            @onSelect="handleUpdateSelectedFilter"
          />
        </div>

        <router-link :to="{ path: getRegisterPath }">
          <button :class="$bem('common-submit-button', '', ['primary'])">
            {{$t('Market.RegisterOffer')}}
          </button>
        </router-link>
      </div>

      <div class="asset-item-card__list" ref="list">
        <asset-item-card
          v-for="item in getSearchedNft.list"
          :info="item"
          :key="item.id"
          @onToggle="handleToggleItem"
        />
      </div>

      <div v-if="getLoadingStatus.searchNft">
        <common-loader />
      </div>

      <div v-else-if="getSearchedNft.list.length === 0" class="asset-item-card__empty">
        <div class="asset-item-card__empty__icon">
          <img :src="$static.getFileURL('img/icon/ic-list-error.svg')" alt="list error" />
        </div>

        <div class="asset-item-card__empty__text">
          <h5>{{$t('Market.NoMatchSearching')}}</h5>
          <p class="text-lightblack">{{$t('Market.NoMatchSearchNotice')}}</p>
        </div>

        <button class="asset-item-card__empty__submit">
          <img :src="$static.getFileURL('img/icon/ic-chevron-left-gray.svg')" alt="chevron to left" class="v-m" />
          {{$t('Market.BackToMarketplace')}}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import qs from 'querystring'
  import CommonSearchDropdown from '@/components/common/CommonSearchDropdown'
  import MainSidebar from '@/components/MainSidebar'
  import AssetItemCard from '@/components/asset/item/AssetItemCard'

  let $t, component

  export default {
    name: 'AssetMainPage',
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.initPage()
    },

    beforeDestroy() {
      this.clearSearchNft()
      this.clearSearchFilter()
    },

    data() {
      return {
        selectedFilter: {}
      }
    },

    computed: {
      ...mapGetters([
        'getSearchFilter',
        'getSearchedNft',
        'getSearchQuery',
          'getResponseData'
      ]),

      getSearchAreaStyle() {
        const { width } = this.getWindowInfo
        const contentWidth = width - 270 // 270 : sidebar width
        const cardOnRow = parseInt(contentWidth / (220 + 20)) // 220 : card width, 20 : margin

        return {
          width: `${(220 + 20) * cardOnRow}px`,
          paddingRight: '20px'
        }
      },

      getFilterList() {
        return [
          {
            name: $t('Market.OrderByPopular')
          },
          {
            name: $t('Market.OrderByNewest')
          },
          {
            name: $t('Market.OrderByLowestPrice')
          },
          {
            name: $t('Market.OrderByHighestPrice')
          }
        ]
      },

      getRegisterPath() {
        const { type } = this.$route.query

        if(type === 'buy') {
          return '/user/watchlist?tab=2'
        }

        if(type === 'sell') {
          return '/user/item?tab=2'
        }

        return '/'
      }
    },

    watch: {
      // 일단 여기서 보존하는 것. (newVal, oldVal)
      $route(newVal, oldVal) {
        if(newVal.query.search && newVal.query.search.length === 0) {
          if(newVal.query.type !== oldVal.query.type) {
            this.handleRefreshFilter();
          }
        }
      },

      getSearchFilter(newVal) {
        this.initPage(newVal)
      }
    },

    methods: {
      ...mapActions([
        'searchNft',
        'setSearchFilter',
        'clearSearchFilter',
        'updateSearchedNft',
        'clearSearchNft',
        'refreshTokenFilter',
        'setSideInfo'
      ]),

      initPage() {
        // 쿼리 기반 페이지 초기화
        this.handlePageByQuery({
          type: this.$route.query.type,
          ...this.getSearchFilter,
        })

        // 각 필터 검색 시 예상 total
        this.setSideInfo()
      },

      handlePageByQuery(filter) {
        const newQuery = {
          ...this.getSearchQuery(),
          type: filter.type
        }

        if(filter.page) {
          newQuery.page = filter.page
        }

        const newPath = qs.encode(newQuery)
        const prevPath = qs.encode(this.$route.query)

        this.searchNft({
          query: newQuery
        }).then(() => {
          if(newPath !== prevPath) {
            this.$router.replace({
              query: newQuery
            })
          }
        })
      },

      handleUpdateSelectedFilter(option) {
        this.selectedFilter = option
      },

      handleToggleItem(payload) {
        this.updateSearchedNft({
          list: _.map(this.getSearchedNft.list, row => {
            if(row.id === payload.id) {
              if(row.isExchange) {
                row.exchange.isLiked = payload
              }

              if(row.isAuction) {
                row.auction.liked = payload
              }
            }

            return row
          })
        })
      },

      // TODO : 다른 곳에서도 활용 가능하게 유틸화
      handleMainScroll: _.debounce(function(e) {
        // 로딩 중일때 중복 호출하지 않기
        if(this.getLoadingStatus.searchNft) {
          return
        }

        const { getSearchedNft } = this

        // 마지막 페이지를 조회 중이라면 당연히 뒤로 더 갈 수 없음
        if(getSearchedNft.maxPage === getSearchedNft.page) {
          return
        }

        const scrollAreaHeight = e.target.getBoundingClientRect().height
        const fixedHeight = this.getWindowInfo.height - scrollAreaHeight
        const scrollContentHeight = this.$refs.list.getBoundingClientRect().height

        // 최대 스크롤 = 실제 컨텐츠 높이 - 스크롤 영역 높이 + 상단 고정 영역 높이
        const maxScroll = scrollContentHeight - scrollAreaHeight + fixedHeight

        // 널널하게 최대 스크롤 - 30 정도만 되면 다음 페이지 로딩하기
        if(e.target.scrollTop > maxScroll - 30) {
          this.handlePageByQuery({
            type: this.$route.query.type,
            page: getSearchedNft.page + 1
          })
        }
      }, 50),

      async handleRefreshFilter() {
        const filterAboutToken = await this.refreshTokenFilter()

        this.clearSearchFilter({
          ...filterAboutToken
        })
      }
    },

    components: {
      CommonSearchDropdown,
      MainSidebar,
      AssetItemCard
    }
  }
</script>
