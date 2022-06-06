<template>
  <div class="market-home-page">
    <marketplace-main-featured />

    <section class="market-home__content">
      <nav class="marketplace__category">
        <ul>
          <li v-for="category in getFeaturedCategory" :key="category.label">
            <div :class="$bem('marketplace__category__tab', '', [category.type])" @click="category.click">
              <h2>
                <strong>{{ category.label }}</strong>
              </h2>

              <div class="marketplace__category__icon"></div>
            </div>
          </li>
        </ul>
      </nav>

      <marketplace-main-collection
        :category="'popular'"
        :title="$t('Market.MostPopularItems')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.popular"
      />

      <marketplace-main-collection
        :category="'recently'"
        :title="$t('Market.RecentlyItems')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.recently"
      />

      <marketplace-main-collection
        :category="'ethereum'"
        :title="$t('Market.EthereumChain')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.ethereum"
        :chain="'ethereum'"
      />

      <marketplace-main-collection
        :category="'klaytn'"
        :title="$t('Market.KlaytnChain')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.klaytn"
        :chain="'klaytn'"
      />

      <marketplace-main-collection
        :category="'collectibles'"
        :title="$t('Market.CollectibleItems')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.collectible"
      />

      <marketplace-main-collection
        :category="'recentlyView'"
        :title="$t('Market.RecentlyViewedItems')"
        :loading="getLoadingStatus.initMarketMain"
        :collections="getMarketMainList.recentlyViewed"
      />

      <marketplace-main-tips />

      <marketplace-main-banner />

      <marketplace-main-email />
    </section>
    <marketplace-popup />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MarketplaceMainFeatured from '@/components/market/MarketplaceMainFeatured';
import MarketplaceMainCollection from '@/components/market/MarketplaceMainCollection';
import MarketplaceMainTips from '@/components/market/MarketplaceMainTips';
import MarketplaceMainBanner from '@/components/market/MarketplaceMainBanner';
import MarketplaceMainEmail from '@/components/market/MarketplaceMainEmail';
import MarketplacePopup from '@/components/market/MarketplacePopup';

let $t, component;
let io;

export default {
  name: 'MarketHomePage',
  created() {
    component = this;
    $t = this.$t.bind(this);

    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          if (entry.target.hasChildNodes()) {
            const elem = entry.target.childNodes[0];
            const imgsrc = elem.dataset.imgsrc ? elem.dataset.imgsrc : '';
            if (imgsrc.length > 0) {
              elem.style.backgroundImage = `url(${imgsrc})`;
              elem.style.backgroundSize = 'contain';
            }
          }
        } else {
          // in current, no action.
        }
      });
    });
  },

  mounted() {
    this.initPage();
  },

  updated() {
    this.imageLazyLoading();
  },

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getMarketMainList']),

    getFeaturedCategory() {
      // TODO : 클릭 시 목록 페이지로 이동해 카테고리 자동 선택
      const { getFileURL } = this.$static;

      return [
        {
          label: 'All',
          type: 'all',
          icon: getFileURL('img/logo/default-logo-outline-primary.svg'),
          click: () => {
            this.$router.push({
              path: '/sell',
            });
          },
        },
        {
          label: 'ETH',
          type: 'ethereum',
          icon: getFileURL('img/icon/ic-chain-ethereum.svg'),
          click: () => {
            this.$router.push({
              path: '/sell',
              query: {
                blockchain: 'ETHEREUM',
              },
            });
          },
        },
        {
          label: 'KLAY',
          type: 'klaytn',
          icon: getFileURL('img/icon/ic-chain-klaytn.svg'),
          click: () => {
            this.$router.push({
              path: '/sell',
              query: {
                blockchain: 'KLAYTN',
              },
            });
          },
        },
        {
          label: 'Art',
          type: 'art',
          icon: getFileURL('img/icon/ic-main-category-art.svg'),
          click: () => {
            this.$router.push({
              path: '/sell',
              query: {
                categories: 'ART',
              },
            });
          },
        },
        {
          label: 'Games',
          type: 'game',
          icon: getFileURL('img/icon/ic-main-category-game.svg'),
          click: () => {
            Log('GAMES');
          },
        },
      ];
    },
  },

  watch: {
    getMarketMainList: function (newVal, oldVal) {},
  },

  methods: {
    ...mapActions(['initMarketMain']),

    async initPage() {
      await this.initMarketMain({ accountAddr: this.getUserInfo.address });
    },

    imageLazyLoading() {
      const imageElemList = document.querySelectorAll('.asset-item-card2');
      imageElemList.forEach((elem) => {
        io.observe(elem);
      });
    },
  },

  components: {
    MarketplaceMainTips,
    MarketplaceMainFeatured,
    MarketplaceMainCollection,
    MarketplaceMainBanner,
    MarketplaceMainEmail,
    MarketplacePopup,
  },
};
</script>
