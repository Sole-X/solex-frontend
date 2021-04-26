<template>
  <section class="market-home__banner">
    <div class="market-home__banner__item-container">
      <div
        v-for="(item, i) in getBannerList"
        :class="`market-home__banner__item idx-${i}`"
        :key="i"
        :data-idx="i"
        @click="(event) => bannerClicked(event, item.link)"
      >
        <div class="market-home__banner__item-content-container">
          <!-- <div class="market-home__banner__item-content-title">
            {{ item.title }}
          </div>
          <div class="market-home__banner__item-content-description">
            <div v-for="desc in item.description" :key="desc">{{ desc }}</div>
          </div>
          <div class="market-home__banner__item-content-link">
            {{ item.link }}
          </div> -->
        </div>
        <img :src="$static.getFileURL(item.img.src)" />
      </div>
    </div>
  </section>
</template>

<script>
let $t, self;

export default {
  name: "MarketplaceMainBanner",
  created() {
    self = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    getBannerList() {
      return [
        {
          title: "Phoenix Valley",
          description: [
            "The freedom and healing of",
            "colors within the horse",
          ],
          link: "www.enftee.com",
          img: {
            src: "img/article/article-market-home-banner-phoenix.jpg",
          },
        },
        {
          title: "K Museum Contemporary Art",
          description: ["We Create, Present,", "And Do Magic"],
          link: "www.enftee.com",
          img: {
            src: "img/article/article-market-home-banner-museum.jpg",
          },
        },
        {
          title: "TOPNFT.WORLD",
          description: ["NFT Awards", "Since NFT Deserves fun"],
          link: "www.topnft.world",
          img: {
            src: "img/article/article-market-home-banner-topnft.jpg",
          },
        },
      ];
    },
  },

  watch: {},

  methods: {
    bannerClicked(event, link) {
      const targetURL = `http://${link}`;
      window.open(targetURL, `banner ${link}`);
    },
  },

  components: {},
};
</script>
