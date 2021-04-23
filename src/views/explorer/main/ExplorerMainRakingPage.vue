<template>
  <section class="explorer-main-ranking-page">
    <h1 class="explorer-main__title">
      <strong>{{$t('Explorer.RankingMenu')[0]}}</strong>
    </h1>

    <section class="main-item-search">
      <div class="main-item-search__notice">
        <span class="text-gray">
          {{$t('Explorer.RankingMenuDescription')}}
        </span>
      </div>
    </section>

    <div v-if="getLoadingStatus.getAllRanks">
      <common-loader />
    </div>

    <div v-else>
      <section class="explorer-main-ranking__featured">
        <h4>
          <strong>{{$t('Explorer.RankingFeaturedTitle')}}</strong>
        </h4>

        <div class="explorer-main-ranking__list">
          <div class="asset-item-card" v-for="(rank, i) in getTopRanks" :key="rank.tokenAddress">
            <section class="asset-item-card__thumbnail">
              <div class="asset-item-card__thumbnail__head">
                <label slot="leftLabel" class="asset-item-card__label__ranking">
                  {{i + 1}}{{['st', 'nd', 'rd'][i]}}
                </label>
              </div>
            </section>

            <section class="asset-item-card__detail">
              <div>
                <h6 class="asset-item-card__detail__collection">
                  {{rank.tokenAddress.slice(0, 8)}}
                </h6>
              </div>

              <div>
                <p class="asset-item-card__detail__price">

                </p>

                <p class="asset-item-card__detail__sub">
                <span class="asset-item-card__detail__sub__fiat">
                  $ {{rank.total.dprec(2) | addComma}}
                  <span class="asset-item-card__detail__sub__divider">
                    •
                  </span>
                </span>

                  <span class="asset-item-card__detail__sub__orders">
                  <img :src="$static.getFileURL('img/icon/ic-people-gray.svg')" alt="people" />
                  {{rank.ownerCnt | addComma}}
                </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="explorer-main__table">
        <div class="explorer-main__table__head">
          <div :class="$bem('explorer-main__table__col', '', [col.type])" v-for="(col, i) in getTableCols" :key="i">
            <span class="text-gray">{{col.title}}</span>
            <div class="explorer-main__table__sort">
              <button>
                <img
                  :src="$static.getFileURL(`img/icon/ic-triangle-top-${sortStatus[col.sortType] === 'asc' ? 'on' : 'off'}.svg`)"
                  alt="triangle to top"
                  @click="updateSortStatus(col.sortType, 'asc')"
                />
              </button>
              <button>
                <img
                  :src="$static.getFileURL(`img/icon/ic-triangle-bottom-${sortStatus[col.sortType] === 'desc' ? 'on' : 'off'}.svg`)"
                  alt="triangle to bottom"
                  @click="updateSortStatus(col.sortType, 'desc')"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="explorer-main__table__body">
          <div v-for="(rank, i) in getSortedList" :key="rank.tokenAddress" class="explorer-main__table__row">
            <div :class="$bem('explorer-main__table__col', '', ['rank'])">
              {{i + 1}}
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['token'])">
              <div></div>
              <div>{{rank.tokenAddress.slice(0, 8)}}</div>
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['volume'])">
              {{rank.total | addComma}} USD
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['volume'])">
              {{rank.week | addComma}} USD
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['change'])">
              {{rank.change}}%
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['price'])">
              {{rank.avgPrice | addComma}} USD
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['owner'])">
              {{rank.ownerCnt | addComma}}
            </div>

            <div :class="$bem('explorer-main__table__col', '', ['asset'])">
              {{rank.nftCnt | addComma}}
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PagerMixin from '@/mixins/PagerMixin'
  import CommonPager from '@/components/common/CommonPager'

  let $t, component

  export default {
    name: 'ExplorerMainRankingPage',
    mixins: [PagerMixin],
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
        sortStatus: { // asc or desc or false
          rank: 'desc',
          tokenName: false,
          totalVolume: false,
          weekVolume: false,
          weekChange: false,
          avgPrice: false,
          ownerCount: false,
          assetCount: false
        }
      }
    },

    computed: {
      ...mapGetters([
        'getAllRanks'
      ]),

      getTopRanks() {
        return [...this.getAllRanks.list].slice(0, 3)
      },

      getTableCols() {
        return [
          {
            title: $t('Explorer.RankingMenu')[1],
            type: 'rank',
            sortType: 'rank',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, (row, index) => {
                return orderType === 'asc' ? index : -index
              })
            }
          },
          {
            title: $t('Market.Collection'),
            type: 'token',
            sortType: 'tokenName',
            sortFunc: (list, orderType) => { // TODO : Name
              const toAsc = _.sortBy(list, row => {
                return row.tokenAddress
              })

              return orderType === 'asc' ? toAsc : toAsc.reverse()
            }
          },
          {
            title: $t('Explorer.RankingFilterTotalVolume'),
            type: 'volume',
            sortType: 'totalVolume',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.total)

                return orderType === 'asc' ? value : -value
              })
            }
          },
          {
            title: $t('Explorer.RankingFilterWeeksVolume'),
            type: 'volume',
            sortType: 'weekVolume',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.week)

                return orderType === 'asc' ? value : -value
              })
            }
          },
          {
            title: $t('Explorer.RankingFilterWeeksChange'),
            type: 'change',
            sortType: 'weekChange',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.change)

                return orderType === 'asc' ? value : -value
              })
            }
          },
          {
            title: $t('Explorer.RankingFilterAvgPrice'),
            type: 'price',
            sortType: 'avgPrice',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.avgPrice)

                return orderType === 'asc' ? value : -value
              })
            }
          },
          {
            title: $t('General.Owner'),
            type: 'owner',
            sortType: 'ownerCount',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.ownerCnt)

                return orderType === 'asc' ? value : -value
              })
            }
          },
          {
            title: $t('General.Asset')[0],
            type: 'asset',
            sortType: 'assetCount',
            sortFunc: (list, orderType) => {
              return _.sortBy(list, row => {
                const value = parseFloat(row.assetCount)

                return orderType === 'asc' ? value : -value
              })
            }
          }
        ]
      },

      getSortedList() {
        const { sortStatus } = this
        const { list } = this.getAllRanks
        const sortOption = _.find(this.getTableCols, col => {
          return sortStatus[col.sortType]
        })

        if(!sortOption) {
          return list
        }

        return sortOption.sortFunc(_.cloneDeep(list), sortStatus[sortOption.sortType])
      },

      getPageList() {
        const { page, maxPage } = this.getAllRanks

        return this.$_PagerMixin_getPageList(page, maxPage)
      }
    },

    watch: {},

    methods: {
      updateSortStatus(type, value) {
        if(this.sortStatus[type] === value) {
          this.sortStatus[type] = false
          return
        }

        const newState = _.cloneDeep(this.sortStatus)

        for(const key in newState) {
          newState[key] = key === type ? value : false
        }

        this.sortStatus = newState
      }
    },

    components: {
      CommonPager
    }
  }
</script>
