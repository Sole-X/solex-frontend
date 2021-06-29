<template>
  <section class="asset-item__description">
    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t('Market.OwnerTitle') }}
      </span>
      <span class="divider"></span>
      <span class="asset-item__hypen-row__value text-secondary">
        {{ getOwnerAddress }}
      </span>
    </div>

    <div class="asset-item__hypen-row">
      <span class="asset-item__hypen-row__label">
        {{ $t('Market.PublisherTitle') }}
      </span>
      <span class="divider"></span>
      <span
        :class="'asset-item__hypen-row__value text-secondary' + (havePublisher ? ' item-publisher' : '')"
        @click="publisherClicked"
      >
        {{ getPublisherName }}
      </span>
    </div>

    <article class="asset-item__description__article">
      {{ info.metadata ? info.metadata.description : '' }}
    </article>
  </section>
</template>

<script>
let $t, component;

export default {
  name: 'AssetItemDescriptionPage',
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
      if (info && info.isItemOnMyWallet) return $t('Market.OwnerIsMe');

      return '';
    },
    havePublisher() {
      const publisherName = this.getPublisherName;
      return !(publisherName == 'Unknown');
    },
    getPublisherName() {
      const { info } = this;
      if (info.tokenAddress == '0x2F5Dc7dCe80d30C122999087F41059d40Bc94c52') {
        if (
          [
            '492',
            '493',
            '494',
            '496',
            '498',
            '556',
            '557',
            '558',
            '559',
            '560',
            '595',
            '594',
            '593',
            '592',
            '591',
          ].includes(info.tokenId)
        ) {
          return 'KJM';
        } else if (['524', '526'].includes(info.tokenId)) {
          return 'CupOfTherapy';
        } else if (
          ['535', '536', '537', '538', '539', '540', '547', '548', '549', '550', '551', '552'].includes(info.tokenId)
        ) {
          return 'RisingSun';
        } else if (['544', '545', '546', '553', '554', '555'].includes(info.tokenId)) {
          return 'PhoenixValley';
        } else if (['570', '568', '566', '564', '562', '579', '577', '581', '575'].includes(info.tokenId)) {
          return 'KJH';
        } else if (['583', '585', '587', '589'].includes(info.tokenId)) {
          return 'Rosa Fantasy';
        } else if (['596', '597', '598', '600', '602'].includes(info.tokenId)) {
          return 'Chanchitos';
        } else if (['606', '607', '608', '609', '610'].includes(info.tokenId)) {
          return 'MUZIKTIGER';
        } else if (['614', '616', '618', '619'].includes(info.tokenId)) {
          return 'RosaFantasy';
        } else if (['621', '624', '625','640', '641', '642', '643'].includes(info.tokenId)) {
          return 'HANJUNGSUN';
        } else if (['629', '630', '631'].includes(info.tokenId)) {
          return 'NOONI';
        } else if (['632', '633', '634', '635'].includes(info.tokenId)) {
          return 'YEMIKIM';
        }
      }
      return 'Unknown';
    },
  },

  watch: {},

  methods: {
    publisherClicked(event) {
      const publisherName = this.getPublisherName;
      if (publisherName == 'Unknown') {
        return;
      }
      if (publisherName == 'KJM') {
        const targetURL = 'https://enftee.medium.com/kjm-1st-nft-collection-unbroken-heart-156b85d81094';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'CupOfTherapy') {
        const targetURL = 'https://www.instagram.com/cupoftherapy/';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'RisingSun') {
        const targetURL = 'https://enftee.medium.com/risingsun-artist-sole-x-dharma-series-41c372213ed5';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'PhoenixValley') {
        const targetURL = 'https://enftee.medium.com/phoenixvalley-artist-second-nft-series-eea950bd1197';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'KJH') {
        const targetURL = 'https://enftee.medium.com/the-innocence-of-current-affair-cartoonist-kjh-e2d1a6dac3c8';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'Rosa Fantasy') {
        const targetURL = 'https://enftee.medium.com/cyborg-farmer-6c68201fc7a9';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'Chanchitos') {
        const targetURL = 'https://www.instagram.com/mundochanchan/';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'MUZIKTIGER') {
        const targetURL = 'https://www.instagram.com/muziktiger/';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'RosaFantasy') {
        const targetURL = 'https://enftee.medium.com/rosafantasys-cyborg-the-beginning-4ba5850e0b11';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'HANJUNGSUN') {
        const targetURL = 'https://enftee.medium.com/hanjungsun-apartment-series-with-triumphx-5e1f5e09a825';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'NOONI') {
        const targetURL = 'https://enftee.medium.com/nooni-artist-first-nft-with-triumphx-5c1cf7db2037';
        window.open(targetURL, `publisher ${targetURL}`);
      } else if (publisherName == 'YEMIKIM') {
        const targetURL = 'https://www.instagram.com/yemikim_official/';
        window.open(targetURL, `publisher ${targetURL}`);
      } 
    },
  },

  components: {},
};
</script>
