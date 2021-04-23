<template>
  <section class="market-home__banner">
    <div class="market-home__banner__item-container">
      <div
          v-for="(item, i) in getBannerList"
          :class="`market-home__banner__item idx-${i}`"
          :data-idx="i"
          @click="(event) => bannerClicked(event, item.link)"
      >
        <div class="market-home__banner__item-content-container">
          <div class="market-home__banner__item-content-title">{{item.title}}</div>
          <div class="market-home__banner__item-content-description">
            <div v-for="desc in item.description">{{ desc }}</div>
          </div>
          <div class="market-home__banner__item-content-link">{{item.link}}</div>
        </div>
        <img :src="$static.getFileURL(item.img.src)" >
      </div>
    </div>
  </section>
</template>

<script>
let $t, self

export default {
  name: 'MarketplaceMainBanner',
  created() {
    self = this
    $t = this.$t.bind(this)
  },

  mounted() {

  },

  beforeDestroy() {

  },

  data() {
    return {

    }
  },

  computed: {
    getBannerList() {
      return [
        {
          title: 'Axie',
          description: ['Play to earn revolution', 'with Axie Infinity!'],
          link: 'www.Infinityaxieinfinity.com',
          img: {
            src: 'img/article/article-market-home-banner-axie.png'
          }
        },
        {
          title: 'JOYWORLD',
          description: ['Welcome to JOYWORLD!', 'Become a JOY Collector.'],
          link: 'www.joy.lol',
          img: {
            src: 'img/article/article-market-home-banner-joyworld.png'
          }
        },
        {
          title: 'DozerBird',
          description: ['DozerBird now live!', 'Test your tapping & timing!'],
          link: 'dozerbird.io',
          img: {
            src: 'img/article/article-market-home-banner-dozerbird.png'
          }
        },
      ]
    }
  },

  watch: {

  },

  methods: {
    bannerClicked(event, link) {
      const targetURL = `http://${link}`;
      window.open(targetURL, `banner ${link}`);
    }
  },

  components: {

  }
}
</script>