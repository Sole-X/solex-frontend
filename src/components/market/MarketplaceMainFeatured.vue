<template>
  <section class="market-home__featured">
    <swiper :options="swiperOptions">
      <swiper-slide v-for="(banner, i) in getBannerList" :key="i" :style="banner.slideStyle">
        <div class="market-home__featured__default" :style="banner.contentStyle" :class="banner.classes || []">
          <h1 v-html="banner.title"></h1>
          <p v-html="banner.desc"></p>

          <router-link :to="{ path: '/sell' }">
            <button :class="$bem('common-submit-button', '', ['primary'])">
              {{ $t('Market.BrowseItem') }}
            </button>
          </router-link>
        </div>
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </section>
</template>

<script>
  let $t, component

  export default {
    name: 'MarketplaceMainFeatured',
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
        swiperOptions: {
          pagination: {
            type: 'bullets',
            clickable: true,
            el: '.swiper-pagination'
          },
          allowTouchMove: false,
          loop: true,
          autoplay: {
            delay: 5000
          }
        }
      }
    },

    computed: {
      getBannerList() {
        return [
          {
            title: $t('Market.TopFeatured1Title'),
            desc: $t('Market.TopFeatured1Desc'),
            slideStyle: {
              backgroundColor: "rgb(199, 219, 225)"
            },
            contentStyle: {
              backgroundImage: `url(${this.$static.getFileURL('img/article/article-market-home-top-1.png')}`
            }
          },
          {
            title: $t('Market.TopFeatured3Title'),
            desc: $t('Market.TopFeatured3Desc'),
            slideStyle: {
              backgroundColor: '#231f20'
            },
            contentStyle: {
              backgroundImage: `url(${this.$static.getFileURL('img/article/article-market-home-top-2.png')}`
            },
            classes: ['bg-black']
          }
        ]
      }
    },

    watch: {},

    methods: {},

    components: {}
  }
</script>
