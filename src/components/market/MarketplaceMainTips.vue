<template>
  <div class="market-home__tips">
    <swiper class="swiper" :options="swiperOptions">
      <swiper-slide v-for="(tip, i) in getMainTips" :key="i">
        <section class="market-home__tips__graphic">
          <img :src="tip.image" alt="tab image" />
        </section>

        <section class="market-home__tips__article">
          <h5>Tips</h5>

          <article>
            <div>
              <h1 class="market-home__tips__article__title">{{ tip.title }}</h1>
              <p class="market-home__tips__article__description">{{ tip.article }}</p>
            </div>
          </article>
        </section>
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
let $t, component;

export default {
  name: 'MarketplaceMainTips',
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {
      swiperOptions: {
        autoplay: {
          delay: 5000,
        },
        pagination: {
          type: 'bullets',
          clickable: true,
          el: '.swiper-pagination',
        },
        allowTouchMove: false,
      },
    };
  },

  computed: {
    getMainTips() {
      const { getFileURL } = this.$static;

      return [
        {
          title: $t('Market.MarketHomeTips1Title'),
          article: $t('Market.MarketHomeTips1Article'),
          image: getFileURL('img/article/article-main-tips-1.svg'),
        },
        {
          title: $t('Market.MarketHomeTips2')[0],
          article: $t('Market.MarketHomeTips2')[1],
          image: getFileURL('img/article/article-main-tips-2.svg'),
        },
        {
          title: $t('Market.MarketHomeTips3')[0],
          article: $t('Market.MarketHomeTips3')[1],
          image: getFileURL('img/article/article-main-tips-3.svg'),
        },
        {
          title: $t('Market.MarketHomeTips4')[0],
          article: $t('Market.MarketHomeTips4')[1],
          image: getFileURL('img/article/article-main-tips-4.svg'),
        },
        {
          title: $t('Market.MarketHomeTips5')[0],
          article: $t('Market.MarketHomeTips5')[1],
          image: getFileURL('img/article/article-main-tips-5.svg'),
        },
      ];
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
