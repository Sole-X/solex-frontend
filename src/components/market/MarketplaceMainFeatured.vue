<template>
  <section class="market-home__featured">
    <swiper :options="swiperOptions">
      <swiper-slide
        v-for="(banner, i) in getBannerList"
        :key="i"
        :style="banner.slideStyle"
      >
        <a
          :href="banner.link"
          :target="banner.link.startsWith('http') ? '_blank' : ''"
          rel="noreferrer nofollow"
        >
          <!-- <router-link :to="{ path: banner.link }"> -->
          <div
            class="market-home__featured__default"
            :style="banner.contentStyle"
            :class="banner.classes || []"
          >
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
  name: "MarketplaceMainFeatured",
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
          type: "bullets",
          clickable: true,
          el: ".swiper-pagination",
        },
        allowTouchMove: false,
        loop: false,
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
            backgroundColor: "#04b3e2",
          },
          link:
            "https://medium.sole-x.io/sole-x-cross-chain-nft-marketplace-9a958cebe59e",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/article-market-home-top-launch.jpg"
            )}`,
          },
        },
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#202020",
          },
          link: "/sell?search=Phoenix",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/article-market-home-top-1.jpg"
            )}`,
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
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#fefef6",
          },
          link: "/sell?search=Manul",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/article-market-home-top-3.jpg"
            )}`,
          },
        },
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#202342",
          },
          link: "https://topnft.world/",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/article-market-home-top-4.jpg"
            )}`,
          },
        },
        {
          title: $t("Market.TopFeatured1Title"),
          desc: $t("Market.TopFeatured1Desc"),
          slideStyle: {
            backgroundColor: "#e5e6e8",
          },
          link: "#",
          contentStyle: {
            backgroundImage: `url(${this.$static.getFileURL(
              "img/article/article-market-home-top-unbroken.jpg"
            )}`,
          },
        },
      ];
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
