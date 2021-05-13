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
        {{ getPublisherAddress }}
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
      const { info } = this;
      if (
        info.tokenAddress == "0x2F5Dc7dCe80d30C122999087F41059d40Bc94c52" &&
        [492, 493, 494, 496, 498].includes(info.tokenId)
      ) {
        return true;
      } else {
        return false;
      }
    },

    getPublisherAddress() {
      const { info } = this;
      if (this.havePublisher) {
        if (
          info.tokenAddress == "0x2F5Dc7dCe80d30C122999087F41059d40Bc94c52" &&
          [492, 493, 494, 496, 498].includes(info.tokenId)
        ) {
          return "KJM";
        }
      }
      return "Unknown";
    },
  },

  watch: {},

  methods: {
    publisherClicked(event) {
      if (!this.havePublisher) {
        return;
      }

      const targetURL =
        "https://enftee.medium.com/kjm-1st-nft-collection-unbroken-heart-156b85d81094";
      window.open(targetURL, `publisher ${targetURL}`);
    },
  },

  components: {},
};
</script>
