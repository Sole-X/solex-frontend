<template>
  <div>
    <section v-if="$route.query.mode === 'profile'" class="user-info-page">
      <user-detail-modify-profile />
    </section>

    <section v-else class="user-info-page">
      <article class="user-info__summary">
        <div class="user-info__summary__title">
          <h1>
            <strong>{{ $t("UserPage.TotalBalance") }}</strong>
          </h1>
          <button
            v-clipboard:copy="getUserInfo.address"
            v-clipboard:success="$_GlobalValueMixin_showCopyTooltip"
          >
            {{ getMaskedAddress(getUserInfo.address) }}
            <img
              :src="$static.getFileURL('img/icon/ic-copy-gray.svg')"
              alt="copy"
            />
          </button>
        </div>

        <div class="user-info__summary__user">
          <div class="user-info__summary__user__name">
            <img ref="profile_image" />
            <div class="user-info__summary__user__name-welcome">
              {{ $t("UserPage.WelcomeMessage") }}
            </div>
            <div class="user-info__summary__user__name-user">
              {{
                getUserInfo.username ||
                  getMaskedAddress(getUserInfo.address) ||
                  "No activity"
              }}
            </div>
            <router-link v-if="isShowSetting" :to="{ query: { mode: 'profile' } }">
              <button class="user-setting-link"></button>
            </router-link>
          </div>
        </div>

        <div class="user-info__summary__balance">
          <user-info-balance
            :type="0"
            :supportCurrency="[...getSupportCurrency].slice(0, 5)"
          >
            <div
              slot="itemInfo"
              :class="$bem('user-info-balance__token', '', ['nft'])"
            >
              <div class="user-info-balance__icon">
                <img
                  :src="$static.getFileURL(`img/logo/default-logo-wh.svg`)"
                  alt="nfts"
                />
              </div>

              <div :class="$bem('user-info-balance__info', '', ['overflow'])">
                <h6 class="text-gray">
                  {{ $t("General.Item")[1] }}
                </h6>
                <p>
                  <strong>{{ getUserBalance.nft.length }}</strong>
                </p>
              </div>
            </div>
          </user-info-balance>
        </div>
      </article>

      <article class="user-info__featured user-info__items">
        <div class="user-info__featured__head">
          <h4>
            <strong>{{ $t("UserPage.MyItems") }}</strong>
          </h4>
          <div class="arrow-right"></div>
        </div>

        <div class="user-info__featured__body carousel-arrow">
          <user-info-featured-filter
            :filters="getMyItemFilters"
            :selected="selectedTab.item"
            :onSelect="handleSelectItemFilter"
          />

          <swiper :options="swiperOptions">
            <swiper-slide v-for="item in getSelectedItems" :key="item.id">
              <asset-item-card-my-page :item="item" />
            </swiper-slide>
          </swiper>

          <button class="swiper-button-prev" />
          <button class="swiper-button-next" />
        </div>
      </article>

      <article class="user-info__featured user-info__items">
        <div class="user-info__featured__head">
          <h4>
            <strong>{{ $t("UserPage.MyAssets") }}</strong>
          </h4>
          <div class="arrow-right"></div>
        </div>

        <div class="user-info__featured__body">
          <user-info-featured-filter
            :filters="getMyBalanceFilters"
            :selected="selectedTab.asset"
            :onSelect="handleSelectAssetFilter"
          />
          <user-info-balance
            :type="selectedTab.asset.id - 1"
            :supportCurrency="getSelectedCurrency"
          />
        </div>
      </article>

      <article class="user-info__featured user-info__items">
        <div class="user-info__featured__head">
          <h4>
            <strong>{{ $t("UserPage.MyActivity") }}</strong>
          </h4>
          <div class="arrow-right"></div>
        </div>

        <div class="user-info__featured__body carousel-arrow">
          <user-info-featured-filter
            :filters="getMyActivityFilters"
            :selected="selectedTab.activity"
            :onSelect="handleSelectActivityFilter"
          />

          <user-history-item-table
            v-if="selectedTab.activity.id === 1"
            :list="getUserActivities.nft.list"
          />
          <user-history-asset-table
            v-if="selectedTab.activity.id === 2"
            :list="getUserActivities.currency.list"
          />
        </div>
      </article>

      <article class="user-info__featured user-info__items">
        <div class="user-info__featured__head">
          <h4>
            <strong>{{ $t("UserPage.MyWatchlist") }}</strong>
          </h4>
          <div class="arrow-right"></div>
        </div>

        <div class="user-info__featured__body carousel-arrow">
          <user-info-featured-filter
            :filters="getMyWatchlistFilters"
            :selected="selectedTab.watchlist"
            :onSelect="handleSelectWatchlistFilter"
          />

          <swiper :options="swiperOptions">
            <swiper-slide v-for="item in getSelectedWatchlist" :key="item.id">
              <!--<asset-item-card :info="item" :options="{ showChain: false, showHeart: false }" />-->
              <asset-item-card-my-page :item="item" />
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" slot="button-next" />
          </swiper>
        </div>
      </article>

      <article class="user-info__banner" @click="handleBannerLink()">
        <div class="user-info__banner__description">
          <h4>
            <strong>{{ $t("UserPage.OurSnsBannerTitle") }}</strong>
          </h4>
          <p v-html="$t('UserPage.OurSnsBannerDescription')" />
        </div>

        <button class="user-info__banner__link">
          <strong>{{ $t("UserPage.OurSnsBannerSubmit") }}</strong>
        </button>
      </article>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserInfoFeaturedFilter from "@/components/user/detail/UserInfoFeaturedFilter";
