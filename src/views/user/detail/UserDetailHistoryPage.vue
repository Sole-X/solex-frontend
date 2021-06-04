<template>
  <section class="user-history-page">
    <article class="user-detail__title">
      <h1>
        <strong>{{$t('UserPage.MyActivity')}}</strong>
      </h1>
    </article>

    <article class="user-collapsible user-history__item">
      <ui-collapsible ref="items">
        <user-collapsible-header
            slot="header"
            :title="$t('General.Item')[1]"
            :total="getUserActivities.nft.total"
            :sortby="getIsSortby('items')"
            :propSortbyKey="sortbyKey"
            v-on:update:sortbyKey="setData"
        />

        <section v-if="getUserActivities.nft.total === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')">
            <h5>{{$t('UserPage.EmptyDataTitle')}}</h5>
            <p class="text-gray">{{$t('UserPage.EmptyDataDescription2')}}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <user-history-item-table :list="getUserActivities.nft.list" />

          <common-pager
            :pageList="getPageList.nft"
            :pageInfo="getUserActivities.nft"
            @onMovePage="(value) => handlePage('nft', value)"
          />
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-history__asset">
      <ui-collapsible ref="assets">
        <user-collapsible-header slot="header" :title="$t('General.Asset')[1]" :total="getUserActivities.currency.total" />

        <section v-if="getUserActivities.currency.total === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')">
            <h5>{{$t('UserPage.EmptyDataTitle')}}</h5>
            <p class="text-gray">{{$t('UserPage.EmptyDataDescription2')}}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <user-history-asset-table :list="getUserActivities.currency.list" />

          <common-pager
            :pageList="getPageList.currency"
            :pageInfo="getUserActivities.currency"
            @onMovePage="(value) => handlePage('currency', value)"
          />
        </section>
      </ui-collapsible>
    </article>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import PagerMixin from '@/mixins/PagerMixin'
  import UserCollapsibleMixin from '@/mixins/user/UserCollapsibleMixin'
  import UserSearchMixin from '@/mixins/user/UserSearchMixin'
  import CommonPager from '@/components/common/CommonPager'
  import UserDetailSearch from '@/components/user/detail/UserDetailSearch'
  import UserHistoryItemTable from '@/components/user/detail/UserHistoryItemTable'
  import UserHistoryAssetTable from '@/components/user/detail/UserHistoryAssetTable'
  import UserCollapsibleHeader from '@/components/user/detail/UserCollapsibleHeader'

  let $t, component

  export default {
    name: 'UserDetailHistoryPage',
    mixins: [UserSearchMixin, PagerMixin, UserCollapsibleMixin],
    created() {
      component = this
      $t = this.$t.bind(this)
    },

    mounted() {
      this.initPage()
    },

    updated() {

    },

    beforeDestroy() {
      this.clearUserActivities()
    },

    data() {
      return {
        sortbyKey: 'Sort by',
      }
    },

    computed: {
      ...mapGetters([
        'getSupportNft',
        'getUserActivities',
        'getUserActivityFilters'
      ]),

      getPageList() {
        const { nft, currency } = this.getUserActivities

        return {
          nft: this.$_PagerMixin_getPageList(nft.page, nft.maxPage),
          currency: this.$_PagerMixin_getPageList(currency.page, currency.maxPage)
        }
      },
    },

    watch: {
      sortbyKey (newVal, oldVal) {
        if (newVal === 'Sort by') return;
        if (newVal === 'All') {
          this.initPage({

          });
        } else if (newVal === 'In Progress') {
          this.initPage({
            query: {
              status: 'ING'
            }
          });
        } else if (newVal === 'Complete') {
          this.initPage({
            query: {
              status: 'DONE'
            }
          });
        }
      }
    },

    methods: {
      ...mapActions([
        'setUserActivities',
        'setUserActivityFilters',
        'setNftActivities',
        'setAssetActivities',
        'clearUserActivities'
      ]),

      initPage(option = {}) {
        this.setUserActivities(option)
      },

      initCollapsibleStatus() {
        const { $refs } = this

        this.$_UserCollapsibleMixin_initCollapsible([
          $refs.items,
          $refs.assets
        ])
      },

      handleInputItemKeyword(keyword) {
        this.setUserActivityFilters({
          keyword
        })
      },

      async handleSearchUserItems() {
        const prevState = _.cloneDeep(this.getUserActivityFilters)
        const alreadySearched = _.find(prevState.searchedKeyword, keyword => {
          return prevState.keyword === keyword.value
        })

        if(alreadySearched || !prevState.keyword) {
          return
        }

        await this.setUserActivityFilters({
          keyword: '',
          searchedKeyword: [{ value: prevState.keyword }, ...prevState.searchedKeyword]
        })

        this.initPage({
          query: {
            ...this.getSearchQueryForHistory(),
            page: 1
          }
        })
      },

      async handleRemoveKeyword(filter) {
        await this.setUserActivityFilters({
          searchedKeyword: _.filter(this.getUserActivityFilters.searchedKeyword, keyword => {
            return filter.value !== keyword.value
          })
        })

        this.initPage({
          query: {
            ...this.getSearchQueryForHistory(),
            page: 1
          }
        })
      },

      handlePage(type, value) {
        if(type === 'nft') {
          return this.setNftActivities({
            query: {
              page: value
            }
          })
        }

        return this.setAssetActivities({
          query: {
            page: value
          }
        })
      },

      getSearchQueryForHistory() {
        const result = {
          collection: [],
          event: [],
          txHash: []
        }
        const { nft, currency } = this.getUserActivities
        const { searchedKeyword } = this.getUserActivityFilters

        if(searchedKeyword.length === 0) {
          return {}
        }

        for(const item of this.getSupportNft) {
          const alreadyPushed = _.find(result.collection, row => {
            return this.$wallet.isSameAddress(row, item.currentAddress)
          })
          const searched = this.$_UserSearchMixin_searchItem(item, searchedKeyword)

          if(!alreadyPushed && searched) {
            result.collection.push(item.currentAddress)
          }
        }

        for(const activity of [...nft.list, ...currency.list]) {
          const alreadyPushedEvent = _.find(result.event, row => {
            return activity.eventTypeToString === row
          })
          const searchedEvent = this.$_UserSearchMixin_searchEvent(activity, searchedKeyword)

          if(!alreadyPushedEvent && searchedEvent) {
            result.event.push(activity.eventTypeToString)
          }

          const alreadyPushedTx = _.find(result.txHash, row => {
            return activity.txHash === row
          })
          const searchedTx = this.$_UserSearchMixin_searchTx(activity, searchedKeyword)

          if(!alreadyPushedTx && searchedTx) {
            result.txHash.push(activity.txHash)
          }
        }

        result.collection = result.collection.join(',')
        result.event = result.event.join(',')
        result.txHash = result.txHash.join(',')

        // 유효하지 않은 쿼리는 애초에 거르고 반환하기
        return _.pickBy(result, queryType => {
          return queryType
        })
      },

      getIsSortby(key) {
        return this.$refs[key]?.isOpen;
      },

      setData(key, value) {
        this[key] = value;
      },
    },

    components: {
      CommonPager,
      UserDetailSearch,
      UserCollapsibleHeader,
      UserHistoryItemTable,
      UserHistoryAssetTable
    }
  }
</script>
