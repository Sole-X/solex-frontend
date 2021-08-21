<template>
  <section class="user-watchlist-page user-item-page">
    <article class="user-detail__title">
      <h1>
        <strong>{{ $t('UserPage.MyWatchlist') }}</strong>
      </h1>
    </article>

    <article class="user-collapsible user-item__in-wallet">
      <ui-collapsible ref="recentlyViewed">
        <user-collapsible-header
          slot="header"
          :title="$t('UserPage.RecentlyViewed')"
          :total="getSearchedWatchlist.recent.length"
        />

        <section v-if="getSearchedWatchlist.recent.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" />
            <h5>{{ $t('UserPage.EmptyItemsTitle') }}</h5>
            <p class="text-gray">{{ $t('UserPage.EmptyItemsDescription') }}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div class="user-item__list">
            <div class="asset-item-card" v-for="item in getSearchedWatchlist.recent" :key="item.id">
              <section
                class="asset-item-card__thumbnail"
                :style="$_AssetCardMixin_getImage(item)"
                @click="handleClickItem(item)"
              >
                <div class="asset-item-card__thumbnail__head">
                  <label class="asset-item-card__chain"> </label>
                </div>
              </section>

              <section class="asset-item-card__detail">
                <div>
                  <h6 class="asset-item-card__detail__collection">
                    {{ item.collectionName }}
                  </h6>
                  <label class="asset-item-card__detail__name">
                    {{ item.itemName }}
                  </label>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ui-collapsible>
    </article>

    <article class="user-collapsible user-item__in-wallet">
      <ui-collapsible ref="liked">
        <user-collapsible-header
          slot="header"
          :title="$t('UserPage.Liked')"
          :total="getSearchedWatchlist.liked.length"
        />

        <section v-if="getSearchedWatchlist.liked.length === 0" class="user-collapsible__content">
          <div class="user-collapsible_empty">
            <img :src="$static.getFileURL('img/icon/ic-info-black.svg')" />
            <h5>{{ $t('UserPage.EmptyItemsTitle') }}</h5>
            <p class="text-gray">{{ $t('UserPage.EmptyItemsDescription') }}</p>
          </div>
        </section>

        <section v-else class="user-collapsible__content">
          <div class="user-item__list">
            <div class="asset-item-card" v-for="item in getSearchedWatchlist.liked" :key="item.likedId">
              <section
                class="asset-item-card__thumbnail"
                :style="$_AssetCardMixin_getImage(item)"
                @click="handleClickItem(item, 'liked')"
              >
                <div class="asset-item-card__thumbnail__head">
                  <label class="asset-item-card__chain"> </label>
                </div>
              </section>

              <section class="asset-item-card__detail">
                <div>
                  <h6 class="asset-item-card__detail__collection">
                    {{ item.collectionName }}
                  </h6>
                  <label class="asset-item-card__detail__name">
                    {{ item.itemName }}
                  </label>
                </div>
              </section>
            </div>
          </div>

          <common-pager
            :pageList="getPageList.liked"
            :pageInfo="getUserWatchlist.liked"
            @onMovePage="(value) => handlePage($t('UserPage.Liked'), value)"
          />
        </section>
      </ui-collapsible>
    </article>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PagerMixin from '@/mixins/PagerMixin';
import AssetCardMixin from '@/mixins/asset/AssetCardMixin';
import UserCollapsibleMixin from '@/mixins/user/UserCollapsibleMixin';
import UserSearchMixin from '@/mixins/user/UserSearchMixin';
import CommonPager from '@/components/common/CommonPager';
import UserDetailSearch from '@/components/user/detail/UserDetailSearch';
import UserCollapsibleHeader from '@/components/user/detail/UserCollapsibleHeader';

let $t, component;

export default {
  name: 'UserMainWatchlistPage',
  mixins: [UserSearchMixin, PagerMixin, AssetCardMixin, UserCollapsibleMixin],
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {
    this.clearUserWatchlist();
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getSupportNft', 'getUserWatchlist', 'getUserWatchlistFilters']),

    getPageList() {
      const { recent, liked } = this.getUserWatchlist;

      return {
        liked: this.$_PagerMixin_getPageList(liked.page, liked.maxPage),
        recent: this.$_PagerMixin_getPageList(recent.page, recent.maxPage),
      };
    },

    // TODO : API, 찜 목록 검색 기능
    getSearchedWatchlist() {
      const { recent, liked } = this.getUserWatchlist;
      const { searchedKeyword } = this.getUserWatchlistFilters;

      return {
        liked: _.filter(liked.list, (item) => {
          return this.$_UserSearchMixin_searchItem(item, searchedKeyword);
        }),
        recent: _.filter(recent.list, (item) => {
          return this.$_UserSearchMixin_searchItem(item, searchedKeyword);
        }),
      };
    },
  },

  watch: {},

  methods: {
    ...mapActions([
      'setUserWatchlist',
      'setUserWatchlistFilters',
      'setRecentViewOfUser',
      'setLikedItemsOfUser',
      'clearUserWatchlist',
    ]),

    async initPage() {
      await this.setUserWatchlist();
      this.$nextTick(this.initCollapsibleStatus);
    },

    initCollapsibleStatus() {
      const { $refs } = this;

      this.$_UserCollapsibleMixin_initCollapsible([$refs.recentlyViewed, $refs.liked]);
    },

    handleClickItem(item, type) {
      const query = {};

      // 찜 목록은 넘겨야될 tradeId가 likeTradeId
      if (item.isAuction || item.isExchange) {
        query.type = item.isBuy ? 'buy' : 'sell';
        query.tradeId = type === 'liked' ? item.likeTradeId : item.tradeId;
      }

      this.$router.push({
        path: `/asset/item/${item.tokenAddress}/${item.tokenId}`,
        query,
      });
    },

    handlePage(type, value) {
      if (type === $t('UserPage.Liked')) {
        return this.setLikedItemsOfUser({
          query: {
            page: value,
          },
        });
      }
    },

    handleInputWatchlistKeyword(keyword) {
      this.setUserWatchlistFilters({
        keyword,
      });
    },

    handleSearchUserWatchlist() {
      const prevState = _.cloneDeep(this.getUserWatchlistFilters);
      const alreadySearched = _.find(prevState.searchedKeyword, (keyword) => {
        return prevState.keyword === keyword.value;
      });

      if (alreadySearched || !prevState.keyword) {
        return;
      }

      this.setUserWatchlistFilters({
        keyword: '',
        searchedKeyword: [{ value: prevState.keyword }, ...prevState.searchedKeyword],
      });
    },

    handleRemoveKeyword(filter) {
      this.setUserWatchlistFilters({
        searchedKeyword: _.filter(this.getUserWatchlistFilters.searchedKeyword, (keyword) => {
          return filter.value !== keyword.value;
        }),
      });
    },
  },

  components: {
    CommonPager,
    UserDetailSearch,
    UserCollapsibleHeader,
  },
};
</script>
