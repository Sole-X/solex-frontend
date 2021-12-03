<template>
  <section class="market-home__featured">
    <swiper :options="swiperOptions">
      <swiper-slide v-for="(banner, i) in getBannerList" :key="i" :style="banner.slideStyle">
        <a :href="banner.link" :target="banner.link.startsWith('http') ? '_blank' : ''" rel="noreferrer nofollow">
          <!-- <router-link :to="{ path: banner.link }"> -->
          <div class="market-home__featured__default" :style="banner.contentStyle" :class="banner.classes || []">
            <!-- <h1 v-html="banner.title"></h1>
          <p v-html="banner.desc"></p> -->

            <!-- <router-link :to="{ path: '/sell' }">
            <button :class="$bem('common-submit-button', '', ['primary'])">
              {{ $t("Market.BrowseItem") }}
            </button>
          </router-link> -->
          </div>
          <!-- </router-link> -->
        </a>
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'MarketplaceMainFeatured',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      swiperOptions: {
        pagination: {
          type: 'bullets',
          clickable: true,
          el: '.swiper-pagination',
        },
        allowTouchMove: false,
        loop: true,
        autoplay: {
          delay: 5000,
        },
      },
    };
  },

  computed: {
    getBannerList() {
      return [
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#B8D7AD",
          },
          link: "https://sole-x.io/sell?search=SohnSeohyun",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/Solex_SohnSeohyun_Meditation_Garden_1440_320.jpg"
            )}`,
          },
        },        
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#ECECEC",
          },
          link: "https://sole-x.io/sell?search=Jeon",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/Solex_ASYAAF_NFT_1st_Series.jpg"
            )}`,
          },
        },
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#ECECEC",
          },
          link: "https://sole-x.io/sell?search=LyanHA",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/Solex_LyanHA_Dokkaebi_series_1440_320.jpg"
            )}`,
          },
        },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#C5E6EF',
          },
          link: 'https://sole-x.io/sell?search=yooniverse',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/Solex_yooniverse_1st_Series_RUNRUNRUN_1440_320.jpg')}`,
          },
        },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#C7B7A8',
          },
          link: 'https://www.sole-x.io/sell?search=collective%20yuwol',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/Solex_Collective_Yuwo_1440_320.jpg')}`,
          },
        },
        // {
        //   title: $t("Market.TopFeatured1Title"),
        //   desc: $t("Market.TopFeatured1Desc"),
        //   slideStyle: {
        //     backgroundColor: "#fed45c",
        //   },
        //   link:
        //     "https://medium.sole-x.io/sole-x-cross-chain-nft-marketplace-9a958cebe59e",
        //   contentStyle: {
        //     backgroundImage: `url(${this.$static.getFileURL(
        //       "img/article/article-market-home-top-launch.jpg"
        //     )}`,
        //   },
        // },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#F3DAB2',
          },
          link: '/sell?search=Namjeahyun',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/Solex_Namjeahyun_Passage_1440_320.jpg')}`,
          },
        },
        // {
        //   title: $t("Market.TopFeatured3Title"),
        //   desc: $t("Market.TopFeatured3Desc"),
        //   slideStyle: {
        //     backgroundColor: "#feb0c0",
        //   },
        //   contentStyle: {
        //     backgroundImage: `url(${this.$static.getFileURL(
        //       "img/article/article-market-home-top-2.jpg"
        //     )}`,
        //   },
        //   // classes: ["bg-black"],
        // },
        // {
        //   title: $t("Market.TopFeatured1Title"),
        //   desc: $t("Market.TopFeatured1Desc"),
        //   slideStyle: {
        //     backgroundColor: "#fefef6",
        //   },
        //   link: "/sell?search=Manul",
        //   contentStyle: {
        //     backgroundImage: `url(${this.$static.getFileURL(
        //       "img/article/article-market-home-top-3.jpg"
        //     )}`,
        //   },
        // },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#DBE0E2',
          },
          link: 'https://sole-x.io/sell?search=Enjo',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/solex_enjo_fetish_1440_320.jpg')}`,
          },
        },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#F5E9E9',
          },
          link: 'https://sole-x.io/sell?search=Byundaeyong',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/solex_Byundaeyong_1440_320.jpg')}`,
          },
        },
        {
          title: $t('Market.TopFeatured1Title'),
          desc: $t('Market.TopFeatured1Desc'),
          slideStyle: {
            backgroundColor: '#5AA23F',
          },
          link: 'https://sole-x.io/sell?search=C.One.C',
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL('img/article/solex_special_arts_1440_320.jpg')}`,
          },
        },
        // {
        //   title: $t("Market.TopFeatured1Title"),
        //   desc: $t("Market.TopFeatured1Desc"),
        //   slideStyle: {
        //     backgroundColor: "#e5e6e8",
        //   },
        //   link: "#",
        //   contentStyle: {
        //     backgroundImage: `url(${this.$static.getFileURL(
        //       "img/article/article-market-home-top-unbroken.jpg"
        //     )}`,
        //   },
        // },
      ];
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
