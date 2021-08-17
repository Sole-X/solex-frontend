<template>
  <footer
    :class="$bem('main-footer', '', $route.name === 'MarketHomePage' ? ['marketplace'] : [])"
    :style="
      meta && meta.maxWidth
        ? {
            maxWidth: meta.maxWidth,
          }
        : {}
    "
  >
    <div class="main-footer__title">
      <h4>Sole-X</h4>

      <div>
        <a v-for="site in getOurSites" :key="site.type" :href="site.url" target="_blank" rel="noopener noreferrer">
          <img :src="$static.getFileURL(`img/icon/${site.icon}`)" :alt="site.type" />
        </a>
      </div>
    </div>

    <div class="main-footer__writing">
      <div class="main-footer__description">
        <template v-if="$t('General.Language') === 'ENG'">
          The newly designed Sole-X, based on our innovative chain bridge,
          <br />
          enables easy and convenient trading in non-fungible tokens(NFT’s) and crypto collectibles.
        </template>
        <template v-else>
          크로스 체인 브리지를 기반으로 새롭게 디자인된 Sole-X는 대체 불가능<br />
          토큰(NFT) 및 암호화 수집품을 쉽고 편리하게 거래할 수 있게 해줍니다.
        </template>
      </div>
      <div v-if="false" class="main-footer__audit"><br />Audit Certification Mark</div>
    </div>

    <div class="main-footer__others">
      <div class="main-footer__links">
        <a class="underline" href="mailto:contact@sole-x.io" rel="noopener noreferrer">
          {{ $t('General.FooterContactUs') }}
        </a>

        <router-link class="underline" v-for="site in getPolicyLinks" :key="site.title" :to="{ path: site.url }">
          {{ site.title }}
        </router-link>
      </div>

      <div class="main-footer__copyright">Copyright© 2021 TriumphX. All Rights Reserved.</div>
    </div>
  </footer>
</template>

<script>
let $t, component;

export default {
  name: 'MainFooter',

  props: {
    meta: Object,
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
    getOurSites() {
      return [
        {
          type: 'doc',
          url: 'https://github.com/Sole-X/',
          icon: 'ic-doc.svg',
        },
        {
          type: 'twitter',
          url: 'https://twitter.com/solex_io',
          icon: 'ic-sns-twitter.svg',
        },
        {
          type: 'medium',
          url: 'https://medium.sole-x.io',
          icon: 'ic-medium-black.svg',
        },
        {
          type: 'contact',
          url: 'mailto:contact@sole-x.io',
          icon: 'ic-mail-black.svg',
        },
      ];
    },

    getPolicyLinks() {
      return [
        {
          url: '/customer/privacy-policy',
          title: this.$t('General.FooterPrivacyPolicy'),
        },
        {
          url: '/customer/usage-terms',
          title: this.$t('General.FooterTermsOfService'),
        },
        {
          url: '/customer/faq',
          title: this.$t('General.FooterFAQ'),
        },
      ];
    },

    data() {
      return {};
    },
  },

  watch: {},

  methods: {},

  components: {},
};
</script>
