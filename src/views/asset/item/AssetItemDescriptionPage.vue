<template>
  <section class="asset-item__description">
    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t("Market.OwnerTitle") }}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value text-secondary">
        {{ getOwnerAddress }}
      </span>
    </div>

    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t("Market.PublisherTitle") }}
      </span>
      <span class="divider"></span>
      <span
        :class="
          'asset-item__hypen-row__value text-secondary' +
            (havePublisher ? ' item-publisher' : '')
        "
        @click="publisherClicked"
      >
        {{ getPublisherName }}
      </span>
    </div>

    <article class="asset-item__description__article">
      {{ info.metadata ? info.metadata.description : "" }}
    </article>
  </section>
</template>

<script>
let $t, component;

export default {
  name: "AssetItemDescriptionPage",
  props: {
    info: Object,
    history: Object,
  },
  created() {
    component = this;
    $t = this.$t.bind(this);
  },

  mounted() {},

  beforeDestroy() {},

  data() {
    return {};
  },

  computed: {
    getOwnerAddress() {
      const { info } = this;

      if (info && info.ownerAddress) return info.ownerAddress;
      if (info && info.isItemOnMyWallet) return $t("Market.OwnerIsMe");

      return "";
    },
    havePublisher() {
      const publisherName = this.getPublisherName;
      return !(publisherName == "Unknown");
    },
    getPublisherName() {
      const { info } = this;
      if (info.tokenAddress == "0x2F5Dc7dCe80d30C122999087F41059d40Bc94c52") {
        if (
          [
            "492",
            "493",
            "494",
            "496",
            "498",
            "556",
            "557",
            "558",
            "559",
            "560",
          ].includes(info.tokenId)
        ) {
          return "KJM";
        } else if (["524", "526"].includes(info.tokenId)) {
          return "CupOfTherapy";
        } else if (
          [
            "535",
            "536",
            "537",
            "538",
            "539",
            "540",
            "547",
            "548",
            "549",
            "550",
            "551",
            "552",
          ].includes(info.tokenId)
        ) {
          return "RisingSun";
        } else if (
          ["544", "545", "546", "553", "554", "555"].includes(info.tokenId)
        ) {
          return "PhoenixValley";
        }
      }
      return "Unknown";
    },
  },

  watch: {},

  methods: {
    publisherClicked(event) {
      const publisherName = this.getPublisherName;
      if (publisherName == "Unknown") {
        return;
      }
      if (publisherName == "KJM") {
        const targetURL =
          "https://enftee.medium.com/kjm-1st-nft-collection-unbroken-heart-156b85d81094";
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == "CupOfTherapy") {
        const targetURL = "https://www.instagram.com/cupoftherapy/";
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == "RisingSun") {
        const targetURL =
          "https://enftee.medium.com/risingsun-artist-sole-x-dharma-series-41c372213ed5";
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == "PhoenixValley") {
        const targetURL =
          "https://enftee.medium.com/phoenixvalley-artist-second-nft-series-eea950bd1197";
        window.open(targetURL, `publisher ${targetURL}`);
      }
    },
  },

  components: {},
};
</script>