import AssetItemCard from "@/components/asset/item/AssetItemCard";
import AssetItemCardMyPage from "@/components/asset/item/AssetItemCardMyPage";
import UserInfoBalance from "@/components/user/detail/UserInfoBalance";
import UserDetailModifyProfile from "@/components/user/detail/UserDetailModifyProfile";
import UserHistoryItemTable from "@/components/user/detail/UserHistoryItemTable";
import UserHistoryAssetTable from "@/components/user/detail/UserHistoryAssetTable";

import axios from "axios";

let $t, component;

export default {
  name: "UserDetailMyInfoPage",
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {
    this.clearUserPageData();
  },

  data() {
    return {
      swiperOptions: {
        spaceBetween: 20,
        slidesPerView: "auto",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      selectedTab: {
        item: {
          id: 1,
          title: this.$t("UserPage.ShowInWallet"),
          total: 0,
        },
        asset: {
          id: 1,
          title: this.$t("UserPage.ShowInWallet"),
          total: 0,
        },
        activity: {
          id: 1,
          title: "Items",
          total: 0,
        },
        watchlist: {
          id: 1,
          title: this.$t("UserPage.RecentlyViewed"),
          total: 0,
        },
      },
    };
  },

  computed: {
    ...mapGetters([
      "getSupportCurrency",
      "getMaskedAddress",
      "getUserItems",
      "getUserBalance",
      "getUserActivities",
      "getUserWatchlist",
    ]),

    // TODO : Auction, On Sell
    getSelectedCurrency() {
      const { getSupportCurrency } = this;
      const selectedTab = this.selectedTab.asset;

      if (selectedTab.id === 1) {
        return _.filter(getSupportCurrency, (currency) => {
          return currency.balance.dcomp("0") === 1;
        });
      }

      if (selectedTab.id === 2) {
        return _.filter(getSupportCurrency, (currency) => {
          return currency.deposit.dcomp("0") === 1;
        });
      }

      return [];
    },

    getSelectedActivity() {
      const { getUserActivities } = this;
      const selectedTab = this.selectedTab.activity;

      if (selectedTab.id === 1) {
        return getUserActivities.nft;
      }

      return getUserActivities.currency;
    },

    getSelectedItems() {
      const { getUserBalance, getUserItems } = this;
      const selectedTab = this.selectedTab.item;

      if (selectedTab.id === 1) {
        //return getUserBalance.nft
      }

      if (selectedTab.id === 2) {
        return getUserItems.deposited;
      }

      return getUserItems.onTrade;
    },

    getSelectedWatchlist() {
      const { getUserWatchlist } = this;
      const selectedTab = this.selectedTab.watchlist;

      if (selectedTab.id === 1) {
        return getUserWatchlist.recent.list;
      }

      if (selectedTab.id === 2) {
        return getUserWatchlist.liked.list;
      }
    },

    getMyItemFilters() {
      const { getUserBalance, getUserItems } = this;

      return [
        {
          id: 1,
          title: $t("UserPage.ShowInWallet"),
          total: getUserBalance.nft.length,
        },
        {
          id: 2,
          title: $t("UserPage.ShowInReserve"),
          total: getUserItems.deposited.length,
        },
        {
          id: 3,
          title: $t("UserPage.ShowOnOffer"),
          total: getUserItems.onTrade.length,
        },
      ];
    },

    getMyBalanceFilters() {
      const { getSupportCurrency } = this;

      return [
        {
          id: 1,
          title: $t("UserPage.ShowInWallet"),
          total: _.filter(getSupportCurrency, (currency) => {
            return currency.balance.dcomp("0") === 1;
          }).length,
        },
        {
          id: 2,
          title: $t("UserPage.ShowInReserve"),
          total: _.filter(getSupportCurrency, (currency) => {
            return currency.deposit.dcomp("0") === 1;
          }).length,
        },
        {
          id: 3,
          title: $t("UserPage.ShowOnOffer"),
          total: _.filter(getSupportCurrency, (currency) => {
            return currency.onTrade.dcomp("0") === 1;
          }).length,
        },
      ];
    },

    getMyActivityFilters() {
      const { getUserActivities } = this;

      return [
        {
          id: 1,
          title: $t("General.Item")[0],
          total: getUserActivities.nft.total,
        },
        {
          id: 2,
          title: $t("General.Asset")[0],
          total: getUserActivities.currency.total,
        },
      ];
    },

    getMyWatchlistFilters() {
      const { getUserWatchlist } = this;

      return [
        {
          id: 1,
          title: $t("UserPage.RecentlyViewed"),
          total: getUserWatchlist.recent.total,
        },
        {
          id: 2,
          title: $t("UserPage.Liked"),
          total: getUserWatchlist.liked.total,
        },
      ];
    },

    getUserProfileImageSrc() {
      const baseURL = process.env.VUE_APP_API_ENDPOINT;
      const userAddress = this.getUserInfo.address;
      if (userAddress) {
        const pathURL = `images/${userAddress}.png`;
        const targetURL = `${baseURL}/${pathURL}`;

        axios
          .get(targetURL)
          .then((res) => {
            this.$refs.profile_image.src = targetURL;
          })
          .catch((res) => {
            this.$refs.profile_image.src = this.$static.getFileURL(
              "img/icon/ic-profile-default.svg"
            );
          });
      }
    },

    isShowSetting() {
      let isKlip = null;

      if (this.$wallet.getWallet().platform && this.$wallet.getWallet().platform.wallet) {
        isKlip = this.$wallet.getWallet().platform.wallet.name === 'klip';
      }

      if (isKlip) {
        return false;
      }
      return true;
    }
  },

  watch: {},

  methods: {
    ...mapActions([
      "setUserInfo",
      "setUserItems",
      "setUserActivities",
      "setUserWatchlist",
      "clearUserPageData",
    ]),

    initPage() {
      this.setUserInfo();
      this.setUserItems();
      this.setUserActivities();
      this.setUserWatchlist();

      this.getUserProfileImageSrc;
    },

    handleSelectItemFilter(option) {
      this.selectedTab.item = option;
    },

    handleSelectAssetFilter(option) {
      this.selectedTab.asset = option;
    },

    handleSelectActivityFilter(option) {
      this.selectedTab.activity = option;
    },

    handleSelectWatchlistFilter(option) {
      this.selectedTab.watchlist = option;
    },
    handleBannerLink() {
      window.open("https://twitter.com/solex_io", `_blank`);
    },
  },

  components: {
    UserDetailModifyProfile,
    UserInfoBalance,
    UserInfoFeaturedFilter,
    AssetItemCard,
    AssetItemCardMyPage,
    UserHistoryItemTable,
    UserHistoryAssetTable,
  },
};
</script>
